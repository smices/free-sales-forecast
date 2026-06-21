# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from collections.abc import Generator
from time import sleep

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from app.models.records import DatasetRecord, ExperimentRecord, ForecastJobRecord  # noqa: F401

    last_error: OperationalError | None = None
    for _ in range(30):
        try:
            Base.metadata.create_all(bind=engine)
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE datasets ADD COLUMN IF NOT EXISTS storage_object text"))
            return
        except OperationalError as exc:
            last_error = exc
            sleep(2)
    if last_error:
        raise last_error
