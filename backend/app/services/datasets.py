# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

import csv
from pathlib import Path
from typing import Any


DATE_HINTS = ("date", "period_start", "period", "ds", "day", "日期", "时间")
METRIC_HINTS = (
    "sales",
    "revenue",
    "amount",
    "gmv",
    "quantity",
    "qty",
    "order_count",
    "orders",
    "total",
    "销售",
    "销量",
    "销售额",
    "金额",
)
DIMENSION_HINTS = ("country", "market", "region", "channel", "sku", "category", "store", "platform")


def read_csv_preview(path: Path, limit: int = 20) -> tuple[list[str], list[dict[str, Any]], int]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        columns = reader.fieldnames or []
        preview: list[dict[str, Any]] = []
        row_count = 0
        for row in reader:
            row_count += 1
            if len(preview) < limit:
                preview.append(dict(row))
    return columns, preview, row_count


def write_json_rows_as_csv(rows: list[dict[str, Any]], path: Path) -> list[str]:
    columns: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for column in row:
            if column not in seen:
                seen.add(column)
                columns.append(column)

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({column: row.get(column, "") for column in columns})
    return columns


def guess_columns(columns: list[str]) -> dict[str, Any]:
    lowered = {column: column.lower() for column in columns}

    def first_match(hints: tuple[str, ...]) -> str | None:
        for column, lower in lowered.items():
            if any(hint.lower() in lower for hint in hints):
                return column
        return None

    metric_columns = [
        column for column, lower in lowered.items() if any(hint.lower() in lower for hint in METRIC_HINTS)
    ]
    dimension_columns = [
        column
        for column, lower in lowered.items()
        if any(hint.lower() in lower for hint in DIMENSION_HINTS)
    ]
    return {
        "date_column": first_match(DATE_HINTS),
        "metric_columns": metric_columns,
        "dimension_columns": dimension_columns,
    }


def diagnose_dataset(columns: list[str], preview_rows: list[dict[str, Any]]) -> dict[str, Any]:
    guess = guess_columns(columns)
    metrics = guess["metric_columns"]
    reasons: list[str] = []
    warnings: list[str] = []
    reason_keys: list[str] = []
    warning_keys: list[str] = []

    revenue = next((item for item in metrics if item.lower() in {"revenue", "sales", "amount", "gmv"}), None)
    quantity = next((item for item in metrics if item.lower() in {"quantity", "qty", "units"}), None)
    orders = next((item for item in metrics if item.lower() in {"order_count", "orders"}), None)

    if revenue:
        recommended = revenue
        metric_type = "revenue"
        reason_keys.append("diagnosis.reason.revenueDetected")
        reasons.append("Revenue or GMV-like fields were detected. Revenue forecasting is the best first target.")
    elif quantity:
        recommended = quantity
        metric_type = "quantity"
        reason_keys.append("diagnosis.reason.quantityDetected")
        reasons.append("Quantity-like fields were detected. Unit sales forecasting is the best first target.")
    elif orders:
        recommended = orders
        metric_type = "order_count"
        reason_keys.append("diagnosis.reason.ordersDetected")
        reasons.append("Order-count fields were detected. Order volume forecasting is a suitable target.")
    else:
        recommended = metrics[0] if metrics else None
        metric_type = "unknown"
        warning_keys.append("diagnosis.warning.metricUnknown")
        warnings.append("No clear quantity, revenue, or order-count field was detected. Choose the forecast metric manually.")

    if not guess["date_column"]:
        warning_keys.append("diagnosis.warning.dateMissing")
        warnings.append("No date column was detected. Specify a date or ds field manually.")
    if not preview_rows:
        warning_keys.append("diagnosis.warning.noPreviewRows")
        warnings.append("The CSV has no previewable data rows.")

    return {
        "recommended_metric": recommended,
        "metric_type": metric_type,
        "reasons": reasons,
        "warnings": warnings,
        "reason_keys": reason_keys,
        "warning_keys": warning_keys,
    }
