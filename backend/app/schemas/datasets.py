# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class DatasetSummary(BaseModel):
    id: str
    filename: str
    row_count: int
    columns: list[str]
    created_at: datetime


class ColumnGuess(BaseModel):
    date_column: str | None = None
    metric_columns: list[str] = Field(default_factory=list)
    dimension_columns: list[str] = Field(default_factory=list)


class DatasetDetail(DatasetSummary):
    storage_path: str
    storage_object: str | None = None
    column_guess: ColumnGuess
    preview_rows: list[dict[str, Any]] = Field(default_factory=list)


class DatasetDiagnosis(BaseModel):
    dataset_id: str
    recommended_metric: str | None
    metric_type: str
    reasons: list[str]
    warnings: list[str]
    reason_keys: list[str] = Field(default_factory=list)
    warning_keys: list[str] = Field(default_factory=list)
