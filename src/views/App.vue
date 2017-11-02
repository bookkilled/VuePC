<template>
  <div id="app">
    <!--<m-header v-if="showhead"></m-header>-->
    <transition :name="tsclass">
     <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
import { IS_WX, setTit } from '../utils/leadbase'

export default {
  name: 'app',
  data() {
    return {
      showhead: true,
      tsclass: 'slide-left',
      productName: '产品名称'
    }
  },
  // components: {
  //     MHeader
  // },
  // 监听路由
  watch: {
    '$route' (to, from) {
      IS_WX && setTit(this.$route.meta.title || '处理中')
      let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
　　　 if(isBack) {
　　　　　this.tsclass = 'slide-right'
　　　 } else {
　　　　　this.tsclass = 'slide-left'
　　　　}
　　    this.$router.isBack = false
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  min-height: 100%;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}
.child-view {
  position: absolute;
  width: 100%;
  min-height: 100%;
  transition: all .3s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  height: 100%;
  opacity: 0;
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}
.slide-left-leave-active, .slide-right-enter {
  height: 100%;
  opacity: 0;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}
</style>
