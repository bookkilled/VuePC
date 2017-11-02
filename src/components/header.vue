<template>
    <header class="brand-title">
        <span class="brand-title-back" @click="goback"></span>
        {{ title }}
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
// @import '../styles/components/header.less';
</style>

