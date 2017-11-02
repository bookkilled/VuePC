<template>
  <div class="qa">
    <m-header v-if="showhead"></m-header>
    <div :class="[{pt44: showhead}, 'floor']">
      <div class="tit">《战狼2》</div>
      <div class="detail">测一测，我与战狼明星的合体值？</div>
      <div class="star">
        <span class="star01"></span>
        <span class="star02"></span>
         <span class="star03"></span> 
      </div>
      <div class="list" v-cloak>
        <router-link v-for="item in list" :key="item.id" class="box" :to="{path:'/q/'+encodeURIComponent(item.name)}">
          <!-- <p class="title">{{item.name}}</p> -->
          <p class="img"><img :src="item.img" width="100%" /></p>
        </router-link>
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
      list: [
        {
          id: 0,
          name: '吴京',
          tit: '犯我中华者虽远必诛',
          img: 'https://gss0.bdstatic.com/94o3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C483%2C483%3Bh%3D240%3Bq%3D95/sign=6ad0f27c06f431ada89d19797606809f/1f178a82b9014a902e645153a3773912b21bee82.jpg'
        },{
          id: 1,
          name: '吴刚',
          tit: '犯我中华者虽远必诛',
          img: 'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C299%2C299%3Bh%3D240%3Bq%3D95/sign=1a04446ee8f81a4c327db689ea1a4c69/80cb39dbb6fd5266c621ca0ea818972bd40736a5.jpg'
        },{
          id: 2,
          name: '卢靖姗',
          tit: '犯我中华者虽远必诛',
          img: 'https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C800%2C800%3Bh%3D240%3Bq%3D95/sign=7fd4ccebee1190ef15b4c89ff32bb126/a8ec8a13632762d00de2b8b9a9ec08fa503dc6dc.jpg'
        },{
          id: 3,
          name: '弗兰克·格里罗',
          tit: '犯我中华者虽远必诛',
          img: 'https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C463%2C463%3Bh%3D240%3Bq%3D95/sign=4ee09414fa1fbe090811995456502003/50da81cb39dbb6fd674d4e440124ab18972b37b9.jpg'
        },{
          id: 4,
          name: '张翰',
          tit: '犯我中华者虽远必诛',
          img: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C3800%2C3800%3Bh%3D240%3Bq%3D95/sign=b0ccd63bff03918fc39e678a6c0d0aa7/a6efce1b9d16fdfa7cba4735bc8f8c5495ee7b13.jpg'
        },{
          id: 5,
          name: '丁海峰',
          tit: '犯我中华者虽远必诛',
          img: 'https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C398%2C398%3Bh%3D240%3Bq%3D95/sign=27918149572c11dfca9ee5635e174ee0/960a304e251f95ca9480d41cc9177f3e67095226.jpg'
        },{
          id: 6,
          name: '龙小云',
          tit: '犯我中华者虽远必诛',
          img: 'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C500%2C500%3Bh%3D240%3Bq%3D95/sign=80562eec622762d09471feff9ddc24ca/c2fdfc039245d688fd85236ba5c27d1ed31b247d.jpg'
        },{
          id: 7,
          name: '石青松',
          tit: '犯我中华者虽远必诛',
          img: 'https://gss0.bdstatic.com/-4o3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C293%2C293%3Bh%3D240%3Bq%3D95/sign=fcf3ce1148086e067ee7650b3f3857c4/18d8bc3eb13533fac6e1c10eacd3fd1f41345bbe.jpg'
        },{
          id: 8,
          name: '于谦',
          tit: '犯我中华者虽远必诛',
          img: 'https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D0%2C0%2C500%2C500%3Bh%3D240%3Bq%3D95/sign=fc5d50f373899e516cc160547f97f503/9a504fc2d56285352c7a512f98ef76c6a7ef6322.jpg'
        }
      ]
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
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
.btn {

}
[v-cloak] {
    display: none;
}
.list {
  position: absolute;
  padding: 20px 5%;
  z-index: 6;
  margin-top: 20px;
  animation: fadeInUp 2s -1s;
  .box {
    display: inline-block;
    box-sizing: border-box;
    width: 30%;
    height: 100px;
    margin-right: 5%;
    margin-bottom: 5%;
    color: #5A5A5A;
    text-align: center;
    // background: #fff;
    overflow: hidden;
    opacity: .8;
    &:nth-child(3n+0) {
      margin-right: 0;
    }
    .title {
      padding: 10px 0;
    }
    .img {
      // height: 96%;
      // width: 96%;
      // padding: 4px;
      overflow: hidden;
    }
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
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

