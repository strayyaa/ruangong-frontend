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
            <el-option label="选择" :value="0" />
            <el-option label="填空" :value="1" />
            <el-option label="简答" :value="2" />
            <el-option label="编程" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item>
            <template #label>
                <span class="inputTitle">题目内容</span>
            </template>
          <el-input v-model="questionForm.content" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item v-if="questionForm.type === 0">
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
import { createQuestion } from '../js/api'
import NavBar from '../components/NavBar.vue'
import { ElMessage } from 'element-plus'

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
const optionInputs = ref(['', '', '', '']) // 用于存储选项输入

const handleCreate = async () => {
  if(!questionForm.value.type || !questionForm.value.content || !questionForm.value.answer) {
    ElMessage.error('请填写完整的题目信息')
    return
  }
  const res = await createQuestion(questionForm.value.type,questionForm.value.public,localStorage.getItem('userId'),questionForm.value.content,optionInputs.value,questionForm.value.answer,questionForm.value.explanation);
  if(res.success) {
    ElMessage.success('题目创建成功')
    // 判断是否是从任务页面跳转过来的
    if (route.query.fromTask === 'true') {
      // 将新题目通过路由参数带回
      localStorage.setItem('newQuestion',JSON.stringify(res.data));
      router.push('/createTask');
    } else {
      // 普通创建题目流程
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
    optionInputs.value = ['', '', '', ''] // 重置选项输入
  } else {
    ElMessage.error(res.errorMsg);
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