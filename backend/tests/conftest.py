# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

from collections.abc import Generator
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.api import datasets as datasets_api
from app.api import forecast as forecast_api
from app.core.config import Settings, get_settings
from app.db.session import get_db
from app.main import app


class MemoryRepository:
    datasets: dict[str, dict[str, Any]] = {}
    jobs: dict[str, dict[str, Any]] = {}
    experiments: dict[str, dict[str, Any]] = {}

    def __init__(self, db: object) -> None:
        self.db = db

    @classmethod
    def reset(cls) -> None:
        cls.datasets = {}
        cls.jobs = {}
        cls.experiments = {}

    def create_dataset(self, payload: dict[str, Any]) -> dict[str, Any]:
        dataset = {
            "id": payload.get("id", str(uuid4())),
            "created_at": datetime.now(UTC),
            **payload,
        }
        self.datasets[dataset["id"]] = dataset
        return dataset

    def get_dataset(self, dataset_id: str) -> dict[str, Any] | None:
        return self.datasets.get(dataset_id)

    def create_job(self, payload: dict[str, Any]) -> dict[str, Any]:
        job = {
            "id": str(uuid4()),
            "status": "queued",
            "experiment_id": None,
            "error_message": None,
            "created_at": datetime.now(UTC),
            "started_at": None,
            "finished_at": None,
            **payload,
        }
        self.jobs[job["id"]] = job
        return job

    def update_job(self, job_id: str, **updates: Any) -> dict[str, Any] | None:
        job = self.jobs.get(job_id)
        if not job:
            return None
        job.update(updates)
        return job

    def get_job(self, job_id: str) -> dict[str, Any] | None:
        return self.jobs.get(job_id)

    def create_experiment(self, payload: dict[str, Any]) -> dict[str, Any]:
        experiment = {
            "id": payload.get("id", str(uuid4())),
            "created_at": datetime.now(UTC),
            **payload,
        }
        self.experiments[experiment["id"]] = experiment
        return experiment

    def get_experiment(self, experiment_id: str) -> dict[str, Any] | None:
        return self.experiments.get(experiment_id)


@pytest.fixture
def client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Generator[TestClient, None, None]:
    MemoryRepository.reset()
    settings = Settings(
        database_url="postgresql+psycopg://unused:unused@localhost/unused",
        redis_url="redis://unused:6379/0",
        storage_root=tmp_path / "storage",
        s3_endpoint=None,
        task_always_eager=False,
    )

    def override_settings() -> Settings:
        return settings

    def override_db() -> Generator[object, None, None]:
        yield object()

    app.dependency_overrides[get_settings] = override_settings
    app.dependency_overrides[get_db] = override_db
    monkeypatch.setattr(datasets_api, "PostgresRepository", MemoryRepository)
    monkeypatch.setattr(forecast_api, "PostgresRepository", MemoryRepository)
    monkeypatch.setattr(forecast_api, "enqueue_forecast_job", lambda job_id, redis_url: None)

    yield TestClient(app)

    app.dependency_overrides.clear()
