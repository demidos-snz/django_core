from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _

from django_core.utils.process_recognizer import ProcessRecognizer


class PermissionsConfig(AppConfig):
    name = 'django_core.permissions'
    verbose_name = _('Permissions')

    def ready(self):
        try:
            import incident_management.permissions.signals.handlers  # noqa F401
        except ImportError:
            pass

        self.init_role_model()

    @staticmethod
    def init_role_model():
        from django_core.permissions.utils.rule_names import IncidentRuleManager

        ProcessRecognizer.init()
        if ProcessRecognizer.is_server():
            IncidentRuleManager.init()
