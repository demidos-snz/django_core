import PermissionHandler from '@/store/modules/permissions/permission_handler'

export const getters = {
  p9s: (state) => {
    return new PermissionHandler(state.roleModel)
  },
}
