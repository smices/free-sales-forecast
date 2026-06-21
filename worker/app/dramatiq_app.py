# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from __future__ import annotations

import dramatiq
from dramatiq.brokers.redis import RedisBroker

from worker_app.settings import get_settings

settings = get_settings()
broker = RedisBroker(url=settings.redis_url)
dramatiq.set_broker(broker)
