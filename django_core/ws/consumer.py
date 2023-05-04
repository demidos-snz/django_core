import logging
from typing import Optional, Any, Dict

from attrdict import AttrDict
from channels.consumer import get_handler_name
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import get_user_model

# fixme NAME_PROJECT
from django_core.ws.handlers.connected import UserConnectedHandler
from django_core.ws.utils import (
    get_user_ws_group_name,
    get_global_ws_group_name,
)

User = get_user_model()
logger = logging.getLogger(__name__)
# fixme status


class Consumer(AsyncJsonWebsocketConsumer):
    __user: Optional[User] = None
    # fixme del
    # __incident: Optional[Incident] = None

    async def receive_json(self, content, **kwargs):
        """
        Диспетчер, обрабатывающий входящий json.
        В нем есть event, по которому определяется
        какой метод надо запустить для обработки этого event-а.
        :param content: Словарь {event, payload}
        :param kwargs: Остальные параметры
        :return: None
        """

        content = AttrDict(content)

        if not hasattr(self, content.event):
            logger.warning(f'NO HANDLER FOR {content.event} event!!!')
            return

        await self.__process_message(event=content.event, data=content.data)

    async def __process_message(self, event, data):
        try:
            handler = getattr(self, event)
            res = await handler(**data)

        except Exception as e:
            logger.exception(e)
            # fixme status
            await self.send_notify(message='Ошибка обработки запроса', status='error')

        else:
            if res:
                # fixme status
                await self.send_notify(message=res, status='warning')

    async def send_notify(self, message: str, status: str, title: Optional[str] = None, extra: Optional[Dict] = None):
        if extra is None:
            extra = {}

        await self.send_data(event='notify', message=message, type=status, title=title, extra=extra)

    async def send_data(self, event: str, **kwargs: Any):
        await self.send_json({
            'event': event,
            'data': kwargs,
        })

    async def dispatch(self, message):
        """
        Dispatches incoming messages to type-based handler.
        """

        handler_name: str = get_handler_name(message=message)
        handler = getattr(self, handler_name, None)

        if handler:
            if handler_name.startswith('websocket'):
                await handler(message)
            else:
                await handler(**message.get('data', {}))

        else:
            raise ValueError(f'No handler for message type {message["type"]}')

    @property
    def user(self) -> Optional[User]:
        return self.__user

    @user.setter
    def user(self, _):
        return

    def set_user(self, user: User):
        self.__user = user

    # fixme del
    # @property
    # def incident(self) -> Optional[Incident]:
    #     return self.__incident
    #
    # @incident.setter
    # def incident(self, _) -> None:
    #     return
    #
    # def set_incident(self, incident: Optional[Incident]) -> None:
    #     self.__incident = incident

    async def connect(self):
        user = self.scope['user']

        if user.is_anonymous:
            return self.close()

        self.set_user(user=user)
        await self.add_user_groups()
        await self.accept()
        handler = UserConnectedHandler(consumer=self)
        await handler.send_data()
        # await handler.notify()

    async def add_user_groups(self):
        if self.__user and not self.__user.is_anonymous:
            await self.__add_group(name=get_user_ws_group_name(user_id=self.__user.id))

        await self.__add_group(name=get_global_ws_group_name())

    async def __add_group(self, name: str):
        await self.channel_layer.group_add(group=name, channel=self.channel_name)

    async def disconnect(self, code):
        await self.discard_user_groups()

    async def discard_user_groups(self):
        if self.__user and not self.__user.is_anonymous:
            await self.__discard_group(name=get_user_ws_group_name(user_id=self.__user.id))

        await self.__discard_group(name=get_global_ws_group_name())

    async def __discard_group(self, name: str):
        await self.channel_layer.group_discard(group=name, channel=self.channel_name)

    async def user_data(self):
        handler = UserConnectedHandler(consumer=self)
        await handler.send_user_data()
        await handler.send_user_settings_data()

    async def user_created(self, **data):
        await self.send_data(
            event='user_added',
            **data,
        )

    async def user_updated(self, **data):
        await self.send_data(
            event='user_updated',
            **data,
        )

    async def user_removed(self, user_id: int):
        await self.send_data(
            event='user_removed',
            user_id=user_id,
        )

    # fixme del
    # @database_sync_to_async
    # def _get_incident(self, incident_id: int):
    #     prepare_data: Dict[str, Any] = GetIncidentHandler.prepare_data(
    #         user=self.user,
    #         data={"incident_id": incident_id},
    #     )
    #     handler = GetIncidentHandler(**prepare_data)
    #     return handler.run()
    #
    # async def open_incident(self, incident_id: int):
    #     try:
    #         incident = await self._get_incident(incident_id=incident_id)
    #
    #     except GetIncidentHandler.exception as exc:
    #         await self.send_notify(message=str(exc), status="error")
    #         await self.close_incident()
    #
    #     except PermissionsDenied:
    #         await self.send_notify(message=_("You have no permissions to open incident"), status="error")
    #         await self.close_incident()
    #
    #     else:
    #         self.set_incident(incident=incident)
    #         await self.__add_group(name=get_incident_ws_group_name(incident_id=incident_id))
    #
    #         await OpenIncidentHandler(self).send_data()
    #
    # async def close_incident(self):
    #     await self.send_data(event="close_incident")
    #     if not self.incident:
    #         return
    #
    #     incident_id = self.incident.id
    #
    #     self.set_incident(incident=None)
    #     await self.__discard_group(name=get_incident_ws_group_name(incident_id=incident_id))

    # fixme ?
    async def send_role_model(self, model):
        await self.send_data(
            event='role_model',
            model=model,
        )
