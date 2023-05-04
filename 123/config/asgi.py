"""
ASGI entrypoint. Configures Django and then runs the application
defined in the ASGI_APPLICATION setting.
Source: https://channels.readthedocs.io/en/latest/deploying.html#run-protocol-servers
"""

import os
import sys

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url
from django.core.asgi import get_asgi_application

# This allows easy placement of apps within the interior incident_management directory.
app_path = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir)
)
# fixme NAME_PROJECT
sys.path.append(os.path.join(app_path, "django_core"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

# fixme NAME_PROJECT
from django_core.ws.consumer import Consumer

application = ProtocolTypeRouter(
    {
        # Django's ASGI application to handle traditional HTTP requests
        # "http": django_asgi_app,

        # WebSocket handler
        "websocket": AuthMiddlewareStack(
            URLRouter(
                [
                    url(r"^ws/v1/$", Consumer.as_asgi()),
                ],
            ),
        ),
    },
)
