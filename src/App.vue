<template>
  <transition name="slide-fade">
    <div v-if="loading" class="loading-mask"></div>
  </transition>
  <router-view />
</template>

<script setup>
import { ref, provide, onMounted ,watch} from 'vue'
import {animate} from 'animejs'


// 全局 loading 状态
const loading = ref(false)
// 提供给子组件使用
provide('globalLoading', loading)
watch(loading, (val) => {
  if (val) {
    animate(".loading-mask",{
      width: ['0vw','100vw'],
      duration: 800,
      easing: 'easeInOutQuart'
    })
  } else {
    // 加载完毕时动画：从左到右收回
    animate('.loading-mask', {
      width: ['100vw', '0vw'],
      duration: 800,
      easing: 'easeInOutQuart',
      complete: () => {
        // 动画结束后隐藏 loading-mask
      }
    })
  }
})
</script>

<style scoped>
.loading-mask {
  position: fixed;
  left: 0; top: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(90deg, #414141 0%, #414141 100%);
  z-index: 9980;
  transition: width 0.8s cubic-bezier(.77,0,.18,1);
  pointer-events: all;
}
.slide-fade-leave-active {
  transition: opacity 0.5s;
}
.slide-fade-leave-to {
  opacity: 0;
}
</style>
