import initialState from './state'

export default {
  RESET_STORE: (state) => {
    Object.assign(state, initialState())
  },

  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
      token: authUser.token
    }
  },

  SET_TOKEN: (state, { idToken }) => {
    // console.log('SET_TOKEN ', idToken)
    state.token = idToken
  }

}
