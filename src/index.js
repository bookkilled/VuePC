import 'styles/index.less'
import Vue from 'vue'
import App from './views/App'
import MHeader from './components/header.vue'
import MFooter from './components/footer.vue'
import router from './routes'

// 2.2.0新增 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { 
    MHeader,
    App,
    MFooter
  }
})

