from typing import Any, Dict, Optional

from attrdict import AttrDict
from django.contrib.auth import get_user_model
from oslash.either import Either, Left

# from django_core.permissions.decorators import check_permissions
from django_core.users.handlers.base import BaseUserHandler
from django_core.users.handlers.data_handlers.update import UpdateUserDataHandler
from django_core.users.services.update_user import UpdateUserService
from django_core.users.signals.custom_signals import user_updated
from django_core.utils.signal_mixin import SignalMixin

User = get_user_model()


class UpdateUserHandler(BaseUserHandler, SignalMixin):
    signal = user_updated
    signal_sender = User
    data_handler = UpdateUserDataHandler

    # @check_permissions(event_code="update_user")
    def __init__(self, user: User, user_id: int, **kwargs: Dict[str, Any]):
        self.request_user: User = user
        self.user: Optional[User] = None
        self.validated_data: Optional[Dict[str, Any]] = None

        self.init(user_id=user_id, **kwargs)

    def init(self, user_id: int, **kwargs: Dict[str, Any]):
        self.user: User = self._get_user(user_id=user_id)

        self.validated_data: Dict[str, Any] = kwargs

    def run(self) -> User:
        service: UpdateUserService = UpdateUserService()
        result: Either = service(user=self.user, **self.validated_data)

        if isinstance(result, Left):
            raise self.exception(result.value)

        data: AttrDict = result.value
        user: User = data.user

        self._send_signal(user=user)

        return user


class UpdateUserNoPermissionsHandler(UpdateUserHandler):
    def __init__(self, user_id: int, **kwargs: Dict[str, Any]):
        self.init(user_id=user_id, **kwargs)
