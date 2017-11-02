<template>
<div class="pop">
    <div class="loading round"></div>
    <div class="loading square"></div>
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
    &.round {
      margin-top: -40px;
      margin-left: -40px;
      box-sizing:border-box;
      width: 80px;
      height: 80px;
      border: 2px solid #ccc;
      border-radius: 40px;    
      z-index: 997;
      -webkit-animation: round-load 3s infinite  ease-in-out;
      animation: round-load 3s infinite  ease-in-out;
      &:before {
        position: absolute;
        content: '';
        top: -3px;
        left: -3px;
        width: 42px;
        height: 82px;
        border-top-left-radius: 41px;
        border-bottom-left-radius: 41px;
        background: rgb(51, 51, 51);
        -webkit-transform-origin: 42px 41px;
        transform-origin: 42px 41px;
        -webkit-animation: round-cover 1.5s infinite  ease-in-out;
        animation: round-cover 1.5s infinite  ease-in-out;
      }
      &:after {
        top: -3px;
        left: 39px;
        position: absolute;
        content: '';
        width: 42px;
        height: 82px;
        border-top-right-radius: 41px;
        border-bottom-right-radius: 41px;
        background: rgb(51, 51, 51);
        // transform: rotate(0deg);
        -webkit-transform-origin: 0px 41px;
        transform-origin: 0px 41px;
        -webkit-animation: round-cover 1.5s infinite  ease-in-out 1.2s;
        animation: round-cover 1.5s infinite  ease-in-out 1.2s;
      }  
    }
    &.square {
      margin-top: -10px;
      margin-left: -10px;
      box-sizing:border-box;
      width: 20px;
      height: 20px;
      border: 2px solid #ccc;
      background: transparent;
      -webkit-animation: square-load 3s infinite ease-in-out;
      animation: square-load 3s infinite  ease-in-out;
      z-index: 999;
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
@-webkit-keyframes round-load {
  0% {
    border-color: #FFF;
  }
  50% {
    border-color: #a01e23;
  }
  100% {
    border-color: #FFF;
  }
}
@keyframes round-load {
    0% {
    border-color: #FFF;
  }
  50% {
    border-color: #a01e23;
  }
  100% {
    border-color: #FFF;
  }
}
@-webkit-keyframes round-cover {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes round-cover {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
