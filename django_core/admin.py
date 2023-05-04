from django.contrib.admin.sites import AdminSite
from django.urls import path
from django.utils.translation import gettext_lazy as _

# from incident_management.notifs.admin_views import (
#     ListPushNotificationAdminView,
#     ChangePushNotificationAdminView,
#     CreatePushNotificationAdminView,
#     DeletePushNotificationAdminView,
# )


PUSH_NOTIFICATIONS_BASE = {
    "name": _("Push notifications"),
    "object_name": "push_notification",
    "perms": {
        "add": True,
        "change": True,
        "delete": True,
        "view": True,
    },
    "view_only": False,
}

PUSH_NOTIFICATIONS_INDEX = {
    **PUSH_NOTIFICATIONS_BASE,
    "add_url": "notifs/push_notifications/add/",
    "admin_url": "notifs/push_notifications/",
}

PUSH_NOTIFICATIONS_APP = {
    **PUSH_NOTIFICATIONS_BASE,
    "add_url": "push_notifications/add",
    "admin_url": "push_notifications/",
}


class CustomAdminSite(AdminSite):
    site_title = _("Incident management site admin")
    site_header = _("Incident management administration")
    index_title = _("Incident management site administration")

    def get_urls(self):
        # list_view = self.admin_view(ListPushNotificationAdminView.as_view())
        # change_view = self.admin_view(ChangePushNotificationAdminView.as_view())
        # add_view = self.admin_view(CreatePushNotificationAdminView.as_view())
        # delete_view = self.admin_view(DeletePushNotificationAdminView.as_view())
        #
        # urls = [
        #     path("notifs/push_notifications/", list_view, name="notifs_push_notifications_changelist"),
        #     path("notifs/push_notifications/<str:key>/change/", change_view, name="notifs_push_notifications_change"),
        #     path("notifs/push_notifications/add/", add_view, name="notifs_push_notifications_add"),
        #     path("notifs/push_notifications/<str:key>/delete/", delete_view, name="notifs_push_notifications_delete"),
        # ]
        urls = []
        urls += super().get_urls()
        return urls

    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        try:
            notifs_app = next(filter(lambda item: item["app_label"] == "notifs", app_list))

        except StopIteration:
            pass

        else:
            notifs_app["models"].append(PUSH_NOTIFICATIONS_INDEX)

        return app_list

    def _build_app_dict(self, request, label=None):
        app_dict = super()._build_app_dict(request=request, label=label)
        app_label = app_dict.get("app_label")
        if app_label == "notifs":
            app_dict["models"].append(PUSH_NOTIFICATIONS_APP)
        return app_dict
