# SPDX-FileCopyrightText: 2026 Free Sales Forecast contributors
# SPDX-License-Identifier: MIT
from functools import lru_cache

from dramatiq import Message
from dramatiq.brokers.redis import RedisBroker


@lru_cache
def get_broker(redis_url: str) -> RedisBroker:
    return RedisBroker(url=redis_url)


def enqueue_forecast_job(job_id: str, redis_url: str) -> None:
    message = Message(
        queue_name="default",
        actor_name="forecast.run",
        args=(job_id,),
        kwargs={},
        options={},
    )
    get_broker(redis_url).enqueue(message)
