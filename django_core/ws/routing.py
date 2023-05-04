from django.urls import path

# fixme NAME_PROJECT
from django_core.ws.consumer import Consumer

websocket_urlpatterns = [
    path('v1/', Consumer.as_asgi()),
]
