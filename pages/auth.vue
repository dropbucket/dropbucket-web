<template>
  <div>
    <div id="firebaseui-auth-container" />
  </div>
</template>

<script>
// import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  mounted () {
    if (process.browser) {
      const firebaseui = require('firebaseui')
      const uiConfig = {
        signInSuccessUrl: '/vendor',
        signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
          new this.$fireModule.auth.GoogleAuthProvider().providerId,
          // this.$fireModule.auth.GoogleAuthProvider().PROVIDER_ID
          new this.$fireModule.auth.FacebookAuthProvider().providerId,
          new this.$fireModule.auth.TwitterAuthProvider().providerId,
          new this.$fireModule.auth.GithubAuthProvider().providerId,
          new this.$fireModule.auth.EmailAuthProvider().providerId,
          new this.$fireModule.auth.PhoneAuthProvider().providerId
        ]
      }
      const ui = new firebaseui.auth.AuthUI(this.$fire.auth)
      ui.start('#firebaseui-auth-container', uiConfig)
    }
  },
  created () {
  }
}
</script>
