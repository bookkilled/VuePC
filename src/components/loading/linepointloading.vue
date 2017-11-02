<template>
<div class="pop">
    <div class="loading linepoint"></div>
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
    &.linepoint {
      margin-top: -30px;
      margin-left: -10px;
      box-sizing:border-box;
      width: 20px;
      height: 20px;
      border-radius: 50%;    
      z-index: 997;
      color: #FFF;
      -webkit-animation: linepoint 1.8s infinite  ease-in-out -0.16s;
      animation: linepoint 1.8s infinite  ease-in-out -0.16s;      
      &:before {
        position: absolute;
        content: '';
        top: 0;
        left: -36px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        -webkit-animation: linepoint 1.8s infinite  ease-in-out  -0.32s;
        animation: linepoint 1.8s infinite  ease-in-out  -0.32s;
      }
      &:after {
        top: 0px;
        left: 36px;
        position: absolute;
        content: '';
        width: 20px;
        height: 20px;
        border-radius: 50%;
        -webkit-animation: linepoint 1.8s infinite  ease-in-out;
        animation: linepoint 1.8s infinite  ease-in-out;
      }  
    }
  }
}
@-webkit-keyframes linepoint {
  0% {
    box-shadow: 0 20px 0 -1.3em #999;
  }
  40% {
    box-shadow: 0 20px 0 0 #999;
  }
  100% {
    box-shadow: 0 20px 0 -1.3em #999;
  }
}
@keyframes linepoint {
  0% {
    box-shadow: 0 20px 0 -1.3em #999;
  }
  40% {
    box-shadow: 0 20px 0 0 #999;
  }
  100% {
    box-shadow: 0 20px 0 -1.3em #999;
  }
}

</style>
