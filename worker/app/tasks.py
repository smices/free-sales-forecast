# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

import urllib.error
import urllib.request

import dramatiq

from worker_app.dramatiq_app import broker  # noqa: F401
from worker_app.settings import get_settings


@dramatiq.actor(actor_name="forecast.run", max_retries=3, time_limit=60 * 60 * 1000)
def run_forecast_job(job_id: str) -> None:
    """Run a forecast job through the backend-owned execution endpoint.

    The first production iteration keeps repository ownership in the backend.
    Later iterations can move model execution fully into the worker with shared
    database/storage services.
    """

    settings = get_settings()
    url = f"{settings.backend_url}/api/forecast-jobs/{job_id}/run-now"
    request = urllib.request.Request(url, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=60 * 30) as response:
            response.read()
    except urllib.error.HTTPError as exc:
        if 400 <= exc.code < 500:
            return
        raise
