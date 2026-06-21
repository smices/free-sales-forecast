# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.records import DatasetRecord, ExperimentRecord, ForecastJobRecord


class PostgresRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create_dataset(self, payload: dict[str, Any]) -> dict[str, Any]:
        dataset_id = payload.pop("id", str(uuid4()))
        dataset = DatasetRecord(id=dataset_id, **payload)
        self.db.add(dataset)
        self.db.commit()
        self.db.refresh(dataset)
        return dataset_to_dict(dataset)

    def get_dataset(self, dataset_id: str) -> dict[str, Any] | None:
        dataset = self.db.get(DatasetRecord, dataset_id)
        return dataset_to_dict(dataset) if dataset else None

    def create_job(self, payload: dict[str, Any]) -> dict[str, Any]:
        job = ForecastJobRecord(
            id=str(uuid4()),
            status="queued",
            experiment_id=None,
            error_message=None,
            created_at=datetime.now(UTC),
            started_at=None,
            finished_at=None,
            **payload,
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job_to_dict(job)

    def update_job(self, job_id: str, **updates: Any) -> dict[str, Any] | None:
        job = self.db.get(ForecastJobRecord, job_id)
        if not job:
            return None
        for key, value in updates.items():
            setattr(job, key, value)
        self.db.commit()
        self.db.refresh(job)
        return job_to_dict(job)

    def get_job(self, job_id: str) -> dict[str, Any] | None:
        job = self.db.get(ForecastJobRecord, job_id)
        return job_to_dict(job) if job else None

    def create_experiment(self, payload: dict[str, Any]) -> dict[str, Any]:
        experiment_id = payload.pop("id", str(uuid4()))
        experiment = ExperimentRecord(id=experiment_id, **payload)
        self.db.add(experiment)
        self.db.commit()
        self.db.refresh(experiment)
        return experiment_to_dict(experiment)

    def get_experiment(self, experiment_id: str) -> dict[str, Any] | None:
        experiment = self.db.get(ExperimentRecord, experiment_id)
        return experiment_to_dict(experiment) if experiment else None


def dataset_to_dict(dataset: DatasetRecord) -> dict[str, Any]:
    return {
        "id": dataset.id,
        "filename": dataset.filename,
        "storage_path": dataset.storage_path,
        "storage_object": dataset.storage_object,
        "row_count": dataset.row_count,
        "columns": dataset.columns or [],
        "column_guess": dataset.column_guess or {},
        "preview_rows": dataset.preview_rows or [],
        "created_at": dataset.created_at,
    }


def job_to_dict(job: ForecastJobRecord) -> dict[str, Any]:
    return {
        "id": job.id,
        "dataset_id": job.dataset_id,
        "status": job.status,
        "experiment_id": job.experiment_id,
        "error_message": job.error_message,
        "date_column": job.date_column,
        "value_column": job.value_column,
        "group_column": job.group_column,
        "group_value": job.group_value,
        "horizon": job.horizon,
        "cadence": job.cadence,
        "primary_model": job.primary_model,
        "models": job.models or [],
        "params": job.params or {},
        "created_at": job.created_at,
        "started_at": job.started_at,
        "finished_at": job.finished_at,
    }


def experiment_to_dict(experiment: ExperimentRecord) -> dict[str, Any]:
    return {
        "id": experiment.id,
        "job_id": experiment.job_id,
        "dataset_id": experiment.dataset_id,
        "recommended_model": experiment.recommended_model,
        "summary": experiment.summary or {},
        "models": experiment.models or [],
        "created_at": experiment.created_at,
    }
