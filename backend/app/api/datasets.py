# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.db.session import get_db
from app.schemas.datasets import DatasetDetail, DatasetDiagnosis, JsonDatasetCreate
from app.services.datasets import (
    diagnose_dataset,
    guess_columns,
    read_csv_preview,
    write_json_rows_as_csv,
)
from app.services.repository import PostgresRepository
from app.storage.minio_store import ObjectStorage

router = APIRouter(prefix="/api/datasets", tags=["datasets"])


@router.post("/upload", response_model=DatasetDetail)
async def upload_dataset(
    file: UploadFile = File(...),
    settings: Settings = Depends(get_settings),
    db: Session = Depends(get_db),
) -> dict:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    safe_name = Path(file.filename).name
    storage_path = settings.upload_dir / f"{uuid4()}_{safe_name}"
    size = 0
    with storage_path.open("wb") as handle:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > settings.max_upload_mb * 1024 * 1024:
                raise HTTPException(status_code=413, detail="CSV file is too large")
            handle.write(chunk)

    columns, preview_rows, row_count = read_csv_preview(storage_path)
    column_guess = guess_columns(columns)
    object_storage = ObjectStorage(settings)
    storage_object = object_storage.put_file(
        f"uploads/{storage_path.name}",
        storage_path,
        "text/csv",
    )
    repo = PostgresRepository(db)
    dataset = repo.create_dataset(
        {
            "filename": safe_name,
            "storage_path": str(storage_path),
            "storage_object": storage_object,
            "row_count": row_count,
            "columns": columns,
            "column_guess": column_guess,
            "preview_rows": preview_rows,
        }
    )
    return dataset


@router.post(
    "/json",
    response_model=DatasetDetail,
    summary="Create a dataset from platform JSON rows",
    description=(
        "Accepts platform JSON rows, validates required period_start and quantity fields, "
        "stores them as an internal CSV dataset, and returns the same DatasetDetail schema "
        "used by CSV uploads."
    ),
)
def create_json_dataset(
    payload: JsonDatasetCreate,
    settings: Settings = Depends(get_settings),
    db: Session = Depends(get_db),
) -> dict:
    required_columns = ("period_start", "quantity")
    for index, row in enumerate(payload.rows):
        missing = [column for column in required_columns if column not in row]
        if missing:
            raise HTTPException(
                status_code=422,
                detail=f"rows[{index}] is missing required field(s): {', '.join(missing)}",
            )

    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    safe_name = Path(payload.filename or "platform_dataset.json").name
    csv_name = f"{Path(safe_name).stem or 'platform_dataset'}.csv"
    storage_path = settings.upload_dir / f"{uuid4()}_{csv_name}"
    write_json_rows_as_csv(payload.rows, storage_path)

    columns, preview_rows, row_count = read_csv_preview(storage_path)
    column_guess = guess_columns(columns)
    object_storage = ObjectStorage(settings)
    storage_object = object_storage.put_file(
        f"uploads/{storage_path.name}",
        storage_path,
        "text/csv",
    )
    repo = PostgresRepository(db)
    return repo.create_dataset(
        {
            "filename": safe_name,
            "storage_path": str(storage_path),
            "storage_object": storage_object,
            "row_count": row_count,
            "columns": columns,
            "column_guess": column_guess,
            "preview_rows": preview_rows,
        }
    )


@router.get("/{dataset_id}", response_model=DatasetDetail)
def get_dataset(dataset_id: str, db: Session = Depends(get_db)) -> dict:
    repo = PostgresRepository(db)
    dataset = repo.get_dataset(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


@router.get("/{dataset_id}/columns")
def get_dataset_columns(dataset_id: str, db: Session = Depends(get_db)) -> dict:
    repo = PostgresRepository(db)
    dataset = repo.get_dataset(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {
        "dataset_id": dataset_id,
        "columns": dataset["columns"],
        "column_guess": dataset["column_guess"],
    }


@router.post("/{dataset_id}/diagnose", response_model=DatasetDiagnosis)
def diagnose(dataset_id: str, db: Session = Depends(get_db)) -> dict:
    repo = PostgresRepository(db)
    dataset = repo.get_dataset(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    diagnosis = diagnose_dataset(dataset["columns"], dataset["preview_rows"])
    return {"dataset_id": dataset_id, **diagnosis}
