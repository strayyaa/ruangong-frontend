<template>
    <div class="clock">
      <span>{{ hours }}</span>:<span>{{ minutes }}</span>:<span>{{ seconds }}</span>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  // 定义时、分、秒
  const hours = ref('00')
  const minutes = ref('00')
  const seconds = ref('00')
  
  let timer = null
  
  // 更新时间函数
  const updateTime = () => {
    const now = new Date()
    hours.value = String(now.getHours()).padStart(2, '0')
    minutes.value = String(now.getMinutes()).padStart(2, '0')
    seconds.value = String(now.getSeconds()).padStart(2, '0')
  }
  
  onMounted(() => {
    updateTime()  // 页面加载时立刻更新时间
    timer = setInterval(updateTime, 1000)  // 每秒更新时间
  })
  
  onUnmounted(() => {
    clearInterval(timer)  // 离开页面时清除定时器
  })
  </script>
  
  <style scoped>
  .clock {
    font-size: 48px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 10px;
    width: 200px;
    margin: 50px auto;
  }
  span {
    margin: 0 5px;
  }
  </style>
  