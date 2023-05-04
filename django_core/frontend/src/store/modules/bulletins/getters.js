import Bulletin from '@/store/models/bulletin'

export const getters = {
  bulletins: (state) => {
    return state.bulletins.map((bulletin) => new Bulletin(bulletin))
  },
}
