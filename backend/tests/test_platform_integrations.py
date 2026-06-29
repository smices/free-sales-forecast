# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

from pathlib import Path


def test_json_rows_create_dataset_with_csv_equivalent_metadata(client) -> None:
    response = client.post(
        "/api/datasets/json",
        json={
            "filename": "platform_sales_actuals.json",
            "rows": [
                {
                    "period_start": "2026-06-01",
                    "quantity": 10.5,
                    "series_key": "SKU-001|AMZ|US",
                    "sku_code": "SKU-001",
                    "platform_code": "AMZ",
                    "site_code": "US",
                    "campaign": "summer",
                },
                {
                    "period_start": "2026-06-02",
                    "quantity": 12,
                    "series_key": "SKU-001|AMZ|US",
                    "sku_code": "SKU-001",
                    "platform_code": "AMZ",
                    "site_code": "US",
                    "campaign": "summer",
                },
            ],
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "platform_sales_actuals.json"
    assert body["row_count"] == 2
    assert body["columns"] == [
        "period_start",
        "quantity",
        "series_key",
        "sku_code",
        "platform_code",
        "site_code",
        "campaign",
    ]
    assert body["column_guess"]["date_column"] == "period_start"
    assert body["column_guess"]["metric_columns"] == ["quantity"]
    assert set(body["column_guess"]["dimension_columns"]) >= {"sku_code", "platform_code"}
    assert body["preview_rows"][0]["quantity"] == "10.5"
    assert Path(body["storage_path"]).suffix == ".csv"
    assert Path(body["storage_path"]).exists()


def test_json_dataset_can_be_used_to_create_forecast_job(client) -> None:
    dataset_response = client.post(
        "/api/datasets/json",
        json={
            "rows": [
                {"period_start": "2026-06-01", "quantity": 10},
                {"period_start": "2026-06-02", "quantity": 12},
                {"period_start": "2026-06-03", "quantity": 13},
            ],
        },
    )
    dataset_id = dataset_response.json()["id"]

    job_response = client.post(
        "/api/forecast-jobs",
        json={
            "dataset_id": dataset_id,
            "date_column": "period_start",
            "value_column": "quantity",
            "models": ["ets", "movingAverage"],
            "params": {"ets": {"alpha": 0.3}, "movingAverage": {"window": 4}},
        },
    )

    assert job_response.status_code == 200
    assert job_response.json()["dataset_id"] == dataset_id
    assert job_response.json()["status"] == "queued"


def test_json_dataset_can_run_forecast_experiment(client) -> None:
    dataset_id = client.post(
        "/api/datasets/json",
        json={
            "rows": [
                {"period_start": "2026-06-01", "quantity": 10},
                {"period_start": "2026-06-02", "quantity": 12},
                {"period_start": "2026-06-03", "quantity": 13},
                {"period_start": "2026-06-04", "quantity": 15},
                {"period_start": "2026-06-05", "quantity": 18},
            ]
        },
    ).json()["id"]
    job_id = client.post(
        "/api/forecast-jobs",
        json={
            "dataset_id": dataset_id,
            "date_column": "period_start",
            "value_column": "quantity",
            "horizon": 2,
            "models": ["ets", "movingAverage"],
        },
    ).json()["id"]

    response = client.post(f"/api/forecast-jobs/{job_id}/run-now")

    assert response.status_code == 200
    body = response.json()
    assert body["dataset_id"] == dataset_id
    assert body["recommended_model"] in {"ets", "movingAverage"}
    assert {model["model_id"] for model in body["models"]} == {"ets", "movingAverage"}


def test_json_dataset_rejects_empty_rows(client) -> None:
    response = client.post("/api/datasets/json", json={"rows": []})

    assert response.status_code in {400, 422}
    assert "rows" in response.text.lower()


def test_json_dataset_rejects_missing_required_columns(client) -> None:
    missing_period = client.post("/api/datasets/json", json={"rows": [{"quantity": 10}]})
    missing_quantity = client.post(
        "/api/datasets/json", json={"rows": [{"period_start": "2026-06-01"}]}
    )

    assert missing_period.status_code in {400, 422}
    assert "period_start" in missing_period.text
    assert missing_quantity.status_code in {400, 422}
    assert "quantity" in missing_quantity.text


def test_json_dataset_rejects_non_array_rows(client) -> None:
    response = client.post("/api/datasets/json", json={"rows": {"period_start": "2026-06-01"}})

    assert response.status_code == 422
    assert "rows" in response.text.lower()


def test_csv_upload_still_creates_dataset(client, tmp_path: Path) -> None:
    response = client.post(
        "/api/datasets/upload",
        files={
            "file": (
                "sample.csv",
                b"period_start,quantity,sku_code\n2026-06-01,10,SKU-001\n",
                "text/csv",
            )
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "sample.csv"
    assert body["row_count"] == 1
    assert body["column_guess"]["date_column"] == "period_start"


def test_forecast_parameter_schema_lists_supported_models_and_fields(client) -> None:
    response = client.get("/api/forecast-parameters/schema")

    assert response.status_code == 200
    body = response.json()
    assert body["default_models"] == ["prophet", "ets", "sarima", "featureMl", "movingAverage"]
    model_ids = {model["id"] for model in body["models"]}
    assert model_ids >= {"prophet", "ets", "sarima", "featureMl", "movingAverage"}
    for model in body["models"]:
        assert model["id"]
        assert model["name"]
        assert isinstance(model["fields"], list)
        for field in model["fields"]:
            assert {"key", "label", "type", "default", "required", "help"} <= field.keys()
            if field["type"] == "select":
                assert field["options"]


def test_schema_default_params_are_accepted_by_forecast_job_create(client) -> None:
    schema = client.get("/api/forecast-parameters/schema").json()
    params = {
        model["id"]: {field["key"]: field["default"] for field in model["fields"]}
        for model in schema["models"]
    }
    dataset_id = client.post(
        "/api/datasets/json",
        json={
            "rows": [
                {"period_start": "2026-06-01", "quantity": 10},
                {"period_start": "2026-06-02", "quantity": 11},
                {"period_start": "2026-06-03", "quantity": 12},
            ]
        },
    ).json()["id"]

    response = client.post(
        "/api/forecast-jobs",
        json={
            "dataset_id": dataset_id,
            "date_column": "period_start",
            "value_column": "quantity",
            "params": params,
        },
    )

    assert response.status_code == 200
    assert response.json()["dataset_id"] == dataset_id


def test_forecast_parameter_template_can_be_exported(client) -> None:
    response = client.get("/api/forecast-parameters/template")

    assert response.status_code == 200
    body = response.json()
    assert body["models"] == ["prophet", "ets", "sarima", "featureMl", "movingAverage"]
    assert body["primary_model"] == "prophet"
    assert body["params"]["ets"]["alpha"] == 0.3
    assert body["params"]["movingAverage"]["window"] == 4
