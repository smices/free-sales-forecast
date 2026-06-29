# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.db.session import get_db
from app.schemas.forecast import (
    Experiment,
    ForecastJob,
    ForecastJobCreate,
    ForecastParameterSchema,
    ForecastParameterTemplate,
)
from app.services.forecast import run_baseline_experiment
from app.services.parameters import (
    get_default_forecast_parameter_template,
    get_forecast_parameter_schema,
)
from app.services.repository import PostgresRepository
from app.services.tasks import enqueue_forecast_job
from app.storage.minio_store import ObjectStorage

router = APIRouter(prefix="/api", tags=["forecast"])


@router.get(
    "/forecast-parameters/schema",
    response_model=ForecastParameterSchema,
    summary="Get forecast model parameter schema",
    description=(
        "Returns a unified schema for dynamically rendering model parameter forms. "
        "The returned defaults are compatible with ForecastJobCreate.params."
    ),
)
def get_parameter_schema() -> dict:
    return get_forecast_parameter_schema()


@router.get(
    "/forecast-parameters/template",
    response_model=ForecastParameterTemplate,
    summary="Export the default forecast parameter template",
    description=(
        "Returns a copyable default model and parameter template that downstream "
        "platforms can store and later submit to POST /api/forecast-jobs."
    ),
)
def export_parameter_template() -> dict:
    return get_default_forecast_parameter_template()


@router.post("/forecast-jobs", response_model=ForecastJob)
def create_forecast_job(
    payload: ForecastJobCreate,
    settings: Settings = Depends(get_settings),
    db: Session = Depends(get_db),
) -> dict:
    repo = PostgresRepository(db)
    dataset = repo.get_dataset(payload.dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    job = repo.create_job(payload.model_dump())
    if settings.task_always_eager:
        run_baseline_experiment(job["id"], settings.output_dir, repo, ObjectStorage(settings))
    else:
        enqueue_forecast_job(job["id"], settings.redis_url)
    return repo.get_job(job["id"]) or job


@router.get("/forecast-jobs/{job_id}", response_model=ForecastJob)
def get_forecast_job(job_id: str, db: Session = Depends(get_db)) -> dict:
    repo = PostgresRepository(db)
    job = repo.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Forecast job not found")
    return job


@router.post("/forecast-jobs/{job_id}/run-now", response_model=Experiment)
def run_forecast_job_now(
    job_id: str,
    settings: Settings = Depends(get_settings),
    db: Session = Depends(get_db),
) -> dict:
    repo = PostgresRepository(db)
    job = repo.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Forecast job not found")
    try:
        return run_baseline_experiment(job_id, settings.output_dir, repo, ObjectStorage(settings))
    except ValueError as exc:
        repo.update_job(job_id, status="failed", error_message=str(exc))
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/experiments/{experiment_id}", response_model=Experiment)
def get_experiment(experiment_id: str, db: Session = Depends(get_db)) -> dict:
    repo = PostgresRepository(db)
    experiment = repo.get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return experiment


@router.get("/experiments/{experiment_id}/models")
def get_experiment_models(experiment_id: str, db: Session = Depends(get_db)) -> dict:
    repo = PostgresRepository(db)
    experiment = repo.get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return {"experiment_id": experiment_id, "models": experiment["models"]}


@router.get("/experiments/{experiment_id}/models/{model_id}/forecast.csv")
def download_model_forecast(
    experiment_id: str, model_id: str, db: Session = Depends(get_db)
) -> FileResponse:
    repo = PostgresRepository(db)
    experiment = repo.get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    model = next((item for item in experiment["models"] if item["model_id"] == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model run not found")
    path = Path(model["forecast_path"])
    if not path.exists():
        raise HTTPException(status_code=404, detail="Forecast file not found")
    return FileResponse(path, filename=f"{model_id}_forecast.csv", media_type="text/csv")


@router.get("/experiments/{experiment_id}/models/{model_id}/fitted.csv")
def download_model_fitted(
    experiment_id: str, model_id: str, db: Session = Depends(get_db)
) -> FileResponse:
    repo = PostgresRepository(db)
    experiment = repo.get_experiment(experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    model = next((item for item in experiment["models"] if item["model_id"] == model_id), None)
    if not model:
        raise HTTPException(status_code=404, detail="Model run not found")
    path = Path(model["fitted_path"])
    if not path.exists():
        raise HTTPException(status_code=404, detail="Fitted file not found")
    return FileResponse(path, filename=f"{model_id}_fitted.csv", media_type="text/csv")
