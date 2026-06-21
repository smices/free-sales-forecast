# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class DatasetRecord(Base):
    __tablename__ = "datasets"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    filename: Mapped[str] = mapped_column(String(512), nullable=False)
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)
    storage_object: Mapped[str | None] = mapped_column(Text, nullable=True)
    row_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    columns: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    column_guess: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    preview_rows: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    jobs: Mapped[list["ForecastJobRecord"]] = relationship(back_populates="dataset")
    experiments: Mapped[list["ExperimentRecord"]] = relationship(back_populates="dataset")


class ForecastJobRecord(Base):
    __tablename__ = "forecast_jobs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    dataset_id: Mapped[str] = mapped_column(ForeignKey("datasets.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="queued")
    experiment_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    date_column: Mapped[str | None] = mapped_column(String(256), nullable=True)
    value_column: Mapped[str | None] = mapped_column(String(256), nullable=True)
    group_column: Mapped[str | None] = mapped_column(String(256), nullable=True)
    group_value: Mapped[str | None] = mapped_column(String(256), nullable=True)
    horizon: Mapped[int] = mapped_column(Integer, nullable=False, default=30)
    cadence: Mapped[str] = mapped_column(String(32), nullable=False, default="auto")
    primary_model: Mapped[str] = mapped_column(String(64), nullable=False, default="prophet")
    models: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    params: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    dataset: Mapped[DatasetRecord] = relationship(back_populates="jobs")


class ExperimentRecord(Base):
    __tablename__ = "experiments"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    job_id: Mapped[str] = mapped_column(ForeignKey("forecast_jobs.id"), nullable=False, index=True)
    dataset_id: Mapped[str] = mapped_column(ForeignKey("datasets.id"), nullable=False, index=True)
    recommended_model: Mapped[str | None] = mapped_column(String(128), nullable=True)
    summary: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    models: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    dataset: Mapped[DatasetRecord] = relationship(back_populates="experiments")
