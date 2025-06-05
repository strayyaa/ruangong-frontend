<!-- 这个文件仅用于测试 -->

<template>
  <NavBar></NavBar>

  <!-- 背景层 -->
  <div class="background-layer">
    <h1 :style="{ 'margin-top': distance }" class="page-title">创建课程</h1>
    
    <!-- 表单内容块 -->
    <div class="form-container">
      <el-form :model="courseForm" label-width="200px">
        <el-form-item class="form-item">
          <template #label>
            <div width="200px">
            <span class="inputTitle">课程名称</span></div>
          </template>
          <el-input v-model="courseForm.name" placeholder="请输入课程名" />
        </el-form-item>

        <el-form-item class="form-item">
          <template #label>
            <div width="200px">
            <span class="inputTitle">课程大纲</span></div>
          </template>
          <el-input
            v-model="courseForm.outline"
            type="textarea"
            placeholder="请输入课程大纲"
            style="height: 50px;"
            :rows="4"
          />
        </el-form-item>

        <el-form-item class="form-item">
          <template #label>
            <div width="200px">
            <span class="inputTitle">考试类型</span></div>
          </template>
          <el-radio-group v-model="courseForm.exam_type">
            <el-radio label="考查">考查</el-radio>
            <el-radio label="考试">考试</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="form-item">
          <template #label>
            <div width="200px">
            <span class="inputTitle">学分</span></div>
          </template>
          <el-input-number v-model="courseForm.credit" :min="0" />
        </el-form-item>

        <el-form-item class="form-item">
          <template #label>
            <span class="inputTitle">学时</span>
          </template>
          <el-input-number v-model="courseForm.period" :min="0" />
        </el-form-item>

        <el-form-item class="form-item">
          <el-button 
            type="primary" 
            @click="createCourseFun" 
            class="create-btn"
            @mouseenter="createMouseEnter"
            @mouseleave="createMouseLeave"
          >创建课程</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref,onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTest, createCourse } from '../js/api.js'
import NavBar from '../components/NavBar.vue'
import { animate } from 'animejs'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 表单模型
const courseForm = ref({
  name: '',
  outline: '',
  exam_type: '考试', // 默认选择考试
  credit: 0,
  period: 0,
  course_id: 0,
  creator_id: 1,
})

const distance = ref('140px')

const handleScroll = () => {
  const currentScroll = window.pageYOffset
  const scrollProgress = Math.min(currentScroll / 500, 1)
  distance.value = `${Math.max(140 - scrollProgress * 140, 80)}px`
}

const createMouseEnter = () => {
  animate('.create-btn', {
    scale: 1.2,
    backgroundColor: '#FFFFFF',
    color: 'rgba(0, 0, 0, 0.8)',
    duration: 300,
    easing: 'easeOutExpo'
  })
}

const createMouseLeave = () => {
  animate('.create-btn', {
    scale: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(203, 203, 203, 0.8)',
    duration: 300,
    easing: 'easeOutExpo'
  })
}

// 点击按钮后跳转
const createCourseFun = async () => {
  const res = await createCourse(
    courseForm.value.name,
    localStorage.getItem('userId'),
    courseForm.value.outline,
    courseForm.value.exam_type,
    courseForm.value.credit,
    courseForm.value.period
  )
  if (res.success === false) {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    })
    return
  }
  courseForm.value = res.data
  console.log("获取到的创建课程的信息:" + courseForm.value)
  router.push(`/course/${courseForm.value.course_id}`)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.background-layer {
  position: fixed;
  height: 100vh;
  width: 100%;
  background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)),
              url('../assets/course_id_background.jpg');
  background-size: cover;
  margin-top: -80px;
  margin-left: -8px;
  background-position: center;
  z-index: -1;
}

.page-title {
  position: relative;
  color: rgb(206, 206, 206);
  font-size: 4rem;
  text-align: left;
  margin-left: 80px;
  font-weight: bold;
}

.form-container {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 40px;
  border-radius: 12px;
  width: 75%;
  margin: 40px auto;
  color: rgb(206, 206, 206);
}

.inputTitle {
  font-size: 1.6rem;
  font-weight: bold;
  color: #c5c5c5;
}

.form-item {
  margin-bottom: 40px;
}

.create-btn {
  width: 75%;
  height: 50px;
  font-size: 1.2rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(203, 203, 203, 0.8);
  border: none !important;
  border-radius: 25px !important;
  backdrop-filter: blur(5px);
  box-shadow: none !important;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #c5c5c5 !important;
}

:deep(.el-radio__label) {
  color: #c5c5c5 !important;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #c5c5c5 !important;
}
</style>
