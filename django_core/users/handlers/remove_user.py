from typing import List, Iterable

from django.contrib.auth import get_user_model
from oslash.either import Either, Left

# from django_core.permissions.decorators import check_permissions
from django_core.users.handlers.base import BaseUserHandler
from django_core.users.services.remove_user import RemoveUserService
from django_core.users.signals.custom_signals import user_removed
from django_core.utils.signal_mixin import SignalMixin

User = get_user_model()


class RemoveUserHandler(BaseUserHandler, SignalMixin):
    signal = user_removed
    signal_sender = User

    # @check_permissions(event_code="remove_user")
    def __init__(self, user: User, user_id: int):
        self.request_user: User = user
        self.user: User = self._get_user(user_id=user_id)

    @staticmethod
    def _get_related_user_ids() -> List[int]:
        users: Iterable[User] = User.objects.all()
        return [user.id for user in users]

    def run(self):
        user_id: int = self.user.id
        user_ids: List[int] = self._get_related_user_ids()

        service: RemoveUserService = RemoveUserService()
        result: Either = service(
            user=self.user,
        )

        if isinstance(result, Left):
            raise self.exception(result.value)

        self._send_signal(user_id=user_id, user_ids=user_ids)
