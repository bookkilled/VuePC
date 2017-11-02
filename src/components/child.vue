<template>
  <div class="child">
    <span class="btn" @click="showtoast('子调父')">显示Toast(子调父)</span>
    <span @click="todo">循环点击</span>
    <p>{{inputValue}}</p>
  </div>
</template>

<script>
export default {
  name: 'mtoast',
  data: function () {
    return {
      // autoclosed: true
    }
  },
  props: {
    inputValue: String
  },
  methods: {
    showtoast: function (tips) {
      this.$emit('showtoast', tips)
    },
    todo: function () {
      alert('todo')
    }
  },
  mounted: function () {
    
  }
}
</script>
<style lang="less" scoped>
// @import '../styles/components/child.less';
.btn {
  // background: url('~images/ldloading.gif') no-repeat;
}
</style>