<!--
SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
SPDX-License-Identifier: MIT
-->

# Free Sales Forecast

[简体中文](README.zh-CN.md)

Free Sales Forecast is a free, open-source sales forecasting workbench released
under the MIT License. It is designed for cross-market sales teams that need to
upload CSV data, compare forecasting models, explain model quality, and export
forecast results for planning.

## Models

The current release ships deployable lightweight model runners that do not need
heavy native scientific packages:

- Prophet-like: trend, changepoints, seasonality, and holiday/event features.
- ETS: exponential smoothing with level, trend, and damping.
- SARIMA-like: seasonal baseline plus autoregressive residual correction.
- LightGBM/XGBoost-like: interpretable lag, rolling, calendar, and event
  feature model.
- NeuralProphet-like: autoregression, trend, seasonality, and event features.
- N-BEATS-like: trend block plus seasonal residual block.
- Moving Average and Seasonal Naive baseline models.

The architecture is ready for package-backed Prophet, statsmodels SARIMA,
LightGBM, XGBoost, NeuralProphet, and N-BEATS runners later. The current model
dependencies are fully included in the backend image and run without external
notebooks.

## Results

- Runs an end-to-end experiment from CSV upload to persisted forecast output.
- Backtests multiple models on the same history and recommends one model by
  validation WAPE.
- Produces fitted-history data, future forecast data, and low/recommended/high
  forecast ranges.
- Keeps the recommendation source consistent across the status bar, model
  recommendation card, table highlight, and download buttons.
- Stores datasets, jobs, experiments, model metrics, and output metadata in
  PostgreSQL.
- Stores uploaded CSVs and generated model outputs in MinIO/S3-compatible
  object storage.

## Features

- React/Vite frontend with i18n language packs for English and Simplified
  Chinese.
- FastAPI backend for CSV upload, data diagnosis, job creation, experiment
  execution, and CSV export APIs.
- Platform JSON dataset API that converts JSON rows into the same internal CSV
  dataset format used by CSV uploads.
- Forecast parameter schema and template export APIs for downstream dynamic
  model-parameter forms.
- Dramatiq worker connected through Redis for asynchronous forecast jobs.
- PostgreSQL metadata store.
- MinIO/S3-compatible artifact storage.
- Caddy static frontend container with runtime `config.js` generation.
- Docker Compose stack for local deployment.
- Kubernetes manifests for frontend, backend, worker, Redis, PostgreSQL, MinIO,
  and ingress.
- User menu with theme and language switching.
- Metric, parameter, and chart tooltips.
- Per-model forecast and fitted-history CSV downloads.

## Platform Integration APIs

### Create a Dataset from JSON

Downstream platforms can create a dataset without generating a CSV client-side:

```http
POST /api/datasets/json
Content-Type: application/json
```

```json
{
  "filename": "platform_sales_actuals.json",
  "rows": [
    {
      "period_start": "2026-06-01",
      "quantity": 10.5,
      "series_key": "SKU-001|AMZ|US",
      "sku_code": "SKU-001",
      "platform_code": "AMZ",
      "site_code": "US"
    }
  ]
}
```

`rows` must be a non-empty array. Each row must include `period_start` and
`quantity`; other dimensions are preserved. The backend writes the rows into
`storage/uploads` as CSV, then returns the existing `DatasetDetail` shape with
`row_count`, `columns`, `preview_rows`, and `column_guess`. The returned
`dataset_id` can be used unchanged with `POST /api/forecast-jobs`.

### Render Forecast Parameter Forms

```http
GET /api/forecast-parameters/schema
```

Returns `default_models` and per-model field schemas for `prophet`, `ets`,
`sarima`, `featureMl`, and `movingAverage`. Field defaults are compatible with
`ForecastJobCreate.params`, for example:

```json
{
  "ets": { "alpha": 0.3 },
  "movingAverage": { "window": 4 }
}
```

### Export a Default Parameter Template

```http
GET /api/forecast-parameters/template
```

Returns a copyable default template containing `primary_model`, `models`, and
`params`. Downstream platforms can store this payload as a reusable experiment
configuration template.

## Run Locally

```bash
cp .env.example .env
docker compose up -d --build
```

Open:

- App: <http://localhost:8080>
- Backend API docs: <http://localhost:8000/docs>
- MinIO console: <http://localhost:9001>

Default local MinIO credentials are configured in `.env.example`.

## Kubernetes

```bash
kubectl apply -k deploy/k8s
```

The manifests deploy all required services into the `free-sales-forecast`
namespace. Update `deploy/k8s/secret.example.yaml`, image names, storage classes,
and ingress host before production use.

## License

Free Sales Forecast is free software licensed under the MIT License. See
[LICENSE](LICENSE).
