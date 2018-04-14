// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// VueGeolocation
import VueGeolocation from 'vue-browser-geolocation'

Vue.config.productionTip = false
Vue.use(VueGeolocation)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
