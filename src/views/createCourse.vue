<!-- 这个文件仅用于测试 -->

<template>
  <NavBar></NavBar>

  <!-- 页面主体 -->
  <div class="page-container">
    <!-- 左上角标题 -->
    <h1 class="page-title">创建课程</h1>

    <!-- 正文内容块 -->
    <div class="form-container">
      <el-form :model="courseForm" label-width="100px">
        <el-form-item class="form-item">
            <template #label>
                <span class="inputTitle">课程名称</span>
            </template>
          <el-input v-model="courseForm.name" placeholder="请输入课程名" />
        </el-form-item>

        <el-form-item class="form-item">
            <template #label>
                <span class="inputTitle">课程大纲</span>
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
                <span class="inputTitle">考试类型</span>
            </template>
          <el-radio-group v-model="courseForm.exam_type">
            <el-radio label="考查">考查</el-radio>
            <el-radio label="考试">考试</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="form-item">
            <template #label>
                <span class="inputTitle">学分</span>
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
          <el-button type="primary" @click="createCourse" class="inputButton">创建课程</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getTest } from '../js/api.js'
import NavBar from '../components/NavBar.vue'
import { animate } from 'animejs'

const router = useRouter()

// 表单模型
const courseForm = ref({
  name: '',
  outline: '',
  exam_type: '考试', // 默认选择考试
  credit: 0,
  period: 0,
  // 以下为隐藏字段
  id: Math.floor(Math.random() * 10000), // 模拟 id，后端生成为准
  creator_id: 1, // 模拟 creator_id
})

// 点击按钮后跳转
const createCourse = () => {
  router.push(`/course/${courseForm.value.id}`)
}

onMounted(() => {
  // 可选挂载操作
})
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
  color: rgb(63, 63, 63);
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-container {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  padding: 20px;
  border-radius: 12px;
  width: 75%;
}
.inputTitle {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
.form-item {
  margin-bottom: 60px;
  margin-top: 20px;
}
.inputButton {
  width: 75%;
  height: 50px;
  font-size: 1.2rem;
  background-color: #e6e6e6;
  color: #3d3d3d;
  border-radius: 8px;
}
.inputButton:hover {
  background-color: #ffffff;
  color: #2c2c2c;
  transition: background-color 0.3s, color 0.3s;
}
</style>
