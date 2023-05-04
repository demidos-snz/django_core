import { getActivityTypeItems } from '@/constants/constants'

export const getRelatedObservablesServiceFields = () => {
  return [
    {
      type: 'text',
      label: 'Сетевая служба',
      name: 'name',
      required: true,
    },
    {
      type: 'text',
      label: 'Порт/протокол',
      name: 'value',
      required: true,
    },
  ]
}

export const getRelatedObservablesIPv4Fields = () => {
  return [
    {
      type: 'text',
      label: 'IP адрес версии 4 контролируемого ресурса',
      name: 'value',
      validationRules: 'required|ip',
    },
  ]
}

export const getRelatedObservablesIPv6Fields = () => {
  return [
    {
      type: 'text',
      label: 'IP адрес версии 6 контролируемого ресурса',
      name: 'value',
      validationRules: 'required|ipv6',
    },
  ]
}

export const getRelatedObservablesDomainFields = () => {
  return [
    {
      type: 'text',
      label: 'Доменное имя контролируемого ресурса',
      name: 'value',
      validationRules: 'required|url',
    },
  ]
}

export const getRelatedObservablesURIFields = () => {
  return [
    {
      type: 'text',
      label: 'URI-адрес контролируемого ресурса',
      name: 'value',
      validationRules: 'required|url',
    },
  ]
}

export const getRelatedObservablesEmailFields = () => {
  return [
    {
      type: 'text',
      label: 'Email-адрес контролируемого ресурса',
      name: 'value',
      validationRules: 'required|email',
    },
  ]
}

export const getRelatedIndicatorsIPv4Fields = () => {
  return [
    {
      type: 'select',
      label: 'Тип активности',
      name: 'function',
      required: true,
      items: getActivityTypeItems(),
    },
    {
      type: 'text',
      label: 'IP адрес версии 4 источника вредоносной активности',
      name: 'value',
      validationRules: 'required|ip',
    },
  ]
}

export const getRelatedIndicatorsIPv6Fields = () => {
  return [
    {
      type: 'select',
      label: 'Тип активности',
      name: 'function',
      required: true,
      items: getActivityTypeItems(),
    },
    {
      type: 'text',
      label: 'IP адрес версии 6 источника вредоносной активности',
      name: 'value',
      validationRules: 'required|ipv6',
    },
  ]
}

export const getRelatedIndicatorsDomainFields = () => {
  return [
    {
      type: 'select',
      label: 'Тип активности',
      name: 'function',
      required: true,
      items: getActivityTypeItems(),
    },
    {
      type: 'text',
      label: 'Доменное имя вредоносной системы',
      name: 'value',
      validationRules: 'required|url',
    },
  ]
}

export const getRelatedIndicatorsURIFields = () => {
  return [
    {
      type: 'select',
      label: 'Тип активности',
      name: 'function',
      required: true,
      items: getActivityTypeItems(),
    },
    {
      type: 'text',
      label: 'URI-адрес вредоносной системы',
      name: 'value',
      validationRules: 'required|url',
    },
  ]
}

export const getRelatedIndicatorsEmailFields = () => {
  return [
    {
      type: 'text',
      label: 'Email-адрес вредоносного объекта',
      name: 'value',
      validationRules: 'required|email',
    },
  ]
}

export const getMalwareHashFields = () => {
  return [
    {
      type: 'text',
      label: 'Хеш-сумма вредоносного модуля',
      name: 'value',
      validationRules: 'required',
    },
  ]
}

export const getRelatedIndicatorsVulnFields = () => {
  return [
    {
      type: 'text',
      label: 'Описание используемых уязвимостей',
      name: 'value',
      validationRules: 'required',
    },
  ]
}

export const getProductInfoFields = () => {
  return [
    {
      type: 'text',
      label: 'Наименование уязвимого продукта',
      name: 'name',
      validationRules: 'required',
    },
    {
      type: 'text',
      label: 'Версия уязвимого продукта',
      name: 'version',
      validationRules: 'required',
    },
  ]
}
