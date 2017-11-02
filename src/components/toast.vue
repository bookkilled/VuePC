<template>
  <div class="mtoast">
    <div class="mtoast-text">{{ message }}</div>
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
  props: ['message'],
  mounted: function () {
    let vm = this
    setTimeout(function() {
      vm.$emit('hidetoast')
    }, 2e3);
  }
}
</script>
<style lang="less" scoped>
// @import '../styles/components/toast.less';
</style>