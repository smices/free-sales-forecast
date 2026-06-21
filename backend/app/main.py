# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api import datasets, forecast
from app.core.config import get_settings
from app.db.session import SessionLocal, init_db

settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(datasets.router)
app.include_router(forecast.router)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    with SessionLocal() as db:
        db.execute(text("select 1"))
    return {"status": "ok", "env": settings.app_env, "database": "ok"}


@app.on_event("startup")
def on_startup() -> None:
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    settings.output_dir.mkdir(parents=True, exist_ok=True)
    settings.model_dir.mkdir(parents=True, exist_ok=True)
    init_db()
