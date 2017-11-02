<template>
  <div class="qa">
    <m-header v-if="!showhead" :ctitle="tittle"></m-header>
    <div :class="[{pt44: showhead}, 'floor']">
      <div class="star">
        <span class="star01"></span>
        <span class="star02"></span>
         <span class="star03"></span> 
      </div>
      
      <!-- <div class="sun" @click="start">GO!</div> -->
      <p class="copyright">测评信息遵守保密协议</p>
    </div>
  </div>
</template>

<script>
import router from '../routes'
import MHeader from '../components/header.vue'

export default {
  name: 'app',
  components: {
      MHeader
  },
  data () {
    return {
      showhead: false, // 是否需要现实头部
      msg: 'Welcome to Hello',
      tittle: `开始与【${decodeURIComponent(this.$route.params.id)}】合体`
    }
  },
  methods: {
    tologin: function () {
      router.push({ name: 'Login', query: { name: 'svenzhou', age: 28 }})
    },
    start: function () {
      console.log('GO!你TM倒是GO啊！');
    }
  },
  beforeCreate:function(){
      console.log('login 组件实例化之前')
      
      console.log(this.$route.params.id)
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
.qa {
  height: 100%;
  background: #323232;
}
.floor {
  z-index: 3;
}
.star {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  span {
    display: block;  
    width: 4px;  
    height: 4px;  
    border-radius: 50%;//小圆点  
    background: #FFF;
    position: absolute;
    box-shadow: 0 0 5px 5px rgba(255, 255, 255, .3);//光晕部分  
    -webkit-animation: star 3s infinite ease-out;
    animation: star 3s infinite ease-out; 
    &:after {
      content: '';
      display: block;
      top: 0px;
      left: 4px;
      border: 0px solid #fff;
      border-width: 0px 90px 2px 90px;
      border-color: transparent transparent transparent rgba(255, 255, 255, .4);
      transform: rotate(-45deg) translate3d(1px, 3px, 0);
      box-shadow: 0 0 1px 0 rgba(255, 255, 255, .1);
      transform-origin: 0% 100%;
      // animation: shooting-ani 3s infinite ease-out;  
    }
    &.star01 {
      top: -200px;  
      left: 600px;
      animation-delay: 1.8s;
    }
    &.star02 {
      top: -100px;  
      left: 600px;
      animation-delay: 0s;
    }
    &.star03 {
      top: 100px;  
      left: 600px;
      animation-delay: 1.2s; 
    }
  }
}
@-webkit-keyframes star {
  0% {
      opacity: 0;
      transform: scale(0) rotate(0) translate3d(0, 0, 0);
      -webkit-transform: scale(0) rotate(0) translate3d(0, 0, 0);
      -moz-transform: scale(0) rotate(0) translate3d(0, 0, 0);
  }
  70% {
    opacity: 1;
  }
  100% {
      opacity: 0;
      transform: scale(1) rotate(0) translate3d(-600px, 600px, 0);
      -webkit-transform: scale(1) rotate(0) translate3d(-600px, 600px, 0);
      -moz-transform: scale(1) rotate(0) translate3d(-600px, 600px, 0);
  }
}
@keyframes star {
   0% {
      opacity: 0;
      transform: scale(0) rotate(0) translate3d(0, 0, 0);
      -webkit-transform: scale(0) rotate(0) translate3d(0, 0, 0);
      -moz-transform: scale(0) rotate(0) translate3d(0, 0, 0);
  }
  70% {
    opacity: 1;
  }
  100% {
      opacity: 0;
      transform: scale(1) rotate(0) translate3d(-600px, 600px, 0);
      -webkit-transform: scale(1) rotate(0) translate3d(-600px, 600px, 0);
      -moz-transform: scale(1) rotate(0) translate3d(-600px, 600px, 0);
  }
}
.sun {
  height: 180px;
  width: 180px;
  border-radius: 50%;
  border: solid 4px #FFF;
  background: #5ed5d1;
  position: absolute;
  margin-left: -90px;
  margin-top: -90px;
  top: 50%;
  left: 50%;
  line-height: 180px;
  text-align: center;
  font-size: 28px;
  color: #FFF;
  -webkit-animation: sun 1.4s infinite linear;
  animation: sun 1.4s infinite linear;
}
@keyframes sun {
  0% {
    opacity: .8;
    -webkit-transform: scale3d(.9, .9, .9);
    transform: scale3d(.9, .9, .9);
    border: solid 4px #FFF;
  }
  50% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
    border: solid 4px rgba(255, 255, 255, .2);
  }
  100% {
    opacity: .8;
    -webkit-transform: scale3d(.9, .9, .9);
    transform: scale3d(.9, .9, .9);
    border: solid 4px #FFF;
  }
}
.tit {
    margin-top: 10%;
    font-size: 28px;
    color: #FFF;
    text-align: center;
    padding: 20px 0;
    animation: fadeInDownBig 2s -1s;
}
.detail {
    font-size: 16px;
    color: #FFF;
    text-align: center;
    padding: 10px 0;
    animation: fadeInLeftBig 2s;
}
@keyframes fadeInDownBig {
  from {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes fadeInLeftBig {
  from {
    opacity: 0;
    transform: translate3d(-2000px, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
.copyright {
  position: absolute;
  bottom: 6%;
  left: 0;
  right: 0;
  text-align: center;
  color: #9A9A9A;
  font-size: 14px;
  animation: fadeInUpBig 2s -1s;
}
@keyframes fadeInUpBig {
  from {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
</style>

