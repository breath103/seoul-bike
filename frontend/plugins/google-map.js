// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDxUvZQoTTd5y3DKe3HOTiS2O8S2zdM4Ww',
    libraries: 'places,drawing,visualization',
  }
});
