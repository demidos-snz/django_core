from functools import wraps
from typing import Optional, Union, Tuple, List

from django.contrib.auth import get_user_model

from config.constants.permissions import DEFAULT_PERMISSIONS_MESSAGE, CRUD_OPERATIONS, INCIDENT_FIELD_TO_ENTITY_MAP
from django_core.permissions.permissions import EventPermissions
from django_core.permissions.utils.rule_names import IncidentRuleManager

User = get_user_model()


class PermissionsDenied(Exception):
    pass


def check_permissions(event_code: str):
    def wrapper(func):

        @wraps(func)
        def check_permission(handler, *args, **kwargs):
            if args:
                raise ValueError('Pass only keyword args for permissions check')

            user = kwargs.get('user')

            if user is None:
                raise ValueError('Pass user to check permissions')

            func(handler, **kwargs)
            granted: Union[bool, Tuple[bool, str]] = EventPermissions(
                user=user, event_code=event_code, data=kwargs,
            )()
            msg = DEFAULT_PERMISSIONS_MESSAGE

            if isinstance(granted, tuple):
                granted, msg = granted

            if granted is False:
                raise PermissionsDenied(msg)

        return check_permission

    return wrapper


def check_role_permission(rule: str, entities: Optional[List] = None):
    if rule not in CRUD_OPERATIONS:
        raise ValueError(f'Invalid permission rule: {rule}')

    def wrapper(func):

        @wraps(func)
        def check_permission(handler, *args, **kwargs):
            if args:
                raise ValueError('Pass only keyword args for permissions check')

            user = kwargs.get('user')

            if user is None:
                raise ValueError('Pass user to check permissions')

            func(handler, **kwargs)

            incident = getattr(handler, 'incident', None)
            if incident is None:
                raise ValueError('Handler must has attr "incident" to check role permissions')

            for entity in entities or get_entities(kwargs):
                rights = IncidentRuleManager.get_rights(incident=incident, user=user, entity=entity)

                if rights[rule] is False:
                    raise PermissionsDenied(DEFAULT_PERMISSIONS_MESSAGE)

        return check_permission

    return wrapper


def get_entities(kwargs):
    for key in kwargs.keys():
        if key in INCIDENT_FIELD_TO_ENTITY_MAP:
            yield INCIDENT_FIELD_TO_ENTITY_MAP[key]
