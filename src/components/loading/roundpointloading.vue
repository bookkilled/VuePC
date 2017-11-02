<template>
<div class="pop">
    <div class="loading roundpoint"></div>
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
    background: transparent;
    &.roundpoint {
      font-size: 80px;
      margin-top: -40px;
      margin-left: -40px;
      box-sizing:border-box;
      width: 80px;
      height: 80px;
      border-radius: 50%;    
      z-index: 997;
      -webkit-animation: roundpoint 1.8s infinite ease;
      animation: roundpoint 1.8s infinite ease;      
    }
  }
}
@-webkit-keyframes roundpoint {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.11em -0.83em 0 -0.42em #999, -0.11em -0.83em 0 -0.44em #999, -0.11em -0.83em 0 -0.46em #999, -0.11em -0.83em 0 -0.477em #999;
  }
  5%,
  95% {
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.11em -0.83em 0 -0.42em #999, -0.11em -0.83em 0 -0.44em #999, -0.11em -0.83em 0 -0.46em #999, -0.11em -0.83em 0 -0.477em #999;
  }
  30% {
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.51em -0.66em 0 -0.42em #999, -0.75em -0.36em 0 -0.44em #999, -0.83em -0.03em 0 -0.46em #999, -0.81em 0.21em 0 -0.477em #999;
  }
  55% {
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.29em -0.78em 0 -0.42em #999, -0.43em -0.72em 0 -0.44em #999, -0.52em -0.65em 0 -0.46em #999, -0.57em -0.61em 0 -0.477em #999;
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.11em -0.83em 0 -0.42em #999, -0.11em -0.83em 0 -0.44em #999, -0.11em -0.83em 0 -0.46em #999, -0.11em -0.83em 0 -0.477em #999;
  }
}
@keyframes roundpoint {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.11em -0.83em 0 -0.42em #999, -0.11em -0.83em 0 -0.44em #999, -0.11em -0.83em 0 -0.46em #999, -0.11em -0.83em 0 -0.477em #999;
  }
  5%,
  95% {
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.11em -0.83em 0 -0.42em #999, -0.11em -0.83em 0 -0.44em #999, -0.11em -0.83em 0 -0.46em #999, -0.11em -0.83em 0 -0.477em #999;
  }
  30% {
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.51em -0.66em 0 -0.42em #999, -0.75em -0.36em 0 -0.44em #999, -0.83em -0.03em 0 -0.46em #999, -0.81em 0.21em 0 -0.477em #999;
  }
  55% {
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.29em -0.78em 0 -0.42em #999, -0.43em -0.72em 0 -0.44em #999, -0.52em -0.65em 0 -0.46em #999, -0.57em -0.61em 0 -0.477em #999;
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    box-shadow: -0.11em -0.83em 0 -0.4em #999, -0.11em -0.83em 0 -0.42em #999, -0.11em -0.83em 0 -0.44em #999, -0.11em -0.83em 0 -0.46em #999, -0.11em -0.83em 0 -0.477em #999;
  }
}

</style>
