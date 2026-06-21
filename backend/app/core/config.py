# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Free Sales Forecast API"
    app_env: str = "local"
    cors_origins: str = "http://localhost:5173,http://localhost:8080"
    database_url: str = "postgresql+psycopg://forecast:forecast@postgres:5432/forecast"
    redis_url: str = "redis://redis:6379/0"
    storage_root: Path = Path("/app/storage")
    s3_endpoint: str | None = None
    s3_access_key: str = "minio"
    s3_secret_key: str = "minio123"
    s3_bucket: str = "free-sales-forecast"
    s3_secure: bool = False
    max_upload_mb: int = 100
    task_always_eager: bool = False
    config_source: str = "env"
    etcd_endpoint: str | None = None
    etcd_prefix: str = "/free-sales-forecast"
    etcd_timeout_seconds: int = 3

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def upload_dir(self) -> Path:
        return self.storage_root / "uploads"

    @property
    def output_dir(self) -> Path:
        return self.storage_root / "outputs"

    @property
    def model_dir(self) -> Path:
        return self.storage_root / "models"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
