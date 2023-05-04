"""
Base settings to build other settings files upon.
"""

import environ
import jinja2
from django.conf import global_settings

# fixme NAME_PROJECT
NAME_PROJECT = "django_core"
ROOT_DIR = (environ.Path(__file__) - 3)
# (NAME_PROJECT/config/settings/base.py - 3 = NAME_PROJECT/)

APPS_DIR = ROOT_DIR.path("djangp_core")

env = environ.Env()

READ_DOT_ENV_FILE = env.bool("DJANGO_READ_DOT_ENV_FILE", default=False)
if READ_DOT_ENV_FILE:
    # OS environment variables take precedence over variables from .env
    env.read_env(str(ROOT_DIR.path(".env")))

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = env.bool("DEBUG", False)

# Local time zone. Choices are
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# though not all of them may be available with every OS.
# In Windows, this must be set to your system time zone.
TIME_ZONE = "UTC"

# https://docs.djangoproject.com/en/dev/ref/settings/#language-code
LANGUAGE_CODE = env("LANGUAGE_CODE", default="en-us")

# https://docs.djangoproject.com/en/dev/ref/settings/#site-id
SITE_ID = 1
SITE_URL = env.str("SITE_URL", "http://localhost:8000")

# https://docs.djangoproject.com/en/dev/ref/settings/#use-i18n
USE_I18N = True

# https://docs.djangoproject.com/en/dev/ref/settings/#use-l10n
USE_L10N = True

# https://docs.djangoproject.com/en/dev/ref/settings/#use-tz
USE_TZ = True

# https://docs.djangoproject.com/en/dev/ref/settings/#locale-paths
LOCALE_PATHS = [ROOT_DIR.path("locale")]

# DATABASES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
    "default": env.db("DATABASE_URL", default="postgres://localhost:5432/dc"),
}
DATABASES["default"]["ATOMIC_REQUESTS"] = True

REDIS_URL = env.str("REDIS_URL", default="redis://localhost:6379")

# URLS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#root-urlconf
ROOT_URLCONF = "config.urls"
# https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = "config.wsgi.application"

# APPS
# ------------------------------------------------------------------------------
DJANGO_APPS = [
    "django_core.apps.CustomAdminConfig",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "corsheaders",
    "channels",
    "webpack_loader",
    "drf_spectacular",
    "django_celery_beat",
    "notifications",
    "durationwidget",
    "phonenumber_field",
    "simple_history",
]

LOCAL_APPS = [
    "django_core.main.apps.MainConfig",
    "django_core.api_v1.apps.ApiV2Config",
    "django_core.ws.apps.WsV2Config",

    "django_core.permissions.apps.PermissionsConfig",
    "django_core.reports.apps.ReportsConfig",
    "django_core.users.apps.UsersConfig",
    "django_core.actives.apps.ActivesConfig",
    "django_core.organizations.apps.OrganizationsConfig",
]

# https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# https://drf-spectacular.readthedocs.io/en/latest/readme.html#installation
SPECTACULAR_SETTINGS = {
    # fixme TITLE
    "TITLE": "Django Core API",
    "VERSION": "1.0.0",
    "SWAGGER_UI_SETTINGS": {
        "filter": True,
    },
    "COMPONENT_SPLIT_REQUEST": True,
}

# https://www.django-rest-framework.org/#installation
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_SCHEMA_CLASS": "config.setting.schema.DjangoCoreAutoSchema",
}

# MIGRATIONS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#migration-modules
MIGRATION_MODULES = {"sites": "django_core.contrib.sites.migrations"}

# https://docs.djangoproject.com/en/dev/ref/settings/#auth-user-model
AUTH_USER_MODEL = "users.User"

# https://docs.djangoproject.com/en/dev/ref/settings/#login-redirect-url
LOGIN_REDIRECT_URL = "/main"

# https://docs.djangoproject.com/en/dev/ref/settings/#logout-redirect-url
LOGOUT_REDIRECT_URL = "/accounts/login"

# PASSWORDS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
PASSWORD_HASHERS = [
    # https://docs.djangoproject.com/en/dev/topics/auth/passwords/#using-argon2-with-django
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 8,
        }
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
    {
        "NAME": "django_core.users.validators.password.MaximumLengthValidator",
        "OPTIONS": {
            "max_length": 16,
        }
    },
]

# MIDDLEWARE
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# FRONT
FRONTEND_DIR = APPS_DIR.path("frontend")

# https://github.com/django-webpack/django-webpack-loader#configuring-the-settings-file
WEBPACK_LOADER = {
    "DEFAULT": {
        "CACHE": DEBUG,
        "BUNDLE_DIR_NAME": "/bundles/",
        "STATS_FILE": FRONTEND_DIR.path("webpack-stats.json")
    },
}

# STATIC
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = env("STATIC_DIR", default=str(ROOT_DIR("static")))

# https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = "/static/"

# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#std:setting-STATICFILES_DIRS
STATICFILES_DIRS = [str(FRONTEND_DIR.path("dist"))]

# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#staticfiles-finders
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

# MEDIA
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#media-root
MEDIA_ROOT = env.str("MEDIA_DIR", str(APPS_DIR("mediafiles")))

# https://docs.djangoproject.com/en/dev/ref/settings/#media-url
MEDIA_URL = "/media/"

TEMPLATES = [
    {
        # https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES-BACKEND
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # https://docs.djangoproject.com/en/dev/ref/settings/#template-dirs
        "DIRS": [str(APPS_DIR.path("templates"))],
        "OPTIONS": {
            # https://docs.djangoproject.com/en/dev/ref/settings/#template-loaders
            # https://docs.djangoproject.com/en/dev/ref/templates/api/#loader-types
            "loaders": [
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
            # https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# FIXTURES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#fixture-dirs
FIXTURE_DIRS = (str(APPS_DIR.path("fixtures")))

# SECURITY
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-age
SESSION_COOKIE_AGE = env.int("SESSION_COOKIE_AGE", 7 * 24 * 60 * 60)  # 7 days
# https://docs.djangoproject.com/en/dev/ref/settings/#session-cookie-httponly
SESSION_COOKIE_HTTPONLY = True
# https://docs.djangoproject.com/en/4.1/ref/settings/#session-save-every-request
SESSION_SAVE_EVERY_REQUEST = True
# https://docs.djangoproject.com/en/dev/ref/settings/#csrf-cookie-httponly
CSRF_COOKIE_HTTPONLY = False
# https://docs.djangoproject.com/en/dev/ref/settings/#secure-browser-xss-filter
SECURE_BROWSER_XSS_FILTER = True
# https://docs.djangoproject.com/en/dev/ref/settings/#x-frame-options
X_FRAME_OPTIONS = "ANY"

# ADMIN
# ------------------------------------------------------------------------------
# Django Admin URL.
ADMIN_URL = "admin/"

# https://docs.djangoproject.com/en/dev/ref/settings/#admins
ADMINS = []

# https://docs.djangoproject.com/en/dev/ref/settings/#managers
MANAGERS = ADMINS

# Celery
# ------------------------------------------------------------------------------
if USE_TZ:
    # http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-timezone
    CELERY_TIMEZONE = TIME_ZONE
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-broker_url
CELERY_BROKER_URL = env("CELERY_BROKER_URL", default=REDIS_URL)
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-result_backend
CELERY_RESULT_BACKEND = env("CELERY_RESULT_BACKEND", default=REDIS_URL)
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-accept_content
CELERY_ACCEPT_CONTENT = ["json"]
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-task_serializer
CELERY_TASK_SERIALIZER = "json"
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-result_serializer
CELERY_RESULT_SERIALIZER = "json"
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#task-time-limit
# TODO: set to whatever value is adequate in your circumstances
CELERY_TASK_TIME_LIMIT = 5 * 60
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#task-soft-time-limit
# TODO: set to whatever value is adequate in your circumstances
CELERY_TASK_SOFT_TIME_LIMIT = 7 * 24 * 60 * 60  # week
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#beat-scheduler
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"
# https://docs.celeryproject.org/en/latest/userguide/configuration.html#task-ignore-result
CELERY_TASK_IGNORE_RESULT = True

# channels
# ------------------------------------------------------------------------------
# https://channels.readthedocs.io/en/latest/installation.html
ASGI_APPLICATION = "config.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(env("REDIS_HOST", default="127.0.0.1"), 6379)],
        },
    },
}

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND",
    default="django.core.mail.backends.console.EmailBackend",
)
EMAIL_HOST = env("EMAIL_HOST", default=global_settings.EMAIL_HOST)
EMAIL_PORT = env("EMAIL_PORT", default=global_settings.EMAIL_PORT)
EMAIL_HOST_USER = env(
    "DJANGO_EMAIL_HOST_USER", default=global_settings.EMAIL_HOST_USER,
)
EMAIL_HOST_PASSWORD = env(
    "DJANGO_EMAIL_HOST_PASSWORD", default=global_settings.EMAIL_HOST_PASSWORD,
)

# https://docs.djangoproject.com/en/dev/ref/settings/#date-format
DATE_FORMAT = "j E Y"

# https://docs.djangoproject.com/en/4.0/ref/settings/#format-module-path
FORMAT_MODULE_PATH = "config.formats"

# Project settings

# Jinja templates
TEMPLATE_LOADER = jinja2.FileSystemLoader(searchpath="./templates")

TEMPLATE_ENV = jinja2.Environment(loader=TEMPLATE_LOADER)

RELEASE_VERSION = ""

FILE_UPLOAD_MAX_MEMORY_SIZE = env.int("FILE_UPLOAD_MAX_MEMORY_SIZE", 31457280)

CORS_ALLOW_ALL_ORIGINS = env.bool("CORS_ALLOW_ALL_ORIGINS", True)
CORS_URLS_REGEX = r"^/api/.*$"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Notifications
NOTIFICATIONS_DELIVERY_BACKEND = "notifications.backends.Celery"
NOTIFICATIONS_QUEUE_NAME = "celery"

ONLY_STAFF_NOTIFICATIONS = env.bool("ONLY_STAFF_NOTIFICATIONS", False)

# Telegram notification settings
TELEGRAM_BOT_TOKEN = env.str("TELEGRAM_BOT_TOKEN", None)
TELEGRAM_BOT_NAME = env.str("TELEGRAM_BOT_NAME", None)

TELEGRAM_NOTIFICATION_PROVIDER = env.str("TELEGRAM_NOTIFICATION_PROVIDER", "console")

# Email notification settings
EMAIL_NOTIFICATION_PROVIDER = env.str("EMAIL_NOTIFICATION_PROVIDER", "console")

# SMS notification settings
SMS_GATE_LOGIN = env.str("SMS_GATE_LOGIN", None)
SMS_GATE_PASSWORD = env.str("SMS_GATE_PASSWORD", None)
SMS_SENDER_NAME = env.str("SMS_SENDER_NAME", None)
SMS_NOTIFICATION_PROVIDER = env.str("SMS_NOTIFICATION_PROVIDER", "console")

# Password status task settings
PASSWORD_UPDATE_NOTIFICATION_PERIOD = env.int("PASSWORD_UPDATE_NOTIFICATION_PERIOD", 14 * 24 * 60 * 60)  # 14 days
PASSWORD_EXPIRATION_PERIOD = env.int("PASSWORD_EXPIRATION_PERIOD", 90 * 24 * 60 * 60)  # 90 days

# User is_active task settings
USER_INACTIVITY_PERIOD = env.int("USER_INACTIVITY_PERIOD", 90 * 24 * 60 * 60)  # 90 days
