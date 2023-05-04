from django.db import models
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel

from incident_management.incidents.models import Status, CMLine
from incident_management.users.models import Role


class RuleEntities(models.IntegerChoices):
    NAME = (1, _("Name"))
    SEVERITY = (2, _("Severity"))
    TYPE = (3, _("Type"))
    DESCRIPTION = (4, _("Description"))
    STATUS = (5, _("Status"))
    CM_LINE = (6, _("CM Line"))
    OPERATOR = (7, _("Operator"))
    EVENTS = (9, _("Events"))
    RECOMMENDATIONS = (10, _("Recommendations"))
    ACTIONS_TAKEN = (11, _("Actions taken"))
    RECOMMENDATION_CONFIRMATION = (12, _("Recommendations confirmation"))
    NCIRCC = (13, _("NCIRCC"))


class Author(models.IntegerChoices):
    CM = (1, _("Center of monitoring"))
    CUSTOMER = (2, _("Customer"))


class RoleModel(TimeStampedModel):
    entity = models.IntegerField(
        verbose_name=_("Entity"),
        choices=RuleEntities.choices,
    )

    author = models.IntegerField(
        verbose_name=_("Author"),
        choices=Author.choices,
    )

    role = models.IntegerField(
        verbose_name=_("Role"),
        choices=Role.choices,
    )

    line = models.IntegerField(
        verbose_name=_("Current line"),
        choices=CMLine.choices,
    )

    status = models.IntegerField(
        verbose_name=_("Status"),
        choices=Status.choices,
    )

    create = models.BooleanField(
        verbose_name=_("Create"),
        default=False,
    )

    read = models.BooleanField(
        verbose_name=_("Read"),
        default=False,
    )

    update = models.BooleanField(
        verbose_name=_("Update"),
        default=False,
    )

    delete = models.BooleanField(
        verbose_name=_("Delete"),
        default=False,
    )


class MxParentDomain(TimeStampedModel):
    address = models.CharField(
        verbose_name=_("Address"),
        max_length=127,
        blank=False,
        null=False,
    )

    private = models.BooleanField(
        verbose_name=_("Is private domain"),
        default=False,
    )

    @property
    def public(self):
        return not self.private

    def __str__(self):
        if self.private:
            return "%s: 👌" % self.address

        return self.address


class MxServer(TimeStampedModel):
    parent = models.ForeignKey(
        verbose_name=_("Exchange parent domain"),
        on_delete=models.CASCADE,
        to=MxParentDomain,
        null=False,
        blank=False,
    )

    address = models.CharField(
        verbose_name=_("Exchange address"),
        max_length=127,
        blank=False,
        null=False,
    )

    def __str__(self):
        return self.address
