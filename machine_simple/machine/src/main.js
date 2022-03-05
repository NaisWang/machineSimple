import Vue from 'vue'
import ElementUI from 'element-ui'
import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css';// 引入样式
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import app from './App.vue'
import router from './utils/router.js'

Vue.use(ElementUI, {size: 'mini'})
Vue.use(VueRouter)
Vue.use(UmyUi);

var vm = new Vue({
  el: "#app",
  render: c => c(app),
  router
})
