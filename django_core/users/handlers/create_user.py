from typing import Optional

from attrdict import AttrDict
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from oslash.either import Either, Left

# from django_core.permissions.decorators import check_permissions
from django_core.users.handlers.data_handlers.create import CreateUserDataHandler
from django_core.users.services.create_user import CreateUserService
from django_core.users.signals.custom_signals import user_created
from django_core.utils.handler import BaseHandler
from django_core.utils.signal_mixin import SignalMixin

User = get_user_model()


class CreateUserHandler(BaseHandler, SignalMixin):
    signal = user_created
    signal_sender = User
    data_handler = CreateUserDataHandler

    # @check_permissions(event_code="create_user")
    def __init__(
            self, user: User, name: str, surname: str, patronymic: Optional[str], role: int,
            password1: str, password2: str, email: str, phone: Optional[str] = None,
    ):
        self.user: User = user
        self.name: str = name
        self.surname: str = surname
        self.patronymic: str = patronymic
        self.role: int = role
        self.password: str = self._clean_password(password1=password1, password2=password2)
        self.email: str = email
        self.phone: Optional[str] = phone

    def _clean_password(self, password1: str, password2: str) -> str:
        if password1 != password2:
            raise self.exception(_("The two password fields didn't match"))

        return password1

    def run(self) -> User:
        service: CreateUserService = CreateUserService()
        result: Either = service(
            name=self.name,
            surname=self.surname,
            patronymic=self.patronymic,
            role=self.role,
            password=self.password,
            email=self.email,
            phone=self.phone,
        )

        if isinstance(result, Left):
            raise self.exception(result.value)

        data: AttrDict = result.value
        user: User = data.user

        self._send_signal(user=user)

        return user
