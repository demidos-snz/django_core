export const getters = {
  websocketOpened: (state) => {
    return state.socketStatus === 'opened'
  },

  websocketClosed: (state) => {
    return state.socketStatus === 'closed'
  },

  websocketReconnect: (state) => {
    return state.socketStatus === 'reconnection'
  },
}
