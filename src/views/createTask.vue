<template>
  <NavBar />
  <div class="page-container">
    <h1 class="page-title">创建任务</h1>

    <div class="form-container">
      <el-form :model="taskForm" label-width="100px">
        <el-form-item>
          <template #label>
            <span class="inputTitle">任务名称</span>
          </template>
          <el-input v-model="taskForm.name" />
        </el-form-item>

        <el-form-item>
          <template #label>
            <span class="inputTitle">任务类型</span>
          </template>
          <el-switch v-model="taskForm.public" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="openDrawer">添加题目</el-button>
          <el-button style="margin-left: 20px;" @click="createNewQuestion">创建新题目</el-button>
        </el-form-item>

        <div style="margin-top: 20px">
          <h3>已添加题目：</h3>
          <div v-if="Object.keys(groupedQuestions).length === 0">暂无题目</div>
          <div v-for="(questions, type) in groupedQuestions" :key="type" class="question-group">
            <h4>{{ type }}题</h4>
            <ul>
              <li v-for="q in questions" :key="q.id" class="question-card">
                <p><strong>ID：</strong>{{ q.id }}</p>
                <p><strong>内容：</strong>{{ q.content }}</p>
                <div v-if="q.type === '选择'">
                <p><strong>选项：</strong></p>
                <ul class="option-list">
                    <li v-for="(opt, idx) in q.options.split('***')" :key="idx">
                    {{ String.fromCharCode(65 + idx) }}. {{ opt }}
                    </li>
                </ul>
                </div>
                <p><strong>答案：</strong>{{ q.answer }}</p>
                <p><strong>解析：</strong>{{ q.explanation }}</p>
              </li>
            </ul>
          </div>
        </div>

        <el-form-item>
          <el-button type="success" @click="submitTask">提交任务</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-drawer v-model="drawerVisible" title="从题库中选择题目" direction="rtl">
      <el-input v-model="searchText" placeholder="搜索题目" style="margin-bottom: 20px;" />
      <el-card v-for="q in filteredQuestions" :key="q.id" class="card">
        <div class="card-row">
          <span>ID: {{ q.id }}</span>
          <span>内容: {{ q.content }}</span>
          <el-button style="margin-left: auto" @click="addQuestion(q)">添加</el-button>
        </div>
      </el-card>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const taskForm = ref({
  name: '',
  public: true,
  questionIds: []
})

const addedQuestions = ref([])

// LocalStorage keys
const STORAGE_KEY_IDS = 'task_question_ids'
const STORAGE_KEY_QUESTIONS = 'task_question_list'

// 打开题库抽屉
const drawerVisible = ref(false)
const openDrawer = () => drawerVisible.value = true
const searchText = ref('')

// 示例题库（模拟）
const questionBank = ref([
  {
    id: 1001,
    type: '选择',
    content: '下列哪个选项最符合条件？',
    options: '选项A***选项B***选项C***选项D',
    answer: 'A',
    explanation: '因为A符合所有条件。'
  },
  {
    id: 1002,
    type: '判断',
    content: 'Vue是一个前端框架。',
    options: '',
    answer: '正确',
    explanation: 'Vue是用于构建用户界面的渐进式JavaScript框架。'
  }
])

// 添加题目
const addQuestion = (question) => {
  if (!taskForm.value.questionIds.includes(question.id)) {
    taskForm.value.questionIds.push(question.id)
    addedQuestions.value.push(question)
    saveToLocalStorage()
  }
}

// 创建题目前保存当前题目状态
const createNewQuestion = () => {
  saveToLocalStorage()
  router.push({ path: '/createQuestion', query: { fromTask: 'true' } })
}

// 保存任务数据到 localStorage
const saveToLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY_IDS, JSON.stringify(taskForm.value.questionIds))
  localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(addedQuestions.value))
}

// 从 localStorage 恢复任务数据
const loadFromLocalStorage = () => {
  const ids = JSON.parse(localStorage.getItem(STORAGE_KEY_IDS) || '[]')
  const questions = JSON.parse(localStorage.getItem(STORAGE_KEY_QUESTIONS) || '[]')
  taskForm.value.questionIds = ids
  addedQuestions.value = questions
}

onMounted(() => {
  // 先恢复之前缓存的题目列表
  loadFromLocalStorage()

  // 检查是否带回了新题目
  const newQuestionParam = route.query.newQuestion
  if (newQuestionParam) {
    try {
      const newQuestion = JSON.parse(newQuestionParam)
      if (!taskForm.value.questionIds.includes(newQuestion.id)) {
        taskForm.value.questionIds.push(newQuestion.id)
        addedQuestions.value.push(newQuestion)
        saveToLocalStorage()
      }
      router.replace({ query: { ...route.query, newQuestion: undefined } })
    } catch (err) {
      console.error('新题目解析失败：', err)
    }
  }
})

const filteredQuestions = computed(() => {
  return questionBank.value.filter(q =>
    q.content.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 按题型分组展示
const groupedQuestions = computed(() => {
  const map = {}
  for (const q of addedQuestions.value) {
    if (!map[q.type]) map[q.type] = []
    map[q.type].push(q)
  }
  return map
})

const submitTask = () => {
  alert(`任务创建成功，包含题目：${taskForm.value.questionIds.join(', ')}`)
  localStorage.removeItem(STORAGE_KEY_IDS)
  localStorage.removeItem(STORAGE_KEY_QUESTIONS)
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
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card {
  margin-bottom: 10px;
  padding: 10px;
}
.inputTitle {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
.question-group {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fafafa;
}
.question-card {
  margin: 10px 0;
  padding: 10px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.option-list {
  padding-left: 20px;
  list-style-type: disc;
}
</style>
