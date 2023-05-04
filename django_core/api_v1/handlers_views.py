import inspect
import logging
from typing import Dict, Union, BinaryIO, Any
from typing import Iterable, Type

from django.http import HttpResponse
from django.utils.translation import gettext_lazy as _
from drf_rw_serializers.generics import GenericAPIView
from rest_framework.exceptions import PermissionDenied, APIException, ValidationError
from rest_framework.response import Response

# fixme NAME_PROJECT
from django_core.api_v1.serializers import EmptySerializer
# from django_core.permissions.decorators import PermissionsDenied
from django_core.utils.handler import BaseHandler

logger = logging.getLogger(__file__)


class File:
    def __init__(self, content: Union[str, bytes, BinaryIO], file_name: str, content_type: str):
        self.content: Union[str, bytes, BinaryIO] = content
        self.file_name: str = file_name
        self.content_type: str = content_type


class HandlerView(GenericAPIView):
    """ Основной класс обработки request на основе handler. """

    """ Стандартный текст ошибки, если выполнение handler завершилось с необработанным исключением """
    error_text: str = _('Request error')

    """ Код ответа в случае успешного выполнения """
    response_code: int

    """ Класс handler обработчик запроса """
    handler: Type[BaseHandler]

    """ Сериализатор, используемый для проверки входящих данных """
    write_serializer = None
    serializer_class = EmptySerializer

    """ Сериализатор, используемый подготовки ответа """
    read_serializer_class = None

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx.update(user=self.request.user)
        return ctx

    def handle(self) -> Union[Response, HttpResponse]:
        handler_result: Any = self.get_handler_result()
        if not handler_result:
            return Response(status=self.response_code)

        if isinstance(handler_result, File):
            response: HttpResponse = HttpResponse(
                content=handler_result.content,
                status=self.response_code,
                content_type=handler_result.content_type,
            )
            response['Content-Disposition'] = f'attachment; filename="{handler_result.file_name}"'
            return response

        many: bool = False

        if isinstance(handler_result, Iterable) and not isinstance(handler_result, Dict):
            many: bool = True

        read_serializer = self.get_read_serializer(handler_result, many=many)
        return Response(read_serializer.data, status=self.response_code)

    def get_handler_result(self) -> Any:
        """ Метод получения данных от handler """

        try:
            return self._run_handler()

        except self._get_exception_class() as exc:
            """
            Если обработчик завершился с типичной для него ошибкой, значит есть нарушение логики, 
            отправляем код 400 и сообщение, которое вернул обработчик 
            """
            raise ValidationError(detail={'detail': str(exc)})

        # except PermissionsDenied as exc:
        #     """ Класс проверки прав отклонил запрос, отправляем код 403 и сообщение """
        #     raise PermissionDenied(detail={'detail': str(exc)})

        except Exception as exc:
            """ Любая необработанная ошибка - код 500 и стандартный ответ, указанный в классе """
            logger.exception(self.error_text, exc_info=exc)
            raise APIException(detail={'detail': self.error_text})

    def _run_handler(self) -> Any:
        """ Метод запуска класса handler """

        """ Подготовка аргументов """
        kwargs: Dict[str, Any] = self._get_prepared_data()
        if 'user' not in kwargs and 'user' in inspect.signature(self.handler).parameters:
            """
            Обычно kwargs - данные, переданные с запросом. 
            В них не должно быть пользователя, т.к. пользователь для запроса это константа. 
            Добавляет в kwargs объект пользователя, если он нужен классу handler.
            """
            kwargs['user'] = self.request.user

        """ Валидация аргументов """
        kwargs: Dict[str, Any] = self._validate_kwargs(**kwargs)

        """ Вызов обработчика """
        # noinspection PyArgumentList
        handler_object = self.handler(**kwargs)
        return handler_object.run()

    def _get_prepared_data(self) -> Dict[str, Any]:
        write_serializer = self.get_write_serializer(data=self._get_request_data())
        write_serializer.is_valid(raise_exception=True)

        data: Dict[str, Any] = {**write_serializer.validated_data, **self.kwargs}

        return self.handler.prepare_data(user=self.request.user, data=data)

    def _get_request_data(self):
        """
        Подготавливает все данные запроса для передачи в сериализатор,
        т.к. данные могут быть как в строке запроса,
        так и в теле сообщения. Самая печаль когда и там и там.
        """

        if self.request.data:
            request_data = self.request.data.copy()
        else:
            request_data = self.request.query_params.copy()

        request_data.update(self.kwargs)
        return request_data

    def _validate_kwargs(self, **kwargs) -> Dict[str, Any]:
        return self.handler.validate_data(user=kwargs['user'], data=kwargs)

    def _get_exception_class(self):
        """ Получение ошибки класса обработчика для её перехвата """
        return self.handler.exception
