from django_core.utils.service_object import ServiceObject, transactional, service_call


class RemoveUserService(ServiceObject):
    def remove(self, context):
        user = context.user
        user.is_active = False
        user.save()

        return self.success()

    @transactional
    @service_call
    def __call__(self, user):
        return self.success(user=user) | self.remove
