from typing import Any, Dict

from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model

# fixme NAME_PROJECT
from django_core.api_v1.users.serializers import UserModelSerializer

User = get_user_model()


def get_data(obj):
    return sync_to_async(lambda: obj.data)()


class UserConnectedHandler:
    def __init__(self, consumer):
        self.consumer = consumer
        self.user = consumer.user

    async def send_data(self):
        await self.send_release_version()
        await self.send_user_data()

    async def send_release_version(self):
        await self.consumer.send_data(
            event='release_version',
            release_version=settings.DEBUG and 'dev' or settings.RELEASE_VERSION,
        )

    async def send_user_data(self):
        data = await self._get_user_data()
        await self.consumer.send_data(
            event='user_data',
            **data,
        )

    @database_sync_to_async
    def _get_user_data(self):
        self.user.refresh_from_db()
        serializer = UserModelSerializer(self.user)
        data: Dict[str, Any] = serializer.data
        return data
