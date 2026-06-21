# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class WorkerSettings(BaseSettings):
    redis_url: str = "redis://redis:6379/0"
    backend_url: str = "http://backend:8000"
    storage_root: Path = Path("/app/storage")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> WorkerSettings:
    return WorkerSettings()
