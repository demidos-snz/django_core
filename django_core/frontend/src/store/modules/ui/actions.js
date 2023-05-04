import i18n from '@/translation/index'
import vuetify from '@/plugins/vuetify'

export const actions = {
  setDataLoaded({ commit }) {
    commit('SET_DATA_LOADED')
  },

  setReleaseVersion({ commit }, releaseVersion) {
    commit('SET_RELEASE_VERSION', releaseVersion)
  },

  changeLocale() {
    const lang = localStorage.lang === 'ru' ? 'en' : 'ru'
    localStorage.lang = lang
    i18n.locale = lang
    vuetify.framework.lang.current = lang
  },
}
