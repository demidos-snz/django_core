from django.contrib.admin.apps import AdminConfig


class CustomAdminConfig(AdminConfig):
    # fixme NAME_PROJECT
    default_site = 'django_core.admin.CustomAdminSite'
