import Vue from 'vue'

export const mutations = {
  STORE_ROLE_MODEL(state, model) {
    Vue.set(state, 'roleModel', model)
  },

  RESET(state) {
    Vue.set(state, 'roleModel', [])
  },
}
