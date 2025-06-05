<template>
  <NavBar />
  <div class="background-layer">
    <h1 :style="{ 'margin-top': distance }" class="page-title">创建题目</h1>

    <div class="form-container">
      <el-form :model="questionForm" label-width="200px">
        <el-form-item>
          <template #label>
            <div style="width: 300px;">
              <span class="inputTitle">题目类型</span>
            </div>
          </template>
          <el-select v-model="questionForm.type" placeholder="请选择题型">
            <el-option label="选择" :value="0" />
            <el-option label="填空" :value="1" />
            <el-option label="简答" :value="2" />
            <el-option label="编程" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <template #label>
            <div style="width: 300px;">
              <span class="inputTitle">题目内容</span>
            </div>
          </template>
          <el-input v-model="questionForm.content" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item v-if="questionForm.type === 0">
          <template #label>
            <div style="width: 300px;">
              <span class="inputTitle">选项</span>
            </div>
          </template>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <el-input v-model="optionInputs[0]" placeholder="选项 A" />
            <el-input v-model="optionInputs[1]" placeholder="选项 B" />
            <el-input v-model="optionInputs[2]" placeholder="选项 C" />
            <el-input v-model="optionInputs[3]" placeholder="选项 D" />
          </div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <div style="width: 300px;">
              <span class="inputTitle">是否公开</span>
            </div>
          </template>
          <el-switch v-model="questionForm.public" />
        </el-form-item>

        <el-form-item>
          <template #label>
            <div style="width: 300px;">
              <span class="inputTitle">答案</span>
            </div>
          </template>
          <el-input v-model="questionForm.answer" />
        </el-form-item>

        <el-form-item>
          <template #label>
            <div style="width: 300px;">
              <span class="inputTitle">解析</span>
            </div>
          </template>
          <el-input v-model="questionForm.explanation" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleCreate" 
            class="create-btn"
            @mouseenter="createMouseEnter"
            @mouseleave="createMouseLeave"
          >创建题目</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createQuestion } from '../js/api'
import NavBar from '../components/NavBar.vue'
import { ElMessage } from 'element-plus'
import { animate } from 'animejs'

const router = useRouter()
const route = useRoute()

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

const questionForm = ref({
  type: '',
  content: '',
  options: '',
  public: true,
  answer: '',
  explanation: '',
  id: Math.floor(Math.random() * 100000),
  creator_id: 1,
})
const optionInputs = ref(['', '', '', ''])

const handleCreate = async () => {
  if(questionForm.value.type===null || !questionForm.value.content || !questionForm.value.answer) {
    ElMessage.error('请填写完整的题目信息')
    return
  }
  const res = await createQuestion(
    questionForm.value.type,
    questionForm.value.public,
    localStorage.getItem('userId'),
    questionForm.value.content,
    optionInputs.value,
    questionForm.value.answer,
    questionForm.value.explanation
  )
  if(res.success) {
    ElMessage.success('题目创建成功')
    if (route.query.fromTask === 'true') {
      localStorage.setItem('newQuestion', JSON.stringify(res.data))
      router.push('/createTask')
    } else {
      questionForm.value = {
        type: '',
        content: '',
        options: '',
        public: true,
        answer: '',
        explanation: '',
        id: Math.floor(Math.random() * 100000),
        creator_id: 1,
      }
      optionInputs.value = ['', '', '', '']
    }
    optionInputs.value = ['', '', '', '']
  } else {
    ElMessage.error(res.errorMsg)
  }
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

:deep(.el-select .el-input__inner) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #c5c5c5 !important;
}

:deep(.el-switch__core) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}
</style>
