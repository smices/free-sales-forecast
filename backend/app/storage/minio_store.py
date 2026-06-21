# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

from pathlib import Path

from minio import Minio
from minio.error import S3Error

from app.core.config import Settings


class ObjectStorage:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.client: Minio | None = None
        if settings.s3_endpoint:
            endpoint = settings.s3_endpoint.removeprefix("http://").removeprefix("https://")
            self.client = Minio(
                endpoint,
                access_key=settings.s3_access_key,
                secret_key=settings.s3_secret_key,
                secure=settings.s3_secure,
            )

    def enabled(self) -> bool:
        return self.client is not None

    def ensure_bucket(self) -> None:
        if not self.client:
            return
        exists = self.client.bucket_exists(self.settings.s3_bucket)
        if not exists:
            self.client.make_bucket(self.settings.s3_bucket)

    def put_file(self, object_name: str, path: Path, content_type: str = "application/octet-stream") -> str | None:
        if not self.client:
            return None
        self.ensure_bucket()
        try:
            self.client.fput_object(
                self.settings.s3_bucket,
                object_name,
                str(path),
                content_type=content_type,
            )
        except S3Error:
            raise
        return object_name
