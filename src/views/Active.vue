<template>
  <div>
    <m-header v-if="showhead"></m-header>
    <div v-bind:class="{pt44: showhead}">
      <loading v-if="loading"></loading>
      <div class="errmsg" v-else-if="errstate">{{ errmsg }}</div>
      <div class="grid-box ma-tb10" v-else>
          <div class="grid-box-row" v-for="(item, index) in lists" :key="index">
              <div class="col-both">产品名称：</div>
              <div class="col-both mid">
                  {{ item.productName }}
              </div>
              <div class="col-both">
                {{ `${item.incomeRate}%` }} ({{ item.timeLimit | formartDay('天') }})
              </div>
          </div>
          <p @click="tologin">跳转到登录页</p>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../routes'
import MHeader from '../components/header.vue'
import loading from '../components/loading/ldloading.vue'
import * as api from '../api'
import { getUrlParam, setTit } from '../utils/leadbase'

export default {
  name: 'app',
  components: {
      MHeader,
      loading
  },
  data () {
    return {
      showhead: true, // 是否需要现实头部
      msg: 'Welcome to Hello',
      loading: true, // loading 插件
      errstate: false, // 接口状态
      errmsg: '', // 接口异常展示信息
      lists: {}
    }
  },
  filters: {
    formartDay: function (value, type) {
      return value + type;
    }
  },
  methods: {
    tologin: function () {
      router.push({ name: 'Login', query: { name: 'svenzhou', age: 28 }})
    }
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
      let vm = this
      setTimeout(function(){
        api.getPAList().then(function (res) {
            vm.lists = res.responseData && res.responseData.dataList
        },function (err) {
            vm.errstate = true
            vm.errmsg = '接口请求异常！'
        }).always(function(){
            vm.loading = false
        });
      }, 500)
  },
  beforeUpdate:function(){
      
  },//组件更新前
  updated:function(){},//组件更新比如修改了文案
  beforeDestroy:function(){},//组件销毁之前 你确认删除XX吗？ destoryed ：当前组件已被删除，清空相关内容
  destroyed:function(){},//组件已经销毁
  beforeRouteEnter (to, from, next) {
    localStorage.setItem('proLink', from.path)
    next()
  },
  beforeRouteLeave (to, from, next) {
    localStorage.getItem('proLink') == to.path && (this.$router.isBack = true)
    next()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
