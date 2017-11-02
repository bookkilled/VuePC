import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

// 懒加载组件
const Login = resolve => require(['../views/Login.vue'], resolve)
const Active = resolve => require(['../views/Active.vue'], resolve)
const Echarts = resolve => require(['../views/Echarts.vue'], resolve)
const Load = resolve => require(['../views/Load.vue'], resolve)
const Questionnaire = resolve => require(['../views/Questionnaire.vue'], resolve)
const questions = resolve => require(['../views/questions.vue'], resolve)

// import Login from '../views/Login.vue'
// import Active from '../views/Active.vue'

// 返回统一操作
Router.prototype.goBack = function () { 
　　this.isBack = true;
　　window.history.go(-1);
}
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Home,
      meta: {
        title: '首页'
      },
      beforeEnter (to, from, next) {
        console.log('渲染Index')
        next()
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当钩子执行前，组件实例还没被创建
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录注册'
      },
      beforeEnter (to, from, next) {
        console.log('渲染Login')
        next()
      }
    },
    {
      path: '/active',
      name: 'Active',
      component: Active,
      meta: {
        title: '列表页'
      },
      beforeEnter (to, from, next) {
        console.log('渲染Active')
        next()
      }
    },{
      path: '/load',
      name: 'Load',
      component: Load,
      meta: {
        title: 'Load'
      },
      beforeEnter (to, from, next) {
        console.log('渲染Active')
        next()
      }
    },{
      path: '/qa',
      name: 'Questionnaire',
      component: Questionnaire,
      meta: {
        title: 'Questionnaire'
      },
      beforeEnter (to, from, next) {
        console.log('渲染Questionnaire')
        next()
      }
    },{
      path: '/q/:id',
      name: 'questions',
      component: questions,
      meta: {
        title: ''
      },
      beforeEnter (to, from, next) {
        console.log('questions')
        next()
      }
    },{
      path: '/echarts',
      name: 'Echarts',
      component: Echarts,
      meta: {
        title: 'Echarts展示'
      },
      beforeEnter (to, from, next) {
        console.log('Echarts')
        next()
      }
    }
  ]
})
