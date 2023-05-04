from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import status

from django_core.api_v1.handlers_views import HandlerView
from django_core.api_v1.users.serializers import (
    UserModelSerializer,
    WriteAddUserSerializer,
    WriteGetUserSerializer,
    WriteUpdateUserSerializer,
)
from django_core.users.handlers.create_user import CreateUserHandler
# from django_core.users.handlers.get_related_users import GetRelatedUsersHandler
from django_core.users.handlers.get_user import GetUserHandler
from django_core.users.handlers.remove_user import RemoveUserHandler
from django_core.users.handlers.update_user import UpdateUserHandler


class UsersView(HandlerView):
    @extend_schema(
        request=WriteAddUserSerializer,
        responses={
            201: UserModelSerializer,
        },
    )
    def post(self, request, *args, **kwargs):
        self.response_code = status.HTTP_201_CREATED
        self.handler = CreateUserHandler
        self.serializer_class = WriteAddUserSerializer
        self.read_serializer_class = UserModelSerializer
        self.error_text = _('Create user error')
        return self.handle()

    # @extend_schema(
    #     responses={
    #         200: UserModelSerializer,
    #     },
    # )
    # def get(self, request, *args, **kwargs):
    #     self.response_code = status.HTTP_200_OK
    #     self.handler = GetRelatedUsersHandler
    #     self.read_serializer_class = UserModelSerializer
    #     self.error_text = _('Get users error')
    #     return self.handle()


class UserView(HandlerView):
    @extend_schema(
        responses={
            200: UserModelSerializer,
        },
    )
    def get(self, request, *args, **kwargs):
        self.response_code = status.HTTP_200_OK
        self.handler = GetUserHandler
        self.serializer_class = WriteGetUserSerializer
        self.read_serializer_class = UserModelSerializer
        self.error_text = _('Get user error')
        return self.handle()

    @extend_schema(
        request=WriteUpdateUserSerializer,
        responses={
            200: UserModelSerializer,
        },
    )
    def patch(self, request, *args, **kwargs):
        self.response_code = status.HTTP_200_OK
        self.handler = UpdateUserHandler
        self.serializer_class = WriteUpdateUserSerializer
        self.read_serializer_class = UserModelSerializer
        self.error_text = _('User update error')
        return self.handle()

    @extend_schema(
        responses={
            204: None,
        },
    )
    def delete(self, request, *args, **kwargs):
        self.response_code = status.HTTP_204_NO_CONTENT
        self.handler = RemoveUserHandler
        self.serializer_class = WriteGetUserSerializer
        self.error_text = _('User remove error')
        return self.handle()
