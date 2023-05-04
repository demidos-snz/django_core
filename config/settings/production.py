import socket

from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = env("SECRET_KEY")

# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS")

# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = False

# https://docs.djangoproject.com/en/2.2/ref/settings/#use-x-forwarded-host
USE_X_FORWARDED_HOST = env.bool("DJANGO_USE_X_FORWARDED_HOST", default=False)

# DATABASES
# ------------------------------------------------------------------------------
env.str("DATABASE_URL")
# fixme # noqa F405
DATABASES["default"]["CONN_MAX_AGE"] = env.int("CONN_MAX_AGE", default=60)  # noqa F405

REDIS_URL = env.str("REDIS_URL")

# CACHES
# ------------------------------------------------------------------------------
CACHES = {
    "default": {
        # fixme ?
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            # Mimicing memcache behavior.
            # http://niwinz.github.io/django-redis/latest/#_memcached_exceptions_behavior
            "IGNORE_EXCEPTIONS": True,
        },
    },
}

# SECURITY
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#secure-proxy-ssl-header
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# https://docs.djangoproject.com/en/dev/ref/settings/#secure-ssl-redirect
SECURE_SSL_REDIRECT = env.bool("DJANGO_SECURE_SSL_REDIRECT", default=True)

# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-secure
SESSION_COOKIE_SECURE = True

# https://docs.djangoproject.com/en/2.2/ref/settings/#session-cookie-samesite
SESSION_COOKIE_SAMESITE = "Strict"

# https://docs.djangoproject.com/en/2.2/ref/settings/#std:setting-X_FRAME_OPTIONS
X_FRAME_OPTIONS = "DENY"

# https://docs.djangoproject.com/en/dev/ref/settings/#csrf-cookie-secure
CSRF_COOKIE_SECURE = True

# https://docs.djangoproject.com/en/dev/topics/security/#ssl-https
# https://docs.djangoproject.com/en/dev/ref/settings/#secure-hsts-seconds
# TODO: set this to 60 seconds first and then to 518400 once you prove the former works
SECURE_HSTS_SECONDS = 60

# https://docs.djangoproject.com/en/dev/ref/settings/#secure-hsts-include-subdomains
SECURE_HSTS_INCLUDE_SUBDOMAINS = env.bool(
   "DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", default=True,
)

# https://docs.djangoproject.com/en/dev/ref/settings/#secure-hsts-preload
SECURE_HSTS_PRELOAD = env.bool(
    "DJANGO_SECURE_HSTS_PRELOAD", default=True,
)

# https://docs.djangoproject.com/en/dev/ref/middleware/#x-content-type-options-nosniff
SECURE_CONTENT_TYPE_NOSNIFF = env.bool(
   "DJANGO_SECURE_CONTENT_TYPE_NOSNIFF", default=True,
)

# TEMPLATES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#templates
# fixme # noqa F405
TEMPLATES[0]["OPTIONS"]["loaders"] = [  # noqa F405
    (
        "django.template.loaders.cached.Loader",
        [
            "django.template.loaders.filesystem.Loader",
            "django.template.loaders.app_directories.Loader",
        ],
    ),
]

# ADMIN
# ------------------------------------------------------------------------------
# Django Admin URL regex.
ADMIN_URL = env("DJANGO_ADMIN_URL")

# Celery
# ------------------------------------------------------------------------------
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-broker_url
CELERY_BROKER_URL = env("CELERY_BROKER_URL")

# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-result_backend
CELERY_RESULT_BACKEND = env("CELERY_RESULT_BACKEND")


# LOGGING
# ------------------------------------------------------------------------------
hostname = socket.gethostname()

PROJECT_LOGGING_LEVEL = env.str("PROJECT_LOGGING_LEVEL", "WARNING")
PROJECT_LOGGING_DIR = env.str("LOG_DIR", f"/var/log/{NAME_PROJECT}/{hostname}")

# https://docs.djangoproject.com/en/dev/ref/settings/#logging
# See https://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "formatters": {
        "verbose": {
            "format": "[%(asctime)s] %(levelname)s %(module)s "
                      "%(process)d %(thread)d %(message)s"
        },
    },
    "handlers": {
        "file": {
            "level": "DEBUG",
            "class": "logging.handlers.TimedRotatingFileHandler",
            "formatter": "verbose",
            "filename": f"{PROJECT_LOGGING_DIR}/{hostname}.log",
            "when": "midnight",
            "interval": 1,
            "backupCount": 10,
            "encoding": "utf-8",
        },
    },
    "loggers": {
        # root logger
        "": {
            "level": PROJECT_LOGGING_LEVEL,
            "handlers": ["file"],
        },
        "django": {
            "level": PROJECT_LOGGING_LEVEL,
            "handlers": ["file"],
            "propagate": False,
        },
        "celery": {
            "level": PROJECT_LOGGING_LEVEL,
            "handlers": ["file"],
            "propagate": False,
        },
        "daphne": {
            "level": PROJECT_LOGGING_LEVEL,
            "handlers": ["file"],
            "propagate": False,
        },
        # Errors logged by the SDK itself
        "sentry_sdk": {
            "level": PROJECT_LOGGING_LEVEL,
            "handlers": ["file"],
            "propagate": False
        },
    },
}

# Release
# ------------------------------------------------------------------------------
release_version_file = env.str(
    "RELEASE_VERSION_FILE",
    efault=f"/etc/{NAME_PROJECT}/release",
)

if not os.path.exists(release_version_file):
    raise ImproperlyConfigured(
        "Не указана переменная RELEASE_VERSION_FILE, "
        "содержащая путь к файлу, в котором указана версия комплекса"
    )

with open(release_version_file) as f:
    RELEASE_VERSION = f.readline().strip()

