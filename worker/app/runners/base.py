# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from dataclasses import dataclass
from typing import Protocol


@dataclass
class RunnerResult:
    model_id: str
    model_name: str
    forecast_path: str
    fitted_path: str | None = None
    artifact_path: str | None = None
    metrics: dict | None = None


class ForecastRunner(Protocol):
    model_id: str
    model_name: str

    def run(self, dataset_path: str, params: dict) -> RunnerResult:
        """Train a model and write forecast/fitted artifacts."""
