import string
from typing import List

from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

MAX_LENGTH_PASSWORD = 16
HISTORY_LENGTH_PASSWORD = 7


class MaximumLengthValidator:
    def __init__(self, max_length: int = MAX_LENGTH_PASSWORD):
        self.max_length = max_length

    def validate(self, password, user=None):
        if len(password) > self.max_length:
            raise ValidationError(
                _("This password is too long. It must contain no more than %d characters." % self.max_length),
                code="password_too_long",
                params={"max_length": self.max_length},
            )

    def get_help_text(self):
        return _("Your password should contain %d or less characters." % self.max_length)


class AllowedCharactersValidator:
    ALLOWED_CHARACTERS = set(string.printable) - set(string.whitespace)

    def validate(self, password, user=None):
        if any(character not in self.ALLOWED_CHARACTERS for character in password):
            raise ValidationError(
                _("Password may contain only alphabetical, numerical characters or special symbols"),
                code="password_not_allowed_characters"
            )

    @staticmethod
    def get_help_text():
        return _("Your password should contain only alphabetic, numeric or special symbols characters")


class MixCaseValidator:
    @staticmethod
    def validate(password, user=None):
        has_upper = any(character.islower() for character in password)
        has_lower = any(character.isupper() for character in password)

        if not (has_upper and has_lower):
            raise ValidationError(
                _("This password is not mix-case"),
                code="password_not_mixcase"
            )

    @staticmethod
    def get_help_text():
        return _("Your password should contain lowercase character as well as uppercase)")


class HasNumericCharacterValidator:
    @staticmethod
    def validate(password, user=None):
        if not any(character.isnumeric() for character in password):
            raise ValidationError(
                _("This password doesn't have at least one numeric character"),
                code="password_without_numeric"
            )

    @staticmethod
    def get_help_text():
        return _("Your password should contain at least one numeric character")


class HasSpecialCharacterValidator:
    @staticmethod
    def validate(password, user=None):
        if not any(character in string.punctuation for character in password):
            raise ValidationError(
                _("This password doesn't have at least one special character"),
                code="password_without_special_character"
            )

    @staticmethod
    def get_help_text():
        return _("Your password should contain at least one special character from %s."
                 % ", ".join(string.punctuation))


class MatchesPreviousPassword:
    def validate(self, password, user=None):
        if isinstance(user, AnonymousUser) or not user:
            return

        previous_passwords_hashes: List[str] = self.get_previous_passwords_hashes(user=user)
        self.compare_password_with_history_data(
            previous_passwords_hashes=previous_passwords_hashes,
            password=password,
        )

    @staticmethod
    def get_previous_passwords_hashes(user) -> List[str]:
        password_histories = user.field_history.all().order_by("-history_date")[:HISTORY_LENGTH_PASSWORD]
        return [history.password for history in password_histories]

    @staticmethod
    def compare_password_with_history_data(previous_passwords_hashes: List[str], password):
        for password_hash in previous_passwords_hashes:
            if check_password(password, password_hash):
                raise ValidationError(
                    _("This password matches with some older user's password"),
                    code="password_matches_older_password"
                )

    @staticmethod
    def get_help_text():
        return _("Create new password that differs from older passwords")
