# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


JobStatus = Literal["queued", "running", "succeeded", "failed"]


class ForecastJobCreate(BaseModel):
    dataset_id: str
    date_column: str | None = None
    value_column: str | None = None
    group_column: str | None = None
    group_value: str | None = None
    horizon: int = Field(default=30, ge=1, le=730)
    cadence: str = "auto"
    primary_model: str = "prophet"
    models: list[str] = Field(
        default_factory=lambda: ["prophet", "ets", "sarima", "featureMl", "movingAverage"]
    )
    params: dict[str, Any] = Field(default_factory=dict)


ParameterFieldType = Literal["number", "integer", "boolean", "select", "text"]


class ForecastParameterOption(BaseModel):
    label: str
    value: str | int | float | bool


class ForecastParameterField(BaseModel):
    key: str
    label: str
    type: ParameterFieldType
    default: Any
    required: bool = False
    help: str
    min: float | int | None = None
    max: float | int | None = None
    step: float | int | None = None
    options: list[ForecastParameterOption] | None = None


class ForecastModelParameterSchema(BaseModel):
    id: str
    name: str
    description: str | None = None
    fields: list[ForecastParameterField] = Field(default_factory=list)


class ForecastParameterSchema(BaseModel):
    default_models: list[str]
    models: list[ForecastModelParameterSchema]


class ForecastParameterTemplate(BaseModel):
    name: str
    primary_model: str
    models: list[str]
    params: dict[str, Any] = Field(default_factory=dict)


class ForecastJob(BaseModel):
    id: str
    dataset_id: str
    status: JobStatus
    experiment_id: str | None = None
    error_message: str | None = None
    created_at: datetime
    started_at: datetime | None = None
    finished_at: datetime | None = None


class ModelMetrics(BaseModel):
    mae: float | None = None
    rmse: float | None = None
    mape: float | None = None
    wape: float | None = None


class ModelRun(BaseModel):
    id: str
    model_id: str
    model_name: str
    rank: int | None = None
    metrics: ModelMetrics = Field(default_factory=ModelMetrics)
    forecast_object: str | None = None
    forecast_download_url: str | None = None
    fitted_object: str | None = None
    fitted_download_url: str | None = None


class Experiment(BaseModel):
    id: str
    job_id: str
    dataset_id: str
    recommended_model: str | None
    summary: dict[str, Any] = Field(default_factory=dict)
    models: list[ModelRun] = Field(default_factory=list)
