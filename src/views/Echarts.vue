<template>
  <div>
    <m-header v-if="showhead"></m-header>
    <div v-bind:class="{pt44: showhead}">
      <!--<loading v-if="loading"></loading>-->
      <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
      <ul class="linklist">
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <li><router-link to="/login">Go to login</router-link></li>
        <li><router-link :to="{path:'/login',query: {name:'bookkilled'}}">Go to home</router-link></li>
        <li><span @click="tologin">去登录页</span></li>
        <li><span @click="toactive">列表接口</span></li>
        <li><span @click="toecharts" id="dabao">去图表页面</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import router from '../routes'
import MHeader from '../components/header.vue'
import * as api from '../api'
import { IS_WX, ToDX, dateWeek, setNewDate } from '../utils/leadbase'
// 引入基本模板
import echarts from 'echarts/lib/echarts'
// 引入柱状图组件
import 'echarts/lib/chart/bar'
// 引入提示框和title组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'hello',
  data() {
    return {
      showhead: true,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  props:['productName'],
  components: {
    MHeader
  },
  beforeCreated: function () {
    
  },
  mounted() {
    if (IS_WX) {
      this.showhead = false
    }
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: 'ECharts 入门示例' },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
    },
    tologin: function () {
      router.push({ path: '/login', query: { name: 'svenzhou', age: 28 }})
    },
    toactive: function () {
      router.push({ path: '/active', query: { pageNo: 'A001' }})
    },
    toecharts: function () {
      router.push({ path: '/echarts', query: { pageNo: 'A002' } })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#dabao {
  color: red;
}
</style>
