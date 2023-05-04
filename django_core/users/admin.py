from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

# from incident_management.permissions.tasks import recheck_email_privacy

User = get_user_model()


def recheck_emails(modeladmin, request, queryset):
    for user in queryset:
        pass
        # recheck_email_privacy.delay(user_id=user.id)


recheck_emails.short_description = _("Recheck emails")


class CustomUserAdmin(UserAdmin):
    ordering = ("email",)
    list_display = ("email", "private_email", "is_staff")
    search_fields = ("name", "surname", "email", "phone")
    actions = [
        recheck_emails,
    ]

    fieldsets = (
        (_("Personal info"),
         {"fields": ("name", "surname", "email", "private_email", "phone", "telegram_chat_id", "role", "password")}),
        (_("Permissions"), {
            "fields": ("is_active", "is_staff", "is_superuser"),
        }),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'role', 'password1', 'password2'),
        }),
    )


admin.site.register(User, CustomUserAdmin)
