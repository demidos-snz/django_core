from datetime import timedelta
from typing import Set, List, Optional

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.db.models import Q
from django.db.models import QuerySet
from django.utils import timezone

from config.celery_app import app
from django_core.users.handlers.update_user import UpdateUserNoPermissionsHandler

User = get_user_model()

USER_ID_KEY = "_auth_user_id"


@app.task(name="users.update_is_active")
def update_users_is_active_field():
    inactivity_period: timedelta = timedelta(seconds=settings.USER_INACTIVITY_PERIOD)
    session_cookie_age: timedelta = timedelta(seconds=settings.SESSION_COOKIE_AGE)

    if inactivity_period < session_cookie_age:
        raise ValueError("USER_INACTIVITY_PERIOD should be greater or equal to SESSION_COOKIE_AGE")

    minimal_active_expire_date: timedelta = timezone.now() - inactivity_period + session_cookie_age

    inactive_sessions: QuerySet[Session] = Session.objects.filter(expire_date__lte=minimal_active_expire_date)
    inactive_session_user_ids: Set[int] = _get_user_ids(sessions=inactive_sessions)

    non_expired_sessions: QuerySet[Session] = Session.objects.filter(expire_date__gte=timezone.now())
    non_expired_session_user_ids: Set[int] = _get_user_ids(sessions=non_expired_sessions)

    inactive_users_filter = Q(pk__in=inactive_session_user_ids) & ~Q(pk__in=non_expired_session_user_ids)
    users_to_update_is_active: QuerySet[User] = User.objects.filter(inactive_users_filter)

    for user in users_to_update_is_active:
        UpdateUserNoPermissionsHandler(user_id=user.id, is_active=False).update()


def _get_user_ids(sessions: QuerySet[Session]) -> Set[int]:
    sessions: List[Optional[str]] = [session.get_decoded().get(USER_ID_KEY) for session in sessions]
    return set(int(session) for session in sessions if session is not None)
