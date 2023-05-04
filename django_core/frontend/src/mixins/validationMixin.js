import { extend, ValidationObserver, ValidationProvider, setInteractionMode, validate } from 'vee-validate'
import {
  required,
  min_value,
  max_value,
  alpha,
  email,
  confirmed,
  min,
  max,
  required_if,
  digits,
} from 'vee-validate/dist/rules'
import i18n from '@/translation'

setInteractionMode('aggressive')

extend('required', {
  ...required,
  message: i18n.t('validation.field_required'),
})

extend('alpha', {
  ...alpha,
  message: i18n.t('validation.field_alpha'),
})

extend('required_if', {
  ...required_if,
  message: i18n.t('validation.field_required'),
})

extend('positive', {
  validate: (value) => {
    return value >= 0
  },
  message: i18n.t('validation.field_positive'),
})

extend('ip', {
  validate: (value) => {
    const rx = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/
    return rx.test(value)
  },
  message: i18n.t('validation.field_ip'),
})

extend('mac', {
  validate: (value) => {
    const rx = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i
    return rx.test(value)
  },
  message: i18n.t('validation.field_mac'),
})

extend('ipv6', {
  validate: (value) => {
    const rx =
      /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/gm
    return rx.test(value)
  },
  message: i18n.t('validation.field_ipv6'),
})

extend('email', {
  ...email,
  message: i18n.t('validation.field_email'),
})

extend('url', {
  validate: (value) => {
    const rx = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/gm
    return rx.test(value)
  },
  message: i18n.t('validation.field_url'),
})

extend('min_value', {
  ...min_value,
  message: i18n.t('validation.field_min_value'),
})

extend('max_value', {
  ...max_value,
  message: i18n.t('validation.field_max_value'),
})

extend('phone', {
  validate: (value) => {
    const rx = /^[+][2-9]\d{1}[0-9]\d{3}\d{5}$/
    return rx.test(value)
  },
  message: i18n.t('validation.field_phone'),
})

extend('confirmed', {
  ...confirmed,
  message: i18n.t('validation.field_password_confirmation'),
})

extend('min', min)

extend('max', max)

extend('characters_between', {
  async validate(value, { min, max }) {
    const res = await validate(value, `min:${min}|max:${max}`)
    return res.valid
  },
  params: ['min', 'max'],
  message: i18n.t('validation.field_characters_between'),
})

extend('at_least_one_lower', {
  validate: (value) => {
    const rx = /[a-z]/
    return rx.test(value)
  },
  message: i18n.t('validation.field_lower'),
})

extend('at_least_one_upper', {
  validate: (value) => {
    const rx = /[A-Z]/
    return rx.test(value)
  },
  message: i18n.t('validation.field_upper'),
})

extend('at_least_one_digit', {
  validate: (value) => {
    const rx = /[0-9]/
    return rx.test(value)
  },
  message: i18n.t('validation.field_at_least_one_digit'),
})

extend('at_least_one_special', {
  validate: (value) => {
    const rx = /[~/!?@#$%^&*()_+\-[\]{};':"\\|,.<>]/
    return rx.test(value)
  },
  message: i18n.t('validation.field_at_least_one_special'),
})

extend('password_incorrect_symbols', {
  /*
    Special rule for restricting any entered character
    except allowed for password inputs (for example, cyrrilic letters or other symbols)
  */
  validate: (value) => {
    const rx = /[^\w~/!?@#$%^&*()_+\-[\]{};':"\\|,.<>]/g
    return !rx.test(value)
  },
  message: i18n.t('validation.field_incorrect_symbols'),
})

extend('no_whitespace', {
  validate: (value) => {
    const rx = /^\S*$/
    return rx.test(value)
  },
  message: i18n.t('validation.field_no_whitespace'),
})

extend('not_equal', {
  params: ['target'],
  validate: (value, { target }) => {
    return value !== target
  },
  message: i18n.t('validation.field_equal_passwords'),
})

extend('digits', {
  ...digits,
  message: i18n.t('validation.digits'),
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
}
