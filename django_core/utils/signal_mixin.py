import types
from abc import ABC

from django.db import transaction


class SignalMixin(ABC):
    _signal_prevented: bool = False
    signal = None
    signal_sender = None

    def prevent_signal_send(self):
        self._signal_prevented = True

    def _send_signal(self, **kwargs):
        if self._signal_prevented:
            return

        signal_kwargs = self._get_signal_kwargs(**kwargs)

        if isinstance(signal_kwargs, types.GeneratorType):
            for kwargs in signal_kwargs:
                self.send_signal(**kwargs)

        else:
            self.send_signal(**signal_kwargs)

    @staticmethod
    def _get_signal_kwargs(**kwargs):
        return kwargs

    @classmethod
    def send_signal(cls, **kwargs):
        def send():
            cls.signal.send(sender=cls.signal_sender, **kwargs)

        transaction.on_commit(send)
