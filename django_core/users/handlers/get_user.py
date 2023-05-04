from django.contrib.auth import get_user_model

# from django_core.permissions.decorators import check_permissions
from django_core.users.handlers.base import BaseUserHandler

User = get_user_model()


class GetUserHandler(BaseUserHandler):
    # @check_permissions(event_code="get_user")
    def __init__(self, user: User, user_id: int):
        self.request_user: User = user
        self.user: User = self._get_user(user_id=user_id)

    def run(self) -> User:
        return self.user
