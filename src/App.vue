<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import money from 'v-money'
Vue.use(money)
    // console.log(Vue.version);

// walter
import Vuex from "vuex"
import { AppFullscreen } from 'quasar'
import browserDetect from "vue-browser-detect-plugin"
import VueNestable from 'vue-nestable'
import store from 'src/store'
import { AUTH_CONFIG } from 'src/config/config';

Vue.use(browserDetect)
Vue.use(VueNestable)

Number.prototype.toFormat = function(decimales, simbolo) {
    let toReturn = this
    let decimals = decimales || 0
    let symbol = simbolo || ''
    if (typeof toReturn == "number") {
        let x = 3
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (decimals > 0 ? '\\.' : '$') + ')'
        toReturn = symbol + toReturn.toFixed(Math.max(0, ~~decimals)).replace(new RegExp(re, 'g'), '$&,')
    }
    return toReturn
}

import * as VueGoogleMaps from 'vue2-google-maps'
 
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAE1Df_IuMYWkjoQ1qpeSuG9ld6rPF2jJA"
  },
  })
export default {
  name: 'App'
}
</script>