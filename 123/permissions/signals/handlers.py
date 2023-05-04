import logging
from typing import List, Dict, Any

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from django_core.permissions.models import RoleModel
from django_core.permissions.signals.custom_signals import rules_model_updated
from django_core.permissions.tasks import recheck_email_privacy
from django_core.permissions.utils.rule_names import IncidentRuleManager
from django_core.ws.utils import get_global_ws_group_name, send_to_socket_group

User = get_user_model()

logger = logging.getLogger(__name__)


@receiver(rules_model_updated, sender=RoleModel)
def share_role_model(sender, **kwargs):
    role_model: List[Dict[str, Any]] = IncidentRuleManager.get_current()
    group_name: str = get_global_ws_group_name()

    send_to_socket_group(
        group_name=group_name,
        event='send_role_model',
        model=role_model,
    )


@receiver(pre_save, sender=User)
def handle_email_checking(sender, instance, **kwargs):
    prevent_check_flag = getattr(instance, '_prevent_email_check', False)

    if prevent_check_flag:
        return

    if instance.id is None:
        instance._recheck_email = True
        return

    try:
        prev_data = User.objects.only('email').get(pk=instance.id)
    except User.DoesNotExist:
        logger.warning(f'User with id {instance.id} not found for email recheck')
    else:
        if instance.email != prev_data.email:
            instance._recheck_email = True


@receiver(post_save, sender=User)
def start_email_checking(sender, instance, **kwargs):
    need_recheck_email = getattr(instance, '_recheck_email', False)

    if need_recheck_email:
        def _run_check():
            recheck_email_privacy.delay(user_id=instance.id)

        transaction.on_commit(_run_check)
