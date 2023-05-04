from __future__ import annotations

import re
from abc import ABCMeta
from collections import defaultdict
from itertools import chain
from typing import Any, Dict, Callable, DefaultDict, Set, Type, Optional

from django.contrib.auth import get_user_model

User = get_user_model()

GROUP_NAME = 'name'
SINGLE_OBJECT_REGEX = rf'^(?P<{GROUP_NAME}>[a-zA-Z_]+)_id$'
MANY_OBJECTS_REGEX = rf'^(?P<{GROUP_NAME}>[a-zA-Z_]+)_ids$'


class NotReady(Exception):
    pass


class DependencyCannotBeResolved(Exception):
    pass


class BaseDataHandler:
    """
    Класс подготовки (например получение из БД):
    {
        incident_id: 213,
        comment_id: 12,
        user_ids: [1, 2, 3],
    } -> {
        incident: <Incident: 213>,
        comment: <Comment: 12>,
        users: <QuerySet [<User: 1>, <User: 2>, <User: 3>]>
    }
    Ищет метод с названием `_prepare_[dict_key]`, если такой метод есть,
    то он должен вернуть подготовленное для работы значение.
    Название поля в итоговом словаре должно быть указано в `field_names`.
    По умолчанию переводит названия типа
    `[some_element]_id` в `some_element` и `[some_object]_ids` в `some_objects`.
    """

    field_names: Dict[str, str] = {
        # частный случай, пользователь уже есть у каждого запроса,
        # название такого аргумента нельзя
        # обрабатывать по общим правилам
        'user_id': 'user_id',
    }
    _dependency_resolve_counter: DefaultDict = defaultdict(int)

    def __init__(self, handler: Type[BaseHandler], user, data):
        """
        :param user: Объект пользователя. Вдруг необходим для получения значения.
        :param data: Данные для преобразования.
        """

        self.handler: Type[BaseHandler] = handler
        self.data: Dict[str, Any] = data
        self.data.update(user=user)

        self.prepared_data: Dict[str, Any] = {}
        self._prepared_names: Dict[str, str] = self._get_prepared_names()
        self._allowed_names: Set[str] = set(chain.from_iterable(self._prepared_names.items()))

    def __getattr__(self, item: str) -> Any:
        """
        Метод, благодаря которому внутри методов подготовки можно обращаться к полям
        (переданным или вычисленным) как к атрибутам.

        Проводит проверку, что запрашиваемое поле может быть вычислено на основе переданных данных.

        :raise DependencyCannotBeResolved: Значение атрибута не может быть вычислено для текущего контекста.
        :raise NotReady: Значение атрибута ещё не вычислено.
        """

        if item.startswith('_prepare'):
            return None

        if item.startswith('_clean'):
            return None

        if item not in self._allowed_names:
            """ Если атрибут не может быть вычислен """
            raise DependencyCannotBeResolved(item)

        if item in self.prepared_data:
            """ Если уже подготовлен """
            return self.prepared_data[item]

        if item in self.data:
            """ Иначе берём из исходных данных """
            return self.data[item]

        """ Счетчик доступа к атрибуту. Необходим для предотвращения зацикливания """
        self._dependency_resolve_counter[item] += 1
        if self._dependency_resolve_counter[item] < 10:
            """ На первый раз говорим, что атрибут ещё не вычислен """
            raise NotReady(item)

        """ Если пытаемся получить один и тот же атрибут уже второй раз """
        raise DependencyCannotBeResolved(item)

    def prepare(self) -> Dict[str, Any]:
        """
        Основной рабочий метод.
        Перебирает все поля переданного словаря,
        ищет методы подготовки, складывает в словарь подготовленных данных.
        """

        data_keys = list(self.data.keys())
        while data_keys:
            """ Пока есть неготовые атрибуты """
            name: str = data_keys.pop(0)
            prepare_method: Optional[Callable] = getattr(self, f'_prepare_{name}', None)

            if prepare_method:
                try:
                    value: Any = prepare_method()
                except NotReady:
                    """ 
                    Если на данной итерации необходимые значения не готовы, 
                    то ставим в конец списка 
                    """
                    data_keys.append(name)
                    continue

            else:
                value: Any = self.data[name]

            self.prepared_data.update({self._prepared_names[name]: value})

        return self.prepared_data

    def _get_prepared_names(self) -> Dict[str, str]:
        """ Метод получения словаря исходных названий к итоговым названиям """

        result: Dict[str, str] = {}
        for name in self.data:
            prepared_name: str = self._get_prepared_name(name=name)
            result.update({name: prepared_name})

        return result

    def _get_prepared_name(self, name: str) -> str:
        """ Метод получения итогового названия поля """

        if name in self.field_names:
            """ Если итоговое название указано в словаре """
            return self.field_names[name]

        single_object_result = re.search(pattern=SINGLE_OBJECT_REGEX, string=name)
        if single_object_result:
            """ Если название атрибута подходит под регулярку идентификатора одиночного объекта """
            return single_object_result.group(GROUP_NAME)

        many_objects_result = re.search(pattern=MANY_OBJECTS_REGEX, string=name)
        if many_objects_result:
            """ Если название атрибута подходит под регулярку идентификаторов объектов """
            return f'{many_objects_result.group(GROUP_NAME)}s'

        """ Если название не найдено - оставляем начальное """
        return name

    def validate(self) -> Dict[str, Any]:
        """
        Перебирает переданный словарь, ищет методы валидации,
        обновляет данные в переданном словаре.
        """

        for attr, value in self.data.items():
            if value is None:
                continue

            clean_method: Optional[Callable] = getattr(self, f'_clean_{attr}', None)
            if clean_method:
                value: Any = clean_method(value)

            self.data[attr] = value

        return self.data

    @staticmethod
    def _get_value_of_desired_size(value: str, max_length: int) -> str:
        return value[:max_length]

    # OBJECT PREPARATION


class HandlerException(Exception):
    pass


class BaseHandler(metaclass=ABCMeta):
    """ Базовый класс обработки запроса. Отвечает за проверку бизнес-логики и её реализацию """

    data_handler = BaseDataHandler
    exception = HandlerException

    def run(self) -> Any:
        """ Основной метод любого класса обработчика """
        raise NotImplementedError()

    @classmethod
    def prepare_data(cls, user, data) -> Dict[str, Any]:
        """ Метод подготовки данных для класса """
        return cls.data_handler(handler=cls, user=user, data=data).prepare()

    @classmethod
    def validate_data(cls, user, data) -> Dict[str, Any]:
        """ Метод валидации данных для класса """
        return cls.data_handler(handler=cls, user=user, data=data).validate()
