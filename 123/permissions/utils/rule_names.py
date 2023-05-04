from itertools import product
from operator import itemgetter
from typing import Dict, List, Optional, Any

from django.utils.functional import classproperty

from config.constants.permissions import CRUD_OPERATIONS, CRUD_OPERATIONS_, CRUD_OPERATIONS__
from django_core.permissions.models import RoleModel, RuleEntities, Author
from django_core.permissions.signals.custom_signals import rules_model_updated
from django_core.users.models import Role


class IncidentRuleManager:
    __rights: Dict[str, Dict[str, bool]] = {}

    @classmethod
    def init(cls):
        current: List = cls.get_current()
        cls.set_rights(rights=current)

    @classmethod
    def update(cls):
        cls.init()
        rules_model_updated.send(sender=RoleModel)

    @classproperty
    def rights(cls):
        return cls.__rights

    @classmethod
    def get_current(cls) -> List[Dict[str, Any]]:
        existing_models: List = []
        values = CRUD_OPERATIONS_ + CRUD_OPERATIONS
        role_models = RoleModel.objects.values(*values)
        metric_getter = itemgetter(*CRUD_OPERATIONS_)
        rights_keys = CRUD_OPERATIONS
        rights_getter = itemgetter(*rights_keys)
        for item in role_models:
            existing_models.append(
                {
                    'key': cls.__join(*metric_getter(item)),
                    **dict(zip(rights_keys, rights_getter(item))),
                }
            )

        return existing_models

    @classmethod
    def make_rules_table(cls):
        existing = {
            rule['key'] for rule in cls.get_current()
        }

        permissions = []
        for item in product(CRUD_OPERATIONS__):
            rule_str: str = cls.__join(*item)

            if rule_str in existing:
                continue

            permissions.append(
                RoleModel(
                    entity=item[0],
                    author=item[1],
                    line=item[2],
                    role=item[3],
                    status=item[4],
                )
            )

        RoleModel.objects.bulk_create(permissions)

    @staticmethod
    def __join(*args) -> str:
        return '__'.join(map(str, args))

    @classmethod
    def set_rights(cls, rights: List[Dict]):
        for right in rights:
            key: str = right.pop('key')
            cls.__rights[key] = right

    @classmethod
    def get_rule_key(cls, incident, user, entity: RuleEntities):
        rule_keys: List[int] = [entity, ]
        author_role = incident.author.role

        if author_role in (Role.CLIENT, Role.CLIENT_OF_FIRST_LINE):
            rule_keys.append(Author.CUSTOMER)
        else:
            rule_keys.append(Author.CM)

        rule_keys.append(incident.cm_line)
        rule_keys.append(user.role)
        rule_keys.append(incident.status)

        return cls.__join(*rule_keys)

    @classmethod
    def get_rights(cls, incident, user, entity: RuleEntities) -> Optional[Dict]:
        key = cls.get_rule_key(incident=incident, user=user, entity=entity)

        return cls.__rights.get(key)
