# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

import csv
import math
from calendar import monthrange
from dataclasses import dataclass
from datetime import UTC, date, datetime, timedelta
from pathlib import Path
from statistics import mean
from typing import Any
from uuid import uuid4

from app.services.repository import PostgresRepository
from app.storage.minio_store import ObjectStorage


MODEL_NAMES = {
    "prophet": "Prophet-like",
    "ets": "ETS",
    "sarima": "SARIMA-like",
    "featureMl": "LightGBM/XGBoost-like",
    "neuralProphet": "NeuralProphet-like",
    "nbeats": "N-BEATS-like",
    "movingAverage": "Moving Average",
    "seasonalNaive": "Seasonal Naive",
}


@dataclass(frozen=True)
class SeriesPoint:
    ds: date
    y: float


@dataclass(frozen=True)
class ModelResult:
    model_id: str
    model_name: str
    metrics: dict[str, float | None]
    fitted: list[dict[str, Any]]
    forecast: list[dict[str, Any]]


def run_baseline_experiment(
    job_id: str,
    output_root: Path,
    repo: PostgresRepository,
    object_storage: ObjectStorage | None = None,
) -> dict[str, Any]:
    """Run a lightweight multi-model forecasting experiment.

    This intentionally avoids heavyweight optional model packages in the first
    deployable backend, but each runner has distinct fitting logic, validation
    metrics, fitted output, forecast output, and export files.
    """

    job = repo.get_job(job_id)
    if not job:
        raise ValueError(f"Forecast job not found: {job_id}")
    dataset = repo.get_dataset(job["dataset_id"])
    if not dataset:
        raise ValueError(f"Dataset not found: {job['dataset_id']}")

    repo.update_job(job_id, status="running", started_at=datetime.now(UTC))

    date_column = job.get("date_column") or dataset["column_guess"].get("date_column")
    value_column = job.get("value_column") or dataset["column_guess"].get("metric_columns", [None])[0]
    if not date_column or not value_column:
        raise ValueError("date_column and value_column are required")

    series = _read_series(Path(dataset["storage_path"]), date_column, value_column)
    if len(series) < 3:
        raise ValueError("At least 3 valid numeric rows are required")

    cadence = _resolve_cadence(job.get("cadence") or "auto", series)
    horizon = int(job.get("horizon") or 30)
    future_dates = _future_dates(series[-1].ds, horizon, cadence)
    models = job.get("models") or ["prophet", "ets", "sarima", "featureMl", "movingAverage"]

    experiment_id = str(uuid4())
    experiment_dir = output_root / job_id
    experiment_dir.mkdir(parents=True, exist_ok=True)

    results = [_run_model(model_id, series, future_dates, cadence) for model_id in models]
    ranked_results = _rank_results(results)
    recommended_model = ranked_results[0].model_id if ranked_results else job.get("primary_model")

    model_runs = []
    for rank, result in enumerate(ranked_results, start=1):
        forecast_path = experiment_dir / f"{result.model_id}_forecast.csv"
        fitted_path = experiment_dir / f"{result.model_id}_fitted.csv"
        _write_csv(
            forecast_path,
            ["date", "period", "yhat", "yhat_lower", "yhat_upper"],
            result.forecast,
        )
        _write_csv(
            fitted_path,
            ["date", "actual", "yhat", "error"],
            result.fitted,
        )

        forecast_object = None
        fitted_object = None
        if object_storage and object_storage.enabled():
            forecast_object = object_storage.put_file(
                f"outputs/{job_id}/{result.model_id}_forecast.csv",
                forecast_path,
                "text/csv",
            )
            fitted_object = object_storage.put_file(
                f"outputs/{job_id}/{result.model_id}_fitted.csv",
                fitted_path,
                "text/csv",
            )

        model_runs.append(
            {
                "id": f"{job_id}-{result.model_id}",
                "model_id": result.model_id,
                "model_name": result.model_name,
                "rank": rank,
                "metrics": result.metrics,
                "forecast_path": str(forecast_path),
                "forecast_object": forecast_object,
                "forecast_download_url": (
                    f"/api/experiments/{experiment_id}/models/{result.model_id}/forecast.csv"
                ),
                "fitted_path": str(fitted_path),
                "fitted_object": fitted_object,
                "fitted_download_url": (
                    f"/api/experiments/{experiment_id}/models/{result.model_id}/fitted.csv"
                ),
            }
        )

    experiment = repo.create_experiment(
        {
            "id": experiment_id,
            "job_id": job_id,
            "dataset_id": dataset["id"],
            "recommended_model": recommended_model,
            "summary": {
                "target_metric": value_column,
                "primary_model": job.get("primary_model"),
                "cadence": cadence,
                "horizon": horizon,
                "history_rows": len(series),
                "validation_rows": _validation_size(len(series)),
                "selection_metric": "wape",
                "model_rankings": [
                    {
                        "model_id": run["model_id"],
                        "model_name": run["model_name"],
                        "rank": run["rank"],
                        "wape": run["metrics"].get("wape"),
                        "mape": run["metrics"].get("mape"),
                    }
                    for run in model_runs
                ],
                "note": "Recommended model is selected by lowest validation WAPE when enough history is available.",
            },
            "models": model_runs,
        }
    )
    repo.update_job(
        job_id,
        status="succeeded",
        experiment_id=experiment["id"],
        finished_at=datetime.now(UTC),
    )
    return experiment


def _read_series(path: Path, date_column: str, value_column: str) -> list[SeriesPoint]:
    rows: list[SeriesPoint] = []
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            try:
                ds = _parse_date(row[date_column])
                y = max(0.0, float(str(row[value_column]).replace(",", "")))
            except (KeyError, TypeError, ValueError):
                continue
            rows.append(SeriesPoint(ds=ds, y=y))
    grouped: dict[date, list[float]] = {}
    for row in rows:
        grouped.setdefault(row.ds, []).append(row.y)
    return [
        SeriesPoint(ds=ds, y=sum(values))
        for ds, values in sorted(grouped.items(), key=lambda item: item[0])
    ]


def _parse_date(value: str) -> date:
    text = str(value).strip()
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%Y-%m", "%Y/%m", "%m/%d/%Y", "%d/%m/%Y"):
        try:
            parsed = datetime.strptime(text, fmt)
            return parsed.date().replace(day=1) if fmt in {"%Y-%m", "%Y/%m"} else parsed.date()
        except ValueError:
            pass
    return datetime.fromisoformat(text).date()


def _resolve_cadence(cadence: str, series: list[SeriesPoint]) -> str:
    normalized = cadence.lower()
    if normalized in {"day", "daily", "d", "1d"}:
        return "day"
    if normalized in {"week", "weekly", "w", "1w"}:
        return "week"
    if normalized in {"month", "monthly", "m", "1m"}:
        return "month"
    deltas = [(series[index].ds - series[index - 1].ds).days for index in range(1, len(series))]
    avg_delta = mean(deltas) if deltas else 1
    if avg_delta >= 27:
        return "month"
    if avg_delta >= 6:
        return "week"
    return "day"


def _future_dates(last_date: date, horizon: int, cadence: str) -> list[date]:
    if cadence == "month":
        return [_add_months(last_date, step) for step in range(1, horizon + 1)]
    if cadence == "week":
        return [last_date + timedelta(days=7 * step) for step in range(1, horizon + 1)]
    return [last_date + timedelta(days=step) for step in range(1, horizon + 1)]


def _add_months(value: date, months: int) -> date:
    month_index = value.month - 1 + months
    year = value.year + month_index // 12
    month = month_index % 12 + 1
    day = min(value.day, _days_in_month(year, month))
    return date(year, month, day)


def _days_in_month(year: int, month: int) -> int:
    return monthrange(year, month)[1]


def _validation_size(history_size: int) -> int:
    if history_size < 8:
        return max(1, history_size // 4)
    return min(12, max(3, history_size // 5))


def _run_model(
    model_id: str,
    series: list[SeriesPoint],
    future_dates: list[date],
    cadence: str,
) -> ModelResult:
    validation_size = _validation_size(len(series))
    train = series[:-validation_size] if validation_size else series
    validation = series[-validation_size:] if validation_size else []

    validation_pred = _predict(model_id, train, [point.ds for point in validation], cadence)
    metrics = _metrics([point.y for point in validation], validation_pred) if validation else _empty_metrics()

    history_pred = _predict(model_id, series, [point.ds for point in series], cadence, fitted=True)
    fitted = [
        {
            "date": point.ds.isoformat(),
            "actual": round(point.y, 4),
            "yhat": round(max(0.0, prediction), 4),
            "error": round(point.y - max(0.0, prediction), 4),
        }
        for point, prediction in zip(series, history_pred, strict=False)
    ]

    future_pred = [max(0.0, value) for value in _predict(model_id, series, future_dates, cadence)]
    spread = _interval_spread([row["error"] for row in fitted], [point.y for point in series])
    forecast = [
        {
            "date": ds.isoformat(),
            "period": index,
            "yhat": round(yhat, 4),
            "yhat_lower": round(max(0.0, yhat - spread), 4),
            "yhat_upper": round(yhat + spread, 4),
        }
        for index, (ds, yhat) in enumerate(zip(future_dates, future_pred, strict=False), start=1)
    ]

    return ModelResult(
        model_id=model_id,
        model_name=MODEL_NAMES.get(model_id, model_id),
        metrics=metrics,
        fitted=fitted,
        forecast=forecast,
    )


def _predict(
    model_id: str,
    history: list[SeriesPoint],
    target_dates: list[date],
    cadence: str,
    fitted: bool = False,
) -> list[float]:
    values = [point.y for point in history]
    if not values:
        return [0.0 for _ in target_dates]
    if model_id == "ets":
        return _ets_predict(values, len(target_dates), fitted=fitted)
    if model_id == "sarima":
        return _seasonal_predict(values, len(target_dates), cadence, with_trend=True, fitted=fitted)
    if model_id == "featureMl":
        return _regression_predict(history, target_dates, cadence, rich=True)
    if model_id == "neuralProphet":
        reg = _regression_predict(history, target_dates, cadence, rich=True)
        ets = _ets_predict(values, len(target_dates), fitted=fitted)
        return [(a * 0.65) + (b * 0.35) for a, b in zip(reg, ets, strict=False)]
    if model_id == "nbeats":
        seasonal = _seasonal_predict(values, len(target_dates), cadence, with_trend=False, fitted=fitted)
        trend = _ets_predict(values, len(target_dates), fitted=fitted)
        return [(a * 0.45) + (b * 0.55) for a, b in zip(seasonal, trend, strict=False)]
    if model_id == "seasonalNaive":
        return _seasonal_predict(values, len(target_dates), cadence, with_trend=False, fitted=fitted)
    if model_id == "movingAverage":
        return _moving_average_predict(values, len(target_dates), fitted=fitted)
    return _regression_predict(history, target_dates, cadence, rich=False)


def _moving_average_predict(values: list[float], horizon: int, fitted: bool = False) -> list[float]:
    window = min(6, max(2, len(values) // 3))
    if fitted:
        return [mean(values[max(0, index - window) : index] or values[:1]) for index in range(len(values))]
    return [mean(values[-window:]) for _ in range(horizon)]


def _ets_predict(values: list[float], horizon: int, fitted: bool = False) -> list[float]:
    if len(values) == 1:
        return [values[0] for _ in range(horizon)]
    alpha = 0.55
    beta = 0.18
    level = values[0]
    trend = values[1] - values[0]
    fitted_values: list[float] = []
    for value in values:
        fitted_values.append(level + trend)
        previous_level = level
        level = alpha * value + (1 - alpha) * (level + trend)
        trend = beta * (level - previous_level) + (1 - beta) * trend
    if fitted:
        return fitted_values
    return [level + trend * step for step in range(1, horizon + 1)]


def _seasonal_predict(
    values: list[float],
    horizon: int,
    cadence: str,
    with_trend: bool,
    fitted: bool = False,
) -> list[float]:
    season = _season_length(cadence, len(values))
    if fitted:
        baseline = mean(values[: min(len(values), season)])
        result = []
        for index in range(len(values)):
            if index >= season:
                yhat = values[index - season]
            else:
                yhat = baseline
            result.append(yhat)
        return result

    trend = 0.0
    if with_trend and len(values) > season:
        trend = (mean(values[-season:]) - mean(values[-2 * season : -season])) / season
    result = []
    for step in range(1, horizon + 1):
        source_index = len(values) - season + ((step - 1) % season)
        base = values[source_index] if source_index >= 0 else mean(values)
        result.append(base + trend * step)
    return result


def _season_length(cadence: str, history_size: int) -> int:
    if cadence == "month":
        return min(12, max(2, history_size // 2))
    if cadence == "week":
        return min(52, max(2, history_size // 2))
    return min(7, max(2, history_size // 2))


def _regression_predict(
    history: list[SeriesPoint],
    target_dates: list[date],
    cadence: str,
    rich: bool,
) -> list[float]:
    origin = history[0].ds
    train_x = [_features(point.ds, origin, cadence, rich) for point in history]
    train_y = [point.y for point in history]
    coefficients = _ridge_regression(train_x, train_y, regularization=0.05 if rich else 0.2)
    return [_dot(_features(ds, origin, cadence, rich), coefficients) for ds in target_dates]


def _features(value: date, origin: date, cadence: str, rich: bool) -> list[float]:
    days = max(0, (value - origin).days)
    if cadence == "month":
        t = days / 30.4375
        seasonal_position = value.month / 12
    elif cadence == "week":
        t = days / 7
        seasonal_position = value.isocalendar().week / 52
    else:
        t = days
        seasonal_position = value.timetuple().tm_yday / 365.25
    features = [
        1.0,
        t,
        math.sin(2 * math.pi * seasonal_position),
        math.cos(2 * math.pi * seasonal_position),
    ]
    if rich:
        features.extend(
            [
                t * t / 1000,
                1.0 if value.month in {6, 11, 12} else 0.0,
                1.0 if value.month in {1, 2} else 0.0,
                math.sin(4 * math.pi * seasonal_position),
                math.cos(4 * math.pi * seasonal_position),
            ]
        )
    return features


def _ridge_regression(x_rows: list[list[float]], y_values: list[float], regularization: float) -> list[float]:
    size = len(x_rows[0])
    matrix = [[0.0 for _ in range(size)] for _ in range(size)]
    vector = [0.0 for _ in range(size)]
    for row, y_value in zip(x_rows, y_values, strict=False):
        for i in range(size):
            vector[i] += row[i] * y_value
            for j in range(size):
                matrix[i][j] += row[i] * row[j]
    for index in range(size):
        matrix[index][index] += regularization
    return _solve_linear_system(matrix, vector)


def _solve_linear_system(matrix: list[list[float]], vector: list[float]) -> list[float]:
    size = len(vector)
    augmented = [row[:] + [vector[index]] for index, row in enumerate(matrix)]
    for column in range(size):
        pivot = max(range(column, size), key=lambda row: abs(augmented[row][column]))
        if abs(augmented[pivot][column]) < 1e-9:
            continue
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        divisor = augmented[column][column]
        augmented[column] = [value / divisor for value in augmented[column]]
        for row in range(size):
            if row == column:
                continue
            factor = augmented[row][column]
            augmented[row] = [
                value - factor * augmented[column][index]
                for index, value in enumerate(augmented[row])
            ]
    return [augmented[index][-1] for index in range(size)]


def _dot(left: list[float], right: list[float]) -> float:
    return sum(a * b for a, b in zip(left, right, strict=False))


def _metrics(actual: list[float], predicted: list[float]) -> dict[str, float | None]:
    pairs = [(a, max(0.0, p)) for a, p in zip(actual, predicted, strict=False)]
    if not pairs:
        return _empty_metrics()
    absolute_errors = [abs(a - p) for a, p in pairs]
    squared_errors = [(a - p) ** 2 for a, p in pairs]
    percentage_errors = [abs(a - p) / a for a, p in pairs if a != 0]
    total_actual = sum(abs(a) for a, _ in pairs)
    return {
        "mae": round(mean(absolute_errors), 4),
        "rmse": round(math.sqrt(mean(squared_errors)), 4),
        "mape": round(mean(percentage_errors) * 100, 4) if percentage_errors else None,
        "wape": round(sum(absolute_errors) / total_actual * 100, 4) if total_actual else None,
    }


def _empty_metrics() -> dict[str, float | None]:
    return {"mae": None, "rmse": None, "mape": None, "wape": None}


def _interval_spread(errors: list[float], actual: list[float]) -> float:
    cleaned = [abs(value) for value in errors if math.isfinite(value)]
    if cleaned:
        return max(mean(actual) * 0.03, math.sqrt(mean([value * value for value in cleaned])) * 1.28)
    return max(mean(actual) * 0.08, 1.0)


def _rank_results(results: list[ModelResult]) -> list[ModelResult]:
    def key(result: ModelResult) -> tuple[float, str]:
        wape = result.metrics.get("wape")
        return (wape if wape is not None else float("inf"), result.model_id)

    return sorted(results, key=key)


def _write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
