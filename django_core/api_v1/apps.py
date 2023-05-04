from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


# fixme NAME_PROJECT
class ApiV1Config(AppConfig):
    name = 'django_core.api_v1'
    verbose_name = _('API')
