<template>
    <header class="header-wrapper">
        <div class="header container">
          <div class="header-logo" style="opacity: 1;">
            <a href="/"><img height="24" src="../assets/images/logo.svg"><img height="14" src="../assets/images/sitename.svg"></a>
          </div>
          <nav class="web-nav">
            <ul>
              <li><router-link class="active" to="/home">首页</router-link></li>
              <li><router-link class="" to="/module">模板展示</router-link></li>
              <li><router-link class="" to="/resource">素材中心</router-link></li>
              <li><router-link class="" to="/team">团队介绍</router-link></li>
              <li><router-link class="" to="/connect">联系我们</router-link></li>
              </ul>
          </nav>
        </div>
    </header>
</template>

<script>
import { IS_WX, setTit } from '../utils/leadbase'

export default {
  name: 'm-header',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      title: this.ctitle || this.$route.meta.title
    }
  },
  props: ['ctitle'],
  beforeCreate: function () {
    console.log(IS_WX)
    // IS_WX && (this.isrender = false)
  },
  mouted: function () {
    // IS_WX && (this.isrender = false)
  },
  methods: {
    goback: function () {
      // routes/index 定义同意返回方法
      this.$router.goBack();
    }
  }
}
</script>

<style lang="less" scoped>
</style>

