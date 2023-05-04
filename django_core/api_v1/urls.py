from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

app_name = 'api_v1'

# fixme NAME_PROJECT
urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger/', SpectacularSwaggerView.as_view(url_name='api_v1:schema'), name='swagger'),
    path('users/', include('django_core.api_v1.users.urls', namespace='users')),
]
