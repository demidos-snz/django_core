from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


# fixme NAME_PROJECT
class MainConfig(AppConfig):
    name = 'django_core.main'
    verbose_name = _('Main app')

    def ready(self):
        try:
            import django_core.main.signals.handlers  # noqa F401
        except ImportError:
            pass
