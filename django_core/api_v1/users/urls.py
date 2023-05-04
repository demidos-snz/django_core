from django.urls import path

from django_core.api_v1.users.views import UsersView, UserView

app_name = 'users'

urlpatterns = [
    path('', UsersView.as_view()),
    path('<int:user_id>/', UserView.as_view()),
]
