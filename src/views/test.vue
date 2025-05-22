<!-- 这个文件仅用于测试 -->

<template>
    <NavBar></NavBar>
    {{ message }}
    <div @click="testfun">asdsadsa</div>

    <h1>
      <span class="toanimate">课</span>
      <span class="toanimate">H</span>
      <span class="toanimate">H</span>
      <span class="toanimate">H</span>
    </h1>

    <el-button 
    @click="testfun"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    class = "loginbtn"
    style="color: azure;background-color: black;width: 100px;height: 80px;"
    >登录</el-button>

</template>
  
<script setup>
import { onMounted, ref } from 'vue'
import {getCourseInfoById, getTest} from '../js/api.js'
import NavBar from '../components/NavBar.vue';

const message = ref({"name":"123"});
const testfun = async () =>{
  message.value = await getCourseInfoById();
}
const mouseenter = () => {
  animate('.loginbtn', {
    // translateY: [-5, 0],
    scale: [1, 1.2],
    width: ['100px', '120px'],
    boxShadow: ['0 2px 12px 0 rgba(64,158,255,.3)', '0 4px 16px 0 rgba(64,158,255,.4)'],
    background: ['#000', 'linear-gradient(45deg, #409EFF, #86c1ff)'],
    color: ['#409EFF', '#fff'],
    duration: 400,
    elasticity: 400,
    loop: false,
    easing: 'easeOutElastic(1, .5)'
  });
}
const mouseleave = () => {
  animate('.loginbtn', {
    translateY: 0,
    scale: 1,
    width: ['120px', '100px'],
    boxShadow: '0 2px 12px 0 rgba(64,158,255,.1)',
    background: '#000000',
    color: '#fff',
    duration: 400,
    easing: 'easeOutExpo'
  })
}

import { animate } from 'animejs';

onMounted(()=>{
  animate('.toanimate', {
  // Property keyframes
  y: [
    { to: '-2.75rem', ease: 'outExpo', duration: 600 },
    { to: '0px', ease: 'outBounce', duration: 800, delay: 100 }
  ],
  // Property specific parameters
  rotate: {
    from: '-1turn',
    delay: 0
  },
  delay: (_, i) => i * 50, // Function based value
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true
});
})


</script>

<style scoped>
.toanimate {
  display: inline-block; /* 关键修复！ */
  margin: 0 5px;        /* 添加间距 */
  position: relative;   /* 确保定位正常 */
}
</style>
