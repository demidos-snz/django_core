from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class WsConfig(AppConfig):
    # fixme NAME_PROJECT
    name = 'django_core.ws'
    verbose_name = _('Socket app')

    def ready(self):
        try:
            import django_core.ws.signals.handlers  # noqa F401
        except ImportError:
            pass
