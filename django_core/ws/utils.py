from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

USER_GROUP_MASK = 'user_%s'
GLOBAL_GROUP_MASK = 'all'

CHANNEL_LAYER = get_channel_layer()


def get_user_ws_group_name(user_id: int) -> str:
    return USER_GROUP_MASK % user_id


def get_global_ws_group_name() -> str:
    return GLOBAL_GROUP_MASK


def send_to_socket_group(group_name: str, event: str, **data):
    async_to_sync(CHANNEL_LAYER.group_send)(
        group_name,
        {
            'type': event,
            'data': data,
        },
    )
