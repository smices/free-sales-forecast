#!/bin/sh
# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
set -eu

cat > /srv/config.js <<EOF
window.FREE_SALES_FORECAST_CONFIG = {
  apiBaseUrl: "${FRONTEND_API_BASE_URL:-}",
  defaultLocale: "${FRONTEND_DEFAULT_LOCALE:-auto}",
  supportedLocales: ["en-US", "zh-CN"],
  avatarSeed: "${FRONTEND_AVATAR_SEED:-open-forecast}",
  appDisplayName: "${FRONTEND_APP_DISPLAY_NAME:-Free Sales Forecast}",
  jobPollTimeoutMs: ${FRONTEND_JOB_POLL_TIMEOUT_MS:-120000},
  jobPollIntervalMs: ${FRONTEND_JOB_POLL_INTERVAL_MS:-1000}
};
EOF

exec "$@"
