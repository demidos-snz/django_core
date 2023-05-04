from typing import Dict, Any

from django.contrib.auth import get_user_model

User = get_user_model()


class EventPermissions:
    def __init__(self, user: User, event_code: str, data: Dict[str, Any]):
        self.user: User = user
        self.event_code: str = event_code
        self.event_data = data

        self.__pass_attrs = ['user']  # event checker can add some attrs to pass attr_checking

    def __call__(self, *args, **kwargs):
        # Check event firstly.

        event_check_method_name = f'event_{self.event_code}'
        event_check_method = getattr(self, event_check_method_name, None)

        if event_check_method is not None:
            event_granted = event_check_method()

            if event_granted is not None:  # Just if event checker return TRUE or FALSE
                return event_granted

        # If event checker do not know (?) check data attrs.

        for attr_name in self.event_data.keys():
            if attr_name in self.__pass_attrs:
                continue

            attr_check_method_name = f'attr_{attr_name}'
            attr_check_method = getattr(self, attr_check_method_name, None)

            if attr_check_method is not None:
                attr_granted = attr_check_method()

                if attr_granted is False:  # Just if attr checker return FALSE
                    return attr_granted

        # backward compatibility
        return True

    # ATTRS

    # EVENTS
