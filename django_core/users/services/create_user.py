from typing import Optional, List

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from django_core.users.models import Role
from django_core.utils.service_object import ServiceObject, transactional, service_call

User = get_user_model()

STAFF_ROLES = [
    Role.SUPERUSER,
    Role.SYSADMIN,
    Role.OPERATOR_OF_FIRST_LINE,
    Role.OPERATOR_OF_SECOND_LINE,
]


class CreateUserService(ServiceObject):
    def __init__(self):
        self.password: Optional[str] = None

    def create(self, context):
        try:
            user = User.objects.create_user(
                name=context.name,
                surname=context.surname,
                patronymic=context.patronymic,
                role=context.role,
                password=self.password,
                email=context.email,
                phone=context.phone,
            )
        except ValidationError as exc:
            return self.fail_with(exception=exc)

        return self.success(user=user)

    def set_if_admin(self, context):
        if context.role == Role.SUPERUSER:
            context.user.is_superuser = True

        return self.success()

    def set_if_staff(self, context):
        if context.role in STAFF_ROLES:
            context.user.is_staff = True

        return self.success()

    # def set_related_organizations(self, context):
    #     role: int = context.role
    #
    #     base_organizations_qs = Organization.objects.filter(is_active=True, parent__isnull=True)
    #
    #     if role == Role.OPERATOR_OF_FIRST_LINE:
    #         organizations = base_organizations_qs.filter(first_line_cm=True)
    #
    #     elif role == Role.OPERATOR_OF_SECOND_LINE:
    #         organizations = base_organizations_qs
    #
    #     else:
    #         organizations = Organization.objects.none()
    #
    #     return self.success(organizations=organizations)
    #
    # def connect_organizations(self, context):
    #     users: List[OrganizationUser] = []
    #     user: User = context.user
    #
    #     for organization in context.organizations:
    #         users.append(OrganizationUser(organization=organization, user=user))
    #
    #     OrganizationUser.objects.bulk_create(objs=users, batch_size=100)
    #
    #     return self.success()

    def update_user(self, context):
        context.user.save()
        return self.success()

    @transactional
    @service_call
    def __call__(self, name: str, surname: str, patronymic: str, role: int,
                 password: str, email: str, phone: Optional[str]):
        self.password = password

        return self.success(
            name=name,
            surname=surname,
            patronymic=patronymic,
            role=role,
            email=email,
            phone=phone,
        ) | \
            self.create | \
            self.set_if_admin | \
            self.set_if_staff | \
            self.update_user
            # self.set_related_organizations | \
            # self.connect_organizations | \
            # self.update_user
