from django.utils.translation import gettext_lazy as _
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

from django_core.users.models import User, Role


class UserSerializerValidatorsMixin(serializers.Serializer):
    def update(self, instance, validated_data):
        raise NotImplementedError()

    def create(self, validated_data):
        raise NotImplementedError()

    def validate_name(self, value: str) -> str:
        return self._alphanumeric_validator(value=value)

    def validate_surname(self, value: str) -> str:
        return self._alphanumeric_validator(value=value)

    def validate_patronymic(self, value: str) -> str:
        return self._alphanumeric_validator(value=value) if value else value

    @staticmethod
    def _alphanumeric_validator(value: str) -> str:
        if not value.isalnum():
            raise serializers.ValidationError(_('Value may contain only alphabetical and numerical characters'))

        return value


class WriteAddUserSerializer(UserSerializerValidatorsMixin):
    name = serializers.CharField()
    surname = serializers.CharField()
    patronymic = serializers.CharField(required=False, allow_blank=True)
    password1 = serializers.CharField()
    password2 = serializers.CharField()
    email = serializers.EmailField()
    phone = PhoneNumberField(required=False, allow_null=True, allow_blank=True)
    role = serializers.ChoiceField(choices=Role.choices)


class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'surname', 'patronymic', 'role', 'is_active', 'is_staff', 'private_email',
            'email', 'phone', 'telegram_chat_id', 'password_status', 'password_expiration',
        )
        read_only_fields = (
            'role', 'is_active', 'is_staff', 'password_status', 'password_expiration',
        )


class WriteGetUserSerializer(serializers.Serializer):
    def update(self, instance, validated_data):
        raise NotImplementedError()

    def create(self, validated_data):
        raise NotImplementedError()

    user_id = serializers.IntegerField()


class WriteUpdateUserSerializer(UserSerializerValidatorsMixin):
    user_id = serializers.IntegerField()
    name = serializers.CharField(required=False, allow_null=True)
    surname = serializers.CharField(required=False, allow_null=True)
    patronymic = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_null=True)
    phone = PhoneNumberField(required=False, allow_null=True, allow_blank=True)
    role = serializers.ChoiceField(choices=Role.choices, required=False, allow_null=True)
    is_active = serializers.BooleanField(required=False, allow_null=True)
