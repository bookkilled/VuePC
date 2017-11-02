<template>
  <div>
    <m-header v-if="showhead"></m-header>
    <div v-bind:class="{pt44: showhead}">
      <loading v-if="loading"></loading>
      <xzqloading v-if="loading"></xzqloading>
      <timeloading v-if="loading"></timeloading>
      <linepointloading v-if="loading"></linepointloading>
      <roundpointloading v-if="loading"></roundpointloading>
      <allpointloading v-if="loading"></allpointloading>
    </div>
  </div>
</template>

<script>
import router from '../routes'
import MHeader from '../components/header.vue'
import loading from '../components/loading/gdloading.vue'
import xzqloading from '../components/loading/xzqloading.vue'
import timeloading from '../components/loading/timeloading.vue'
import linepointloading from '../components/loading/linepointloading.vue'
import roundpointloading from '../components/loading/roundpointloading.vue'
import allpointloading from '../components/loading/allpointloading.vue'

export default {
  name: 'app',
  components: {
      MHeader,
      loading,
      xzqloading,
      timeloading,
      linepointloading,
      roundpointloading,
      allpointloading
  },
  data () {
    return {
      showhead: true, // 是否需要现实头部
      msg: 'Welcome to Hello',
      loading: true // loading 插件
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

</style>

