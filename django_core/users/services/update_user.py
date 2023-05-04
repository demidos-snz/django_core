from django.contrib.auth import get_user_model

from django_core.utils.service_object import ServiceObject

User = get_user_model()


class UpdateUserService(ServiceObject):

    def update(self, context):
        user = context.user
        for attr, value in context.params.items():
            setattr(user, attr, value)

        user.save()
        return self.success()

    def __call__(self, user: User, **kwargs):
        return self.success(user=user, params=kwargs) | self.update
