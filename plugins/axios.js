export default function ({ $axios, $fire, app, req, store }) {
  // console.log($fire.auth.currentUser)
  // console.warn('axios ', store.state.token)
  $axios.onRequest((config) => {
    config.headers.common.Authorization = 'Bearer ' + store.state.token
    config.headers.common['Referrer-Policy'] = 'no-referrer'
    config.headers.common['Access-Control-Allow-Origin'] = '*'
    config.headers.common['Content-Type'] = 'application/json'
  })
}
