<template>
<div>
  <m-header v-if="showhead"></m-header>
  <div v-bind:class="{pt44: showhead}">
    <loading v-if="loading"></loading>
    <div class="errmsg" v-else-if="errstate">{{ errmsg }}</div>
    <div class="grid-box ma-tb10" v-else>
        <div class="grid-box-row">
            <div class="col-both">手机号</div>
            <div class="col-both mid">
                <input type="text" class="inp" pattern="[0-9]*" placeholder="请输入手机号" id="mobile" maxlength="11" v-model="mobile">
            </div>
            <div class="col-both"></div>
        </div>
        <div class="grid-box-row">
            <div class="col-both">验证码</div>
            <div class="col-both mid">
                <input type="text" class="inp" placeholder="请输入验证码" id="imgcode" maxlength="5" v-model="imgcode">
            </div>
            <div class="col-both">
                <span><img src="http://m.leadfund.com.cn/front-gateway-web//imgCodeAction.action?_sag_time=1498704673675"></span>
            </div>
        </div>
        <div class="grid-box-row">
            <div class="col-both">动态码</div>
            <div class="col-both mid">
                <input type="text" class="inp" placeholder="请输入动态码" id="smscode" maxlength="6" v-model="smscode">
            </div>
            <div class="col-both">
                <span class="smsbtn" id="smsbtn" @click="sendsms" ref="sendsms">获取验证码</span>
            </div>
        </div>
        <div class="grid-box-row">
            <div class="col-both">URL获取</div>
            <div class="col-both mid">
                {{ msg }}
            </div>
            <div class="col-both">
            </div>
        </div>
        <div class="grid-box-row">
            <div class="col-both">手机号</div>
            <div class="col-both mid">
                {{ mobile }}
            </div>
            <div class="col-both">
            </div>
        </div>
        <div class="grid-box-row">
            <div class="col-both">图形验证码</div>
            <div class="col-both mid">
                {{ imgcode }}
            </div>
            <div class="col-both">
            </div>
        </div>
        <div class="grid-box-row">
            <div class="col-both">短信验证码</div>
            <div class="col-both mid">
                {{ smscode }}
            </div>
            <div class="col-both">
            </div>
        </div>
        <div class="btn-box ma-tb10">
           <span class="subtn" @click="login">提交</span>
           <p @click="toactive">跳转到列表页</p>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import router from '../routes'
import MHeader from '../components/header.vue'
import loading from '../components/loading/ldloading.vue'
import * as api from '../api'
import { getUrlParam } from '../utils/leadbase'

export default {
  name: 'app',
  components: {
      MHeader,
      loading
  },
  data () {
    return {
        showhead: true, // 是否需要现实头部
        msg: this.$route.query.name,
        mobile: '', // 手机号
        imgcode: '', // 图形验证码
        smscode: '', // 短信验证码
        loading: true, // loading 插件
        errstate: false, // 接口状态
        errmsg: '', // 接口异常展示信息
        cstate: true // 是否可发送短信验证码
    }
  },
  methods: {
      login: function (prams) {
          let vm = this
            api.isLogin().then(function (res) {
                console.log(res)
            },function (err) {
                console.log('err')
            });
      },
      sendsms: function (e) {
        // 防重点击
        let vm = this
        function sendapi() {
            setTimeout(function(){
                console.log('接口请求结束！')
                vm.cstate = true
            }, 3e3)
        }
        if (vm.cstate) {
            vm.cstate = false
            sendapi()
        } 
      },
      getCode: function () {
          console.log('getcode')
      },
      toactive: function () {
        router.push({ name: 'Active', query: { name: 'svenzhou', age: 28 }})
      }
  },
    beforeRouteEnter (to, from, next) {
        console.log('APP离开页面：',to.path, from.path)
        console.log('进入Login')
        next()
    },
    beforeRouteLeave (to, from, next) {
        // console.log(to.path, from.path)
        console.log('离开Login')
        next()
    },
    beforeCreate:function(){
        console.log('login 组件实例化之前')
    },//组件实例化之前: 举个栗子：可以在这加个loading事件 
    created:function(){
        // this.loading = false
    },//组件实例化了:  在这结束loading，还做一些初始化，实现函数自执行 
    beforeMount:function(){
        
    },//组件写入dom结构之前
    mounted:function(){//组件写入dom结构了:  在这发起后端请求，拿回数据，配合路由钩子做一些事情
        // console.log(this.$children);
        // console.log(api.RSAmergeDate({}));
        let vm = this
        api.isLogin().then(function (res) {
            console.log(res)
        },function (err) {
            vm.errstate = true
            vm.errmsg = '接口请求异常！'
        }).always(function(){
            vm.loading = false
        });
    },
    beforeUpdate:function(){
        
    },//组件更新前
    updated:function(){},//组件更新比如修改了文案
    beforeDestroy:function(){},//组件销毁之前 你确认删除XX吗？ destoryed ：当前组件已被删除，清空相关内容
    destroyed:function(){}//组件已经销毁
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .bookkilled {
        border:10px;
    }
</style>
