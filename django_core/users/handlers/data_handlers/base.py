from typing import Optional

from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from django_core.users.models import Role
from django_core.utils.handler import BaseDataHandler

User = get_user_model()


class BaseUserDataHandler(BaseDataHandler):
    @staticmethod
    def _clean_name(name: str) -> str:
        return name[:User.NAME_MAX_LENGTH]

    @staticmethod
    def _clean_surname(surname: str) -> str:
        return surname[:User.SURNAME_MAX_LENGTH]

    def _clean_role(self, role: int) -> int:
        if role not in Role.values:
            raise self.handler.exception(_("Invalid role"))

        return role

    def _clean_email(self, email: str) -> str:
        email = email.lower()
        if User.objects.filter(email=email).exists():
            raise self.handler.exception(_("User with this email already exists"))

        return email

    def _clean_phone(self, phone: Optional[str]) -> Optional[str]:
        if phone:
            return None

        if User.objects.filter(phone=phone).exists():
            raise self.handler.exception(_("User with this phone already exists"))

        return phone
