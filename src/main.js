// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.\
import Vue from 'vue'
import App from './App'
import router from './router'
import 'weui'
import '../static/font/iconfont.css'
import { RadioGroup, Radio, Icon } from 'vant'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'es6-promise/auto'
import Vuex from 'vuex'
import 'vant/lib/vant-css/icon-local.css'
Vue.use(Icon)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
/* eslint-disable no-new */

const store = new Vuex.Store({
  state: {
    district: '',
    apartment_id: '',
    room_name: '',
    room: '',
    building: '',
    dormitory_name: '',
    isAttention: false,
    buttonText: '新关注'

  },
  mutations: {
    changeDistrict (state, newValue) {
      state.district = newValue
    },
    updateRoom (state, newValue) {
      state.room = newValue
    },
    changeId (state, newValue) {
      state.apartment_id = newValue
    },
    changeBuilding (state, newValue) {
      state.building = newValue
    },
    change_dormitory_name (state, newValue) {
      state.dormitory_name = newValue
    },
    changeAttentionState (state, newValue) {
      state.isAttention = newValue
    },
    changeButtonText (state, newValue) {
      state.buttonText = newValue
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.fullPath === '/AttentionDormitory/HadAttention') {
    store.commit('changeAttentionState', true)
    store.commit('changeButtonText', '已关注')
  }
  if (to.fullPath === '/AttentionDormitory') {
    store.commit('changeAttentionState', false)
    store.commit('changeButtonText', '新关注')
  }
  next()
})

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
