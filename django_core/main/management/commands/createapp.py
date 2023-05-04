import os

from django.conf import settings
from django.core.management import CommandError
from django.core.management.commands.startapp import Command as CreateAppCommand


class Command(CreateAppCommand):
    def handle(self, **options):
        app_name = options['name']
        target = options['directory']

        if not target:
            app_dir = os.path.join(settings.APPS_DIR, app_name)
            options['directory'] = os.path.join(os.path.basename(settings.APPS_DIR), app_name)

            if os.path.exists(app_dir):
                raise CommandError(
                    f'"{app_name}" conflicts with the name of an existing Python module and '
                    'cannot be used as an app directory. Please try another directory.'
                )

            os.mkdir(app_dir)

        super().handle(**options)
