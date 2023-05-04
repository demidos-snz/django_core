from typing import List

from django.contrib.auth import get_user_model
from django.dispatch import receiver

from django_core.api_v1.users.serializers import UserModelSerializer
from django_core.users.signals.custom_signals import (
    user_created,
    user_updated,
    user_removed,
)
from django_core.ws.utils import get_user_ws_group_name, send_to_socket_group

User = get_user_model()


def send_user(user: User, event: str):
    related_users = User.objects.all()
    user_data = UserModelSerializer(user).data
    for related_user in related_users:
        group_name: str = get_user_ws_group_name(user_id=related_user.id)
        send_to_socket_group(
            group_name=group_name,
            event=event,
            **user_data,
        )


@receiver(user_created, sender=User)
def share_user_created(sender, user: User, **kwargs):
    send_user(user=user, event='user_created')


@receiver(user_updated, sender=User)
def share_user_updated(sender, user: User, **kwargs):
    send_user(user=user, event='user_updated')


@receiver(user_removed, sender=User)
def share_user_removed(sender, user_id: int, user_ids: List[int], **kwargs):
    for related_user_id in user_ids:
        group_name: str = get_user_ws_group_name(user_id=related_user_id)
        send_to_socket_group(
            group_name=group_name,
            event='user_removed',
            user_id=user_id,
        )
