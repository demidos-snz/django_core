from urllib.parse import urlparse

from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import path
from django.utils.translation import gettext_lazy as _

from django_core.permissions.models import RoleModel, MxServer, MxParentDomain
from django_core.permissions.utils.rule_names import IncidentRuleManager


def make_can_read(modeladmin, request, queryset):
    queryset.update(read=True)


make_can_read.short_description = _('Mark can read')


def unmake_can_read(modeladmin, request, queryset):
    queryset.update(read=False)


unmake_can_read.short_description = _('Unmark can read')


def make_can_create(modeladmin, request, queryset):
    queryset.update(create=True)


make_can_create.short_description = _('Mark can create')


def unmake_can_create(modeladmin, request, queryset):
    queryset.update(create=False)


unmake_can_create.short_description = _('Unmark can create')


def make_can_update(modeladmin, request, queryset):
    queryset.update(update=True)


make_can_update.short_description = _('Mark can update')


def unmake_can_update(modeladmin, request, queryset):
    queryset.update(update=False)


unmake_can_update.short_description = _('Unmark can update')


def make_can_delete(modeladmin, request, queryset):
    queryset.update(delete=True)


make_can_delete.short_description = _('Mark can delete')


def unmake_can_delete(modeladmin, request, queryset):
    queryset.update(delete=False)


unmake_can_delete.short_description = _('Unmark can delete')


class RoleModelAdmin(admin.ModelAdmin):
    change_list_template = 'permissions/change_list.html'
    list_display = ('entity', 'author', 'line', 'status', 'role', 'create', 'read', 'update', 'delete')
    list_editable = ('create', 'read', 'update', 'delete')
    list_filter = ('entity', 'author', 'line', 'role', 'status')
    actions = [
        make_can_create,
        unmake_can_create,
        make_can_read,
        unmake_can_read,
        make_can_update,
        unmake_can_update,
        make_can_delete,
        unmake_can_delete,
    ]

    def has_add_permission(self, request):
        return False

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('reload_rules/', self.reload_rules, name='reload_rules'),
        ]
        return my_urls + urls

    @staticmethod
    def reload_rules(request):
        IncidentRuleManager.update()
        query = urlparse(request.META['HTTP_REFERER']).query
        return HttpResponseRedirect(f'../?{query}')


class MxServerAdmin(admin.ModelAdmin):
    list_display = ('address', 'created', 'modified')
    list_filter = ('parent',)
    search_fields = ('address',)


def make_public(modeladmin, request, queryset):
    queryset.update(private=False)


make_public.short_description = _('Mark public')


def make_private(modeladmin, request, queryset):
    queryset.update(private=True)


make_private.short_description = _('Mark private')


class MxParentDomainAdmin(admin.ModelAdmin):
    list_display = ('address', 'private', 'created', 'modified')
    list_filter = ('private',)
    search_fields = ('address',)
    actions = [
        make_public,
        make_private,
    ]


admin.site.register(RoleModel, RoleModelAdmin)
admin.site.register(MxServer, MxServerAdmin)
admin.site.register(MxParentDomain, MxParentDomainAdmin)
