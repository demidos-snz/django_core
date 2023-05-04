from .base import *  # noqa

SECRET_KEY = "some string to bypass django settings loading check"

# https://docs.djangoproject.com/en/dev/ref/settings/#logging
# See https://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = None

INIT_CONNECTIONS = False
