from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from django_core.utils.handler import BaseHandler

User = get_user_model()


class BaseUserHandler(BaseHandler):
    def _get_user(self, user_id: int) -> User:
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise self.exception(_("User not found"))

    def run(self):
        pass
