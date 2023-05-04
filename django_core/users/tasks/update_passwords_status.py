from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Max, Q
from django.utils import timezone

from config.celery_app import app
from django_core.users.handlers.update_user import UpdateUserNoPermissionsHandler
from django_core.users.models import PasswordStatus

User = get_user_model()


@app.task(name="users.update_passwords_status")
def update_passwords_status():
    expiration_period: timedelta = timedelta(seconds=settings.PASSWORD_EXPIRATION_PERIOD)
    notification_period: timedelta = timedelta(seconds=settings.PASSWORD_UPDATE_NOTIFICATION_PERIOD)

    last_password_updates = User.field_history.values("id").annotate(
        last_password_update=Max("history_date"),
    ).order_by("last_password_update")

    outdated_filter = Q(last_password_update__lte=timezone.now() - expiration_period)
    user_ids_with_outdated_passwords = last_password_updates.filter(outdated_filter).values_list("id", flat=True)

    obsolete_filter = Q(last_password_update__lte=timezone.now() - expiration_period + notification_period)
    user_ids_with_obsolete_passwords = last_password_updates.filter(
        obsolete_filter & ~outdated_filter,
    ).values_list("id", flat=True)

    for user_id in user_ids_with_outdated_passwords:
        UpdateUserNoPermissionsHandler(user_id=user_id, password_status=PasswordStatus.OUTDATED).update()

    for user_id in user_ids_with_obsolete_passwords:
        UpdateUserNoPermissionsHandler(user_id=user_id, password_status=PasswordStatus.OBSOLETE).update()
