<template>
  <div>
    <!-- 占位符：防止页面被固定导航栏遮挡 -->
    <div style="height: 60px;"></div>

    <!-- 固定在顶部的导航栏 -->
    <el-menu
      :default-active="$route.path"
      router
      mode="horizontal"
      :ellipsis="false"
      class="el-menu-demo fixed-navbar"
    >
      <el-menu-item index="/home" class="el-menu-item-trans">课程管理系统</el-menu-item>
      <el-menu-item index="/courses" class="el-menu-item-trans">我的课程</el-menu-item>
      <el-menu-item index="/tasks" class="el-menu-item-trans">我的任务</el-menu-item>
      <el-menu-item index="/questions" class="el-menu-item-trans">我的题目</el-menu-item>
      <el-text size="large" style="margin-top: -4px;font-weight: 700;" class="el-text">{{ user.name }} {{ identity }}，你好！</el-text>
    </el-menu>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import router from '../router'

const user = ref({ name: '张三', identity: 1 })
const identity = ref('同学')

const props = defineProps({
  active: {
    type: String,
    default: '1'
  }
})

import { getUserInfoById } from '../js/api.js'
onMounted(() => {
  //user.value = getUserInfoById(localStorage.getItem('userId'));
  if (user.value.identity == 0) {
    identity.value = "老师"
  }
})
</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

.el-menu-item-trans {
  font-size:1rem;
  font-weight: 700;
  color: #c5c5c5 !important;
  border-bottom: none !important;
  transition: all 0.3s ease-in-out !important;
}

.el-menu-item-trans:hover {
  background-color: rgba(255, 255, 255, 0.5) !important;
  color: #000000 !important;
}

::v-deep(.el-menu-item-trans.is-active) {
  background-color: rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
}

.el-menu-demo {
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
}

/* 新增固定样式 */
.fixed-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.el-text {
  color: #c5c5c5 !important;
}
</style>
