<template>
    <el-menu
      :default-active="1"
      mode="horizontal"
      :ellipsis="false"
      style = "margin-left: 0 auto;margin-right:0 auto;"
    >
      <el-menu-item index="1" @click="router.push('/home')">课程管理系统</el-menu-item>
      
      <el-menu-item index="2" @click="router.push('/courses')">我的课程</el-menu-item>
      <el-menu-item index="3"  @click="router.push('/tasks')">我的任务</el-menu-item>
      <el-menu-item index="4"  @click="router.push('/questions')">我的题目</el-menu-item>

      <el-text size="large" style="margin-top: -4px;">{{ user.name }} {{ identity }},你好！</el-text>
    </el-menu>
</template>
  

<script setup>
import { onMounted, ref } from 'vue'
import router from '../router'

const user = ref({ name: '张三' })
const identity = ref('同学')

import { getUserInfoById } from '../js/api.js'
onMounted(()=>{
  user.value = getUserInfoById();
  if(user.value.identity == 0){
    identity.value = "老师"
  }
})
</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
