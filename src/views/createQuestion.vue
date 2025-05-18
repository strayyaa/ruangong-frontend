<template>
  <NavBar />
  <div class="page-container">
    <h1 class="page-title">创建题目</h1>

    <div class="form-container">
      <el-form :model="questionForm" label-width="100px">
        <el-form-item>
            <template #label>
                <span class="inputTitle">题目类型</span>
            </template>
          <el-select v-model="questionForm.type" placeholder="请选择题型">
            <el-option label="选择" value="选择" />
            <el-option label="填空" value="填空" />
            <el-option label="简答" value="简答" />
            <el-option label="编程" value="编程" />
          </el-select>
        </el-form-item>

        <el-form-item>
            <template #label>
                <span class="inputTitle">题目内容</span>
            </template>
          <el-input v-model="questionForm.content" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item v-if="questionForm.type === '选择'">
        <template #label>
            <span class="inputTitle">选项</span>
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
                <span class="inputTitle">是否公开</span>
            </template>
          <el-switch v-model="questionForm.public" />
        </el-form-item>

        <el-form-item>
            <template #label>
                <span class="inputTitle">答案</span>
            </template>
          <el-input v-model="questionForm.answer" />
        </el-form-item>

        <el-form-item>
            <template #label>
                <span class="inputTitle">解析</span>
            </template>
          <el-input v-model="questionForm.explanation" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleCreate">创建题目</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const questionForm = ref({
  type: '',
  content: '',
  options: '',
  public: true,
  answer: '',
  explanation: '',
  id: Math.floor(Math.random() * 100000), // 模拟题目ID
  creator_id: 1,
})
const optionInputs = ref(['', '', '', ''])

const handleCreate = () => {
  const fromTaskCreation = route.query.fromTask === 'true'
  questionForm.value.options = 'A' + optionInputs.value[0] + 'B' + optionInputs.value[1] + 'C' + optionInputs.value[2] + 'D' + optionInputs.value[3]

  if (fromTaskCreation) {
    // 将完整题目信息带回 /createTask
    const newQuestion = { ...questionForm.value }
    router.push({
      path: '/createTask',
      query: {
        newQuestion: JSON.stringify(newQuestion)
      }
    })
  } else {
    router.push('/questions')
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
}
.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}
.form-container {
  background-color: #fff;
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
</style>