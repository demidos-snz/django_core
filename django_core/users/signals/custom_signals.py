import django.dispatch

user_created = django.dispatch.Signal(providing_args=['user'])
user_removed = django.dispatch.Signal(providing_args=['user_id', 'user_ids'])
user_updated = django.dispatch.Signal(providing_args=['user'])
