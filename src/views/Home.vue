<template>
  <div>
    <m-header v-if="showhead"></m-header>
    <div class="wrap">
      <div class="container banner">
        <div class="row">
          <div class="col-sm-12">
            <div class="home-banner">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="area wow fadeInLeft" data-wow-delay=".5s">
                      <h1>You are the best special one for me</h1>
                      <p class="hdetail">now, you can use it!</p>
                      <router-link class="hbtn" to="/api">Get it ！</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="container">
        <div class="row">
            <div class="col-md-8 home-content">
              <div class="home-article">
                <p class="tit">测试</p>
              </div>
            </div>
            <div class="col-md-4 sidebar">
              <div class="widget"><h4 class="title">社区</h4><div class="content community"><p>QQ群：462694081</p><p><a href="http://wenda.golaravel.com/" title="Laravel中文网问答社区" target="_blank"><i class="fa fa-comments"></i> 问答社区</a></p></div></div>
            </div>
        </div>
      </div> -->
      <!-- <p class="nav">Page: home</p>
      <ul class="linklist">
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
      </ul> -->
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
import { WOW } from 'wowjs'

export default {
  name: 'app',
  components: {
      MHeader,
      Toast,
      Child
  },
  data () {
    return {
      showhead: true, // 是否需要现实头部
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
    // api.getdemo({
    //   phone: '13122557296',
    //   verifyPicNo: '23413',
    //   picCode: (new Date()).getTime(),
    //   busiType: '01'
    // }).then(function (res) {
    //     console.log(res);
    // },function (err) {
    //     console.log(err);
    // }).always(function(){
        
    // });;
    // api.getJson().then(function (res) {
        
    // },function (err) {
        
    // }).always(function(){
        
    // });
  },
  beforeRouteEnter (to, from, next) {
      console.log('APP载入页面：', to.path, from.path)
      localStorage.setItem('proLink', from.path)
      next()
  },
  beforeRouteLeave (to, from, next) {
      console.log('APP离开页面：',to.path, from.path)
      next()
  },
  mounted: function () {
    var wow = new WOW(
      {
        boxClass:     'wow',      // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset:       0,          // distance to the element when triggering the animation (default is 0)
        mobile:       true,       // trigger animations on mobile devices (default is true)
        live:         false,       // act on asynchronously loaded content (default is true)
        callback:     function(box) {
          // the callback is fired every time an animation is started
          // the argument that is passed in is the DOM node being animated
        },
        scrollContainer: null // optional scroll container selector, otherwise use window
      }
    );
    wow.init();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
