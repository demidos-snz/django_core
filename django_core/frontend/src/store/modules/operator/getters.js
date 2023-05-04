import { getUserRoles } from '@/constants/constants'
import User, { AnonymousUser } from '@/store/models/user'
import NotificationsManager from '@/store/models/notification_manager'

export const getters = {
  role(state) {
    return state.user && getUserRoles()[state.user.role]
  },

  operator(state) {
    return (state.user && new User(state.user)) || new AnonymousUser()
  },

  emailAllowed(state) {
    return Boolean(state.settings.emailAllowed)
  },

  smsAllowed(state) {
    return Boolean(state.settings.smsAllowed)
  },

  telegramAllowed(state) {
    return Boolean(state.settings.telegramAllowed)
  },

  notificationManager(state) {
    return new NotificationsManager(state.settings.notifications || [])
  },
}
