from django.utils.translation import gettext_lazy as _

from django_core.permissions.models import RuleEntities

DEFAULT_PERMISSIONS_MESSAGE = _('User has no permissions to do this')

INCIDENT_FIELD_TO_ENTITY_MAP = {
    'name': RuleEntities.NAME,
    'description': RuleEntities.DESCRIPTION,
    'type_incident': RuleEntities.TYPE,
    'severity_level': RuleEntities.SEVERITY,
    'status': RuleEntities.STATUS,
    'cm_line': RuleEntities.CM_LINE,
    'assigned_id': RuleEntities.OPERATOR,
    'recommendation_id': RuleEntities.RECOMMENDATIONS,
    'recommendation_ids': RuleEntities.RECOMMENDATIONS,
    'action_taken_id': RuleEntities.ACTIONS_TAKEN,
    'action_taken_ids': RuleEntities.ACTIONS_TAKEN,
    'event_id': RuleEntities.EVENTS,
    'event_ids': RuleEntities.EVENTS,
}

CRUD_OPERATIONS = ('create', 'read', 'update', 'delete')
# fixme rename
CRUD_OPERATIONS_ = ('entity', 'author', 'line', 'role', 'status')
CRUD_OPERATIONS__ = RuleEntities.values, Author.values, CMLine.values, Role.values, Status.values
