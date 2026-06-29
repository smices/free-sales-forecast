# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

from typing import Any


DEFAULT_MODELS = ["prophet", "ets", "sarima", "featureMl", "movingAverage"]


def get_forecast_parameter_schema() -> dict[str, Any]:
    return {
        "default_models": DEFAULT_MODELS,
        "models": [
            {
                "id": "prophet",
                "name": "Prophet-like",
                "description": "Trend, changepoint, and seasonality inspired baseline.",
                "fields": [
                    {
                        "key": "seasonality_mode",
                        "label": "Seasonality mode",
                        "type": "select",
                        "default": "auto",
                        "required": False,
                        "help": "Controls whether seasonal effects are auto-selected, additive, or multiplicative.",
                        "options": [
                            {"label": "Auto", "value": "auto"},
                            {"label": "Additive", "value": "additive"},
                            {"label": "Multiplicative", "value": "multiplicative"},
                        ],
                    },
                    {
                        "key": "changepoint_prior_scale",
                        "label": "Changepoint prior scale",
                        "type": "number",
                        "default": 0.05,
                        "min": 0.001,
                        "max": 0.5,
                        "step": 0.001,
                        "required": False,
                        "help": "Higher values allow the trend to change more quickly.",
                    },
                ],
            },
            {
                "id": "ets",
                "name": "ETS",
                "description": "Exponential smoothing model.",
                "fields": [
                    {
                        "key": "alpha",
                        "label": "Alpha",
                        "type": "number",
                        "default": 0.3,
                        "min": 0,
                        "max": 1,
                        "step": 0.05,
                        "required": False,
                        "help": "Level smoothing factor.",
                    },
                    {
                        "key": "damped_trend",
                        "label": "Damped trend",
                        "type": "boolean",
                        "default": True,
                        "required": False,
                        "help": "Reduces long-range trend growth in the forecast horizon.",
                    },
                ],
            },
            {
                "id": "sarima",
                "name": "SARIMA-like",
                "description": "Seasonal baseline with autoregressive residual correction.",
                "fields": [
                    {
                        "key": "seasonal_period",
                        "label": "Seasonal period",
                        "type": "integer",
                        "default": 7,
                        "min": 1,
                        "max": 365,
                        "step": 1,
                        "required": False,
                        "help": "Number of periods in one seasonal cycle.",
                    },
                    {
                        "key": "trend",
                        "label": "Trend",
                        "type": "select",
                        "default": "auto",
                        "required": False,
                        "help": "Trend handling mode for the seasonal model.",
                        "options": [
                            {"label": "Auto", "value": "auto"},
                            {"label": "Enabled", "value": "enabled"},
                            {"label": "Disabled", "value": "disabled"},
                        ],
                    },
                ],
            },
            {
                "id": "featureMl",
                "name": "Feature ML",
                "description": "Lag, rolling, calendar, and event feature model.",
                "fields": [
                    {
                        "key": "lags",
                        "label": "Lags",
                        "type": "text",
                        "default": "1,7,14",
                        "required": False,
                        "help": "Comma-separated lag periods used as model features.",
                    },
                    {
                        "key": "include_calendar_features",
                        "label": "Calendar features",
                        "type": "boolean",
                        "default": True,
                        "required": False,
                        "help": "Adds day, week, month, and holiday-style calendar features.",
                    },
                ],
            },
            {
                "id": "movingAverage",
                "name": "Moving Average",
                "description": "Rolling average baseline model.",
                "fields": [
                    {
                        "key": "window",
                        "label": "Window",
                        "type": "integer",
                        "default": 4,
                        "min": 1,
                        "max": 52,
                        "step": 1,
                        "required": False,
                        "help": "Number of recent periods included in the rolling average.",
                    }
                ],
            },
        ],
    }


def get_default_forecast_parameter_template() -> dict[str, Any]:
    schema = get_forecast_parameter_schema()
    return {
        "name": "Default forecast parameter template",
        "primary_model": schema["default_models"][0],
        "models": schema["default_models"],
        "params": {
            model["id"]: {field["key"]: field["default"] for field in model["fields"]}
            for model in schema["models"]
            if model["id"] in schema["default_models"]
        },
    }
