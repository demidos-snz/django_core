from datetime import datetime as dt, timedelta
from typing import List

from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.password_validation import validate_password
from django.db import models, transaction
from django.db.models import CheckConstraint, Q, IntegerChoices
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from simple_history.models import HistoricalRecords

from django_core.users.managers import CustomUserManager


def get_password_expiration_datetime() -> dt:
    return dt.now() + timedelta(seconds=settings.PASSWORD_EXPIRATION_PERIOD)


class Role(IntegerChoices):
    SYSADMIN = (0, "Сисадмин")
    SUPERUSER = (1, "Суперпользователь")
    OPERATOR_OF_FIRST_LINE = (2, "Оператор первой линии")
    OPERATOR_OF_SECOND_LINE = (3, "Оператор второй линии")
    CLIENT_OF_FIRST_LINE = (4, "Клиент первой линии")
    CLIENT = (5, "Клиент")


class PasswordStatus(IntegerChoices):
    ACTUAL = (1, "Актуальный")
    OBSOLETE = (2, "Устаревающий")
    OUTDATED = (3, "Устаревший")


ADMIN_ROLES = (Role.SYSADMIN, Role.SUPERUSER)
OPERATOR_ROLES = (Role.OPERATOR_OF_FIRST_LINE, Role.OPERATOR_OF_SECOND_LINE)
CLIENT_ROLES = (Role.CLIENT, Role.CLIENT_OF_FIRST_LINE)


class User(AbstractBaseUser, PermissionsMixin):
    NAME_MAX_LENGTH = 63
    SURNAME_MAX_LENGTH = 63
    PATRONYMIC_MAX_LENGTH = 63

    name = models.CharField(max_length=NAME_MAX_LENGTH)
    surname = models.CharField(max_length=SURNAME_MAX_LENGTH)
    patronymic = models.CharField(max_length=PATRONYMIC_MAX_LENGTH, blank=True)
    password = models.CharField(_("password"), max_length=127)
    email = models.EmailField(_("email address"), unique=True)
    private_email = models.BooleanField(_("email private"), default=False)
    phone = PhoneNumberField(unique=True, blank=True, null=True)
    telegram_chat_id = models.CharField(verbose_name=_("telegram chat id"), null=True, blank=True, max_length=31)
    role = models.IntegerField(choices=Role.choices)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(default=timezone.now)
    password_status = models.IntegerField(default=PasswordStatus.ACTUAL, choices=PasswordStatus.choices)
    password_expiration = models.DateTimeField(default=get_password_expiration_datetime)

    field_history = HistoricalRecords(excluded_fields=[
        "name", "surname", "patronymic",
        "email", "private_email", "phone",
        "telegram_chat_id", "role", "is_active",
        "is_staff", "is_superuser", "date_joined",
        "last_login", "password_status", "password_expiration",
    ])

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    @transaction.atomic
    def set_password(self, raw_password):
        validate_password(password=raw_password, user=self)
        super().set_password(raw_password=raw_password)

    def get_full_name(self) -> str:
        full_name: str = "%s %s %s" % (self.surname, self.name, self.patronymic)
        return full_name.strip()

    def __str__(self):
        return self.email

    @property
    def role_slug(self):
        return self.get_role_display().lower().replace(" ", "_")

    @classmethod
    def get_superusers(cls) -> List[int]:
        return list(cls.objects.values_list("id", flat=True).filter(role=Role.SUPERUSER))

    @classmethod
    def get_sysadmins(cls) -> List[int]:
        return list(cls.objects.values_list("id", flat=True).filter(role=Role.SYSADMIN))

    @property
    def is_private_email(self):
        return self.private_email

    @property
    def is_public_email(self):
        return not self.is_private_email

    def save(self, *args, **kwargs):
        if self._password is None:
            self.skip_history_when_saving = True

        super().save(*args, **kwargs)

    class Meta:
        constraints = [
            CheckConstraint(
                name="%(app_label)s_%(class)s_role_valid",
                check=Q(role__in=Role.values),
            )
        ]
        verbose_name_plural = _("Users")
        verbose_name = _("User")
        ordering = ["email"]
