<template>
  <div>
    <m-header v-if="showhead"></m-header>
    <div v-bind:class="{pt44: showhead}">
      <p class="nav">Page: home</p>
      <ul class="linklist">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <li><router-link to="/login">Go to login</router-link></li>
        <li><router-link :to="{path:'/login',query: {name:'bookkilled'}}">Go to home</router-link></li>
        <li><span @click="tologin">去登录页</span></li>
        <li><span @click="toactive">列表接口</span></li>
        <li><router-link to="/load">LoadingPage</router-link></li>
        <li><router-link to="/qa">Questionnaire</router-link></li>
        <li><span @click="toecharts">去图表页面</span></li>
        <li><span @click="showtoast('父传子')">显示Toast(父传子)</span></li>
        <li>
          <input type="text" v-model="msg" />
          <p v-for="item in list" :key="item.id">
          <child v-on:showtoast="showtoast"  :inputValue="msg"></child>
          </p>
        </li>
        <li><child></child></li>
      </ul>
    </div>
    <toast :message="tcontent" v-if="istoast" v-on:hidetoast="hidetoast"></toast>
  </div>
</template>

<script>
import router from '../routes'
import MHeader from '../components/header.vue'
import Toast from '../components/toast.vue'
import Child from '../components/child.vue'
import * as api from '../api'
import { IS_WX, ToDX, dateWeek, setNewDate } from '../utils/leadbase'

export default {
  name: 'app',
  components: {
      MHeader,
      Toast,
      Child
  },
  data () {
    return {
      showhead: false, // 是否需要现实头部
      msg: '请输入',
      istoast: false,
      tcontent: '测试',
      list: [1,2]
    }
  },
  methods: {
    tologin: function () {
      router.push({ path: '/login', query: { name: 'svenzhou', age: 28 }})
    },
    toactive: function () {
      router.push({ path: '/active', query: { pageNo: 'A001' }})
    },
    toecharts: function () {
      router.push({ path: '/echarts', query: { pageNo: 'A002' } })
    },
    showtoast: function (tips) {
      this.tcontent = tips
      this.istoast = true
      console.log(this.tcontent)
    },
    hidetoast: function () {
      console.log('Jinlaile')
      this.istoast = false
    }
  },
  beforeCreate: function () {
    console.log('是不是微信：', IS_WX, ToDX('8007630.27'), dateWeek('2017-07-11'), setNewDate('2017-08-31'))
    api.getdemo({
      phone: '13122557296',
      verifyPicNo: '23413',
      picCode: (new Date()).getTime(),
      busiType: '01'
    }).then(function (res) {
        console.log(res);
    },function (err) {
        console.log(err);
    }).always(function(){
        
    });;
    api.getJson().then(function (res) {
        
    },function (err) {
        
    }).always(function(){
        
    });
  },
  beforeRouteEnter (to, from, next) {
      console.log('APP载入页面：', to.path, from.path)
      localStorage.setItem('proLink', from.path)
      next()
  },
  beforeRouteLeave (to, from, next) {
      console.log('APP离开页面：',to.path, from.path)
      next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
