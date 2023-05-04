import uuid
from typing import Optional

import redis
from django.conf import settings


class ServiceConnectionHandler:
    __storage = redis.from_url(settings.REDIS_URL)
    __prefix: str = "connect_token"

    @classmethod
    def get_code(cls, user_id: int, ex=600, **kwargs):
        token = cls._get_token()
        cls.__storage.set("%s:%s" % (cls.__prefix, token), user_id, ex=ex, **kwargs)
        return token

    @classmethod
    def get_user_id(cls, token: str):
        key = "%s:%s" % (cls.__prefix, token)
        user_id: Optional[bytes] = cls.__storage.get(key)
        cls.__storage.delete(key)

        if user_id is None:
            return None

        if user_id.isdigit():
            return int(user_id)

        return None

    @staticmethod
    def _get_token():
        return str(uuid.uuid4())
