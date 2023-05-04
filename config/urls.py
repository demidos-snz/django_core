from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path, re_path
from django.views import defaults as default_views
from django.views.generic import TemplateView
from django.views.i18n import JavaScriptCatalog

# fixme NAME_PROJECT
from django_core.main import views as main_views

urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path("jsi18n", JavaScriptCatalog.as_view(), name="js-catalog"),
    # Your stuff: custom urls includes go here
    # path("", main_views.IndexView.as_view(), name="index"),
    # fixme NAME_PROJECT
    path("api/v1/", include("django_core.api_v1.urls", namespace="api_v1")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path("^.*$", main_views.IndexView.as_view()),
]

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "403_csrf/",
            TemplateView.as_view(template_name="403_csrf.html"),
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
        path(
            "maintenance_page/",
            TemplateView.as_view(template_name="maintenance.html"),
        ),
        path("release_version/", lambda request: HttpResponse("dev")),
    ]
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
