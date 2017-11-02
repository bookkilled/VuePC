<template>
<div class="pop">
    <div class="loading timer"></div>
</div>
</template>
<script>
export default {
  data() {
    return {
      text: ''
    }
  },
  mounted: function () {
  }
}
</script>
<style lang="less" scoped>
.pop {
  position: relative;
  height: 300px;
  width: 100%;
  background: rgba(0, 0, 0, .8);
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 2px solid #999;
    background: transparent;
    &.timer {
      margin-top: -40px;
      margin-left: -40px;
      box-sizing:border-box;
      width: 80px;
      height: 80px;
      border: 2px solid #999;
      border-radius: 40px;    
      z-index: 997;
      &:before {
        position: absolute;
        content: '';
        top: 20px;
        left: 39px;
        width: 2px;
        height: 20px;
        border-radius: 1px;
        background: #999;
        transform-origin: 1px 20px;
        -webkit-animation: round-cover 15s infinite  linear;
        animation: round-cover 15s infinite  linear;
      }
      &:after {
        top: 10px;
        left: 39px;
        position: absolute;
        content: '';
        width: 2px;
        height: 30px;
        border-radius: 1px;
        background: #ff7070;
        transform-origin: 1px 30px;
        -webkit-animation: round-cover 1.25s infinite  linear;
        animation: round-cover 1.25s infinite  linear;
      }  
    }
  }
}
@-webkit-keyframes square-load {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  50% {
    border-color: #a01e23;
  }
  100% {
    -webkit-transform: rotate(7200deg);
    transform: rotate(720deg);
  }
}
@keyframes square-load {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  50% {
    border-color: #a01e23;
  }
  100% {
    -webkit-transform: rotate(720deg);
    transform: rotate(720deg);
  }
}

</style>
