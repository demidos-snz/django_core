import { keyBy } from 'lodash'
import User from '@/store/models/user'

export const getters = {
  users: (state) => {
    const mappedUsers = state.users.map((item) => new User(item))
    return keyBy(mappedUsers, 'id')
  },

  selectedUser: (state, getters) => {
    if (!state.selectedUserId) return null
    return getters.users[state.selectedUserId]
  },
}
