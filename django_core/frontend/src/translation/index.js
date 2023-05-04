import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Messages from './messages.js'
import vuetify from '@/plugins/vuetify'

Vue.use(VueI18n)

const lang = localStorage.lang || 'ru'

const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: lang,
  messages: Messages,
  pluralizationRules: {
    ru: function (choice, choicesLength) {
      if (choice === 0) {
        return 0
      }

      const teen = choice > 10 && choice < 20
      const endsWithOne = choice % 10 === 1

      if (choicesLength < 4) {
        return !teen && endsWithOne ? 1 : 2
      }
      if (!teen && endsWithOne) {
        return 1
      }
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2
      }

      return choicesLength < 4 ? 2 : 3
    },
  },
})

vuetify.framework.lang.current = lang

export default i18n
