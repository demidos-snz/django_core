import dns.resolver
import tldextract
from celery.utils.log import get_task_logger
from django.contrib.auth import get_user_model
from dns.exception import DNSException
from dns.rdatatype import RdataType

from config.celery_app import app
from django_core.permissions.models import MxServer, MxParentDomain

User = get_user_model()
logger = get_task_logger('permissions_tasks')


class CantExtractDomain(Exception):
    pass


@app.task
def recheck_email_privacy(user_id: int):
    try:
        user = User.objects.only('email').get(pk=user_id)
    except User.DoesNotExist:
        logger.warning(f'User with id {user_id} not found for email recheck')
        return 'User not found'

    email = user.email
    domain = _extract_domain(email=email)

    for mx_server in _get_mx_servers(domain=domain):
        if mx_server.parent.public:
            return _set_user_email_privacy(user=user, is_private=False)

    _set_user_email_privacy(user=user, is_private=True)


def _extract_domain(email: str) -> str:
    *_, domain = email.partition('@')
    return domain


def _get_mx_servers(domain: str):
    try:
        mx_answers = dns.resolver.resolve(qname=domain, rdtype=RdataType.MX)
    except DNSException as exc:
        logger.error(f'Can`t resolve domain {domain}: {exc}')
        return []

    mx_server_objects = []
    for mx_answer in mx_answers:
        try:
            _mx_object = _get_mx_server_object(exchange=mx_answer.exchange)
        except CantExtractDomain:
            continue

        mx_server_objects.append(_mx_object)

    return mx_server_objects


def _get_mx_server_object(exchange: dns.name.Name) -> MxServer:
    address = exchange.to_text(omit_final_dot=True)

    try:
        return MxServer.objects.get(address=address)
    except MxServer.DoesNotExist:
        parent = _get_mx_server_parent_object(exchange=exchange)
        return MxServer.objects.create(parent=parent, address=address)


def _get_mx_server_parent_object(exchange: dns.name.Name) -> MxParentDomain:
    exchange_address = exchange.to_text(omit_final_dot=True)
    address = _extract_registered_domain(address=exchange_address)

    object_, _ = MxParentDomain.objects.get_or_create(address=address)
    return object_


def _extract_registered_domain(address: str) -> str:
    domain = tldextract.extract(url=address).registered_domain

    if domain:
        return domain

    raise CantExtractDomain


def _set_user_email_privacy(user: User, is_private: bool):
    user.private_email = is_private
    user._prevent_email_check = True
    user.save()
