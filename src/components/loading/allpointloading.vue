<template>
<div class="pop">
    <!-- <div class="loading allpoint"></div> -->
    <div class="loading allpoint">
      <div class="sk-circle1 sk-child"></div>
      <div class="sk-circle2 sk-child"></div>
      <div class="sk-circle3 sk-child"></div>
      <div class="sk-circle4 sk-child"></div>
      <div class="sk-circle5 sk-child"></div>
      <div class="sk-circle6 sk-child"></div>
      <div class="sk-circle7 sk-child"></div>
      <div class="sk-circle8 sk-child"></div>
      <div class="sk-circle9 sk-child"></div>
      <div class="sk-circle10 sk-child"></div>
      <div class="sk-circle11 sk-child"></div>
      <div class="sk-circle12 sk-child"></div>
    </div>
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
@loading-default-bg:            #999;
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
    &.allpoint {
      font-size: 80px;
      margin-top: -40px;
      margin-left: -40px;
      box-sizing:border-box;
      width: 80px;
      height: 80px;
      border-radius: 50%;    
      z-index: 997;
      .sk-child {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        &:before {
          content: '';
          display: block;
          margin: 0 auto;
          width: 15%;
          height: 15%;
          background-color: @loading-default-bg;
          border-radius: 100%;
          animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
        }
      }
      .sk-circle2 {
        transform: rotate(30deg);
        &:before {
          animation-delay: -1.1s;
        }
      }  
      .sk-circle3 {
        transform: rotate(60deg);
        &:before {
          animation-delay: -1s;
        }
      }
      .sk-circle4 {
        transform: rotate(90deg);
        &:before {
          animation-delay: -0.9s;
        }
      }
      .sk-circle5 {
        transform: rotate(120deg);
        &:before {
          animation-delay: -0.8s;
        }
      }
      .sk-circle6 {
        transform: rotate(150deg);
        &:before {
          animation-delay: -0.7s;
        }
      }
      .sk-circle7 {
        transform: rotate(180deg);
        &:before {
          animation-delay: -0.6s;
        }
      }
      .sk-circle8 {
        transform: rotate(210deg);
        &:before {
          animation-delay: -0.5s;
        }
      }
      .sk-circle9 {
        transform: rotate(240deg);
        &:before {
          animation-delay: -0.4s;
        }
      }
      .sk-circle10 {
        transform: rotate(270deg);
        &:before {
          animation-delay: -0.3s;
        }
      }
      .sk-circle11 {
        transform: rotate(300deg);
        &:before {
          animation-delay: -0.2s;
        }
      }
      .sk-circle12 {
        transform: rotate(330deg);
        &:before {
          animation-delay: -0.1s;
        }
      }
    }
  }
}
@keyframes sk-circleBounceDelay {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

</style>
