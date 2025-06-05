<template>
  <NavBar />
  <div class="background-layer">
    <h1 :style="{ 'margin-top': distancee }" class="page-title">创建任务</h1>

    <div class="form-container">
      <el-form :model="taskForm" label-width="200px">
        <el-form-item>
          <template #label>
            <div style="width: 300px;">
              <span class="inputTitle">任务名称</span>
            </div>
          </template>
          <el-input v-model="taskForm.name" />
        </el-form-item>

        <el-form-item>
          <template #label>
            <div style="width: 300px;">
              <span class="inputTitle">任务是否公开：</span>
            </div>
          </template>
          <el-switch v-model="taskForm.public" />
        </el-form-item>

        <el-form-item>
          <template #label>
            <div style="width: 300px;">
              <span class="inputTitle">选择添加到哪个课程:</span>
            </div>
          </template>
          <span class="cardWord">{{ chosenCourseName }}</span>
          <el-button 
            type="primary" 
            @click="drawerOfCourseChoose=true"
            class="action-btn"
            @mouseenter="btnMouseEnter"
            @mouseleave="btnMouseLeave"
          >选择课程</el-button>
        </el-form-item>

        <el-drawer
          title="选择课程"
          v-model="drawerOfCourseChoose"
          :before-close="() => (drawerOfCourseChoose = false)"
          :append-to-body="true"
          direction="rtl"
        >
          <el-card v-for="course in courseList" :key="course.course_id" class="card">
            <div class="card-row">
              <div class="card-info">
                <span class="drawer-card-word">{{ course.course_id }}</span>
                <span class="drawer-card-word">{{ course.name }}</span>
              </div>
              <div class="card-actions">
                <el-button 
                  class="cardButton"
                  @mouseenter="btnMouseEnter"
                  @mouseleave="btnMouseLeave"
                >
                  <span style="margin-top: 14px;" @click="chooseCourse(course.course_id,course.name)">选择</span>
                </el-button>
              </div>
            </div>
          </el-card>
        </el-drawer>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="openDrawer"
            class="action-btn"
            @mouseenter="btnMouseEnter"
            @mouseleave="btnMouseLeave"
          >添加题目</el-button>
          <el-button 
            style="margin-left: 20px;"
            @click="createNewQuestion"
            class="action-btn"
            @mouseenter="btnMouseEnter"
            @mouseleave="btnMouseLeave"
          >创建新题目</el-button>
        </el-form-item>

        <div style="margin-top: 20px">
          <h3 class="section-title">已添加题目：</h3>
          <div v-if="Object.keys(groupedQuestions).length === 0" class="empty-tip">暂无题目</div>
          <div v-for="(questions, type) in groupedQuestions" :key="type" class="question-group">
            <h4 v-if="type==0" class="group-title">选择题</h4>
            <h4 v-else-if="type==1" class="group-title">填空题</h4>
            <h4 v-else-if="type==2" class="group-title">简答题</h4>
            <h4 v-else-if="type==3" class="group-title">编程题</h4>
            
            <ul>
              <li v-for="q in questions" :key="q.prob_id" class="question-card">
                <p><strong>ID：</strong>{{ q.prob_id }}</p>
                <p><strong>内容：</strong>{{ q.description }}</p>
                <div v-if="q.type ===0">
                  <p><strong>选项：</strong></p>
                  <ul class="option-list">
                    <li v-for="(opt, idx) in JSON.parse(q.content)" :key="idx">
                      {{ String.fromCharCode(65 + idx) }}. {{ opt }}
                    </li>
                  </ul>
                </div>
                <p><strong>答案：</strong>{{ q.answer }}</p>
                <p><strong>解析：</strong>{{ q.analysis }}</p>
                <div>
                  <span>填写具体分数：</span>
                  <el-input-number v-model="q.score" :min="0" :max="100" style="width: 100px;" />
                </div>
                <el-button 
                  type="danger" 
                  @click="removeQuestion(q.prob_id)"
                  class="action-btn"
                  @mouseenter="btnMouseEnter"
                  @mouseleave="btnMouseLeave"
                >删除</el-button>
              </li>
            </ul>
          </div>
        </div>

        <el-form-item>
          <el-button 
            type="success" 
            @click="submitTask"
            class="submit-btn"
            @mouseenter="btnMouseEnter"
            @mouseleave="btnMouseLeave"
          >提交任务</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-drawer 
      v-model="drawerVisible" 
      title="从题库中选择题目" 
      direction="rtl"
      :append-to-body="true"
      :before-close="() => (drawerVisible = false)"
    >
      <div>
        <el-button 
          v-if="drawerShowPri"
          style="margin-right: 20px;margin-top: -30px;scale: 1.2;font-size: 1rem;font-weight: bold;"
          @click="drawerShowPri=false"
          class="action-btn"
          @mouseenter="btnMouseEnter"
          @mouseleave="btnMouseLeave"
        >切换到公有题目</el-button>
        <el-button 
          v-if="!drawerShowPri"
          style="margin-right: 20px;margin-top: -30px;scale: 1.2;font-size: 1rem;font-weight: bold;"
          @click="drawerShowPri=false"
          class="action-btn"
          @mouseenter="btnMouseEnter"
          @mouseleave="btnMouseLeave"
        >切换到私有题目</el-button>
      </div>
      <span style="color: rgb(206,206,206);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">搜索
        <span v-if="drawerShowPri">私有</span><span v-else>公有</span>题目：</span>
      <el-input v-model="searchText" placeholder="搜索题目" style="margin-bottom: 20px;" />
      <el-card v-for="q in pagedQuestions" :key="q.id" class="card">
        <div class="card-row">
          <div class="card-info">
            <span class="drawer-card-word">{{ q.prob_id }}</span>
            <span v-if="q.type===0" class="drawer-card-word">选择题</span>
            <span v-else-if="q.type===1" class="drawer-card-word">填空题</span>
            <span v-else-if="q.type===2" class="drawer-card-word">简答题</span>
            <span v-else-if="q.type===3" class="drawer-card-word">编程题</span>
            <span class="drawer-card-word">{{ q.description.slice(0, 10) }}<span v-if="q.description.length > 10">...</span></span>
          </div>
          <div class="card-actions">
            <el-button 
              style="margin-left: auto" 
              @click="addQuestion(q)"
              class="action-btn"
              @mouseenter="btnMouseEnter"
              @mouseleave="btnMouseLeave"
            >添加</el-button>
          </div>
        </div>
      </el-card>
      <el-pagination
        v-if="filteredQuestions.length > pageSize"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filteredQuestions.length"
        layout="prev, pager, next"
        @current-change="currentPage = $event"
      />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createTask, getAllPriQuestions, getAllPubQuestions, getUserCourses } from '../js/api'
import NavBar from '../components/NavBar.vue'
import { ElMessage } from 'element-plus'
import { animate } from 'animejs'

const router = useRouter()
const route = useRoute()

const distancee = ref('140px')

const handleScroll = () => {
  const currentScroll = window.pageYOffset
  const scrollProgress = Math.min(currentScroll / 500, 1)
  distancee.value = `${Math.max(140 - scrollProgress * 140, 80)}px`
}

const btnMouseEnter = (event) => {
  animate(event.target, {
    scale: 1.2,
    backgroundColor: '#FFFFFF',
    color: 'rgba(0, 0, 0, 0.8)',
    duration: 300,
    easing: 'easeOutExpo'
  })
}

const btnMouseLeave = (event) => {
  animate(event.target, {
    scale: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(203, 203, 203, 0.8)',
    duration: 300,
    easing: 'easeOutExpo'
  })
}

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

const drawerOfCourseChoose = ref(false);
const courseList = ref([]);

const fetchCourse = async()=>{
  const res = await getUserCourses(localStorage.getItem('userId'));
  if(!res.success || res.data.length === 0) {
    ElMessage.error(res.errorMsg || '未找到课程，请先创建课程');
    return;
  }
  courseList.value = res.data[0];
}
const chosenCourse = ref(0);
const chosenCourseName = ref('未选择课程');
const chooseCourse = (course_id, course_name) => {
  chosenCourse.value = course_id;
  chosenCourseName.value = course_name;
  taskForm.value.courseId = course_id; // 保存到任务表单中
  drawerOfCourseChoose.value = false; // 关闭抽屉
}
// 示例题库（模拟）
const priQuestions = ref([])
const pubQuestions = ref([])
const fetchAllQuestions = async ()=>{
  const res = await getAllPubQuestions();
  const res2 = await getAllPriQuestions(localStorage.getItem('userId'));
  if(res.success && res2.success) {
    pubQuestions.value = res.data;
    priQuestions.value = res2.data;
  } else {
    ElMessage.error(res.errorMsg+" "+res2.errorMsg)
  }
}
const drawerShowPri = ref(true);
// 添加题目
const addQuestion = (question) => {
  if (!taskForm.value.questionIds.includes(question.prob_id)) {
    taskForm.value.questionIds.push(question.prob_id)
    question.score = 10 // 初始化分数
    addedQuestions.value.push(question)
    saveToLocalStorage()
    ElMessage.success('题目已添加')
  }else{
    ElMessage.error('题目已添加，请勿重复添加')
  }
}
const removeQuestion = (prob_id) => {
  // 从 addedQuestions 中移除
  addedQuestions.value = addedQuestions.value.filter(q => q.prob_id !== prob_id)
  // 从 taskForm.questionIds 中移除
  taskForm.value.questionIds = taskForm.value.questionIds.filter(id => id !== prob_id)
  // 同步到 localStorage
  saveToLocalStorage()
}

// 创建题目前保存当前题目状态
const createNewQuestion = () => {
  saveToLocalStorage()
  router.push({ path: '/createQuestion', query: { fromTask: 'true' } })
}

// 保存任务数据到 localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('taskName',taskForm.value.name);
  localStorage.setItem('taskPublic',taskForm.value.public);
  localStorage.setItem('taskCourseId',chosenCourse.value);
  localStorage.setItem('taskCourseName',chosenCourseName.value);
  localStorage.setItem(STORAGE_KEY_IDS, JSON.stringify(taskForm.value.questionIds))
  localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(addedQuestions.value))
}

// 从 localStorage 恢复任务数据
const loadFromLocalStorage = () => {
  taskForm.value.name = localStorage.getItem('taskName') || '';
  taskForm.value.public = localStorage.getItem('taskPublic') === 'true';
  chosenCourse.value = parseInt(localStorage.getItem('taskCourseId')) || 0;
  chosenCourseName.value = localStorage.getItem('taskCourseName') || '未选择课程';
  const ids = JSON.parse(localStorage.getItem(STORAGE_KEY_IDS) || '[]')
  const questions = JSON.parse(localStorage.getItem(STORAGE_KEY_QUESTIONS) || '[]')
  taskForm.value.questionIds = ids
  addedQuestions.value = questions
}

onMounted(async () => {
  
  loadFromLocalStorage()
  await fetchCourse()
  await fetchAllQuestions()

  const newQuestionStr = localStorage.getItem('newQuestion')
  if (newQuestionStr) {
    try {
      const newQuestion = JSON.parse(newQuestionStr)
      if (!taskForm.value.questionIds.includes(newQuestion.prob_id)) {
        taskForm.value.questionIds.push(newQuestion.prob_id)
        newQuestion.score = 10
        addedQuestions.value.push(newQuestion)
        saveToLocalStorage()
      }
      localStorage.removeItem('newQuestion')
    } catch (err) {
      console.error('新题目解析失败：', err)
    }
  }
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const questionBank = computed(() => {
  return drawerShowPri ? priQuestions.value : pubQuestions.value;
});
const filteredQuestions = computed(() => {
  return questionBank.value.filter(q =>
    q.content.toLowerCase().includes(searchText.value.toLowerCase())
  )
})
const pageSize = 10;
const currentPage = ref(1);
const pagedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredQuestions.value.slice(start, start + pageSize);
});
// 按题型分组展示
const groupedQuestions = computed(() => {
  const map = {}
  for (const q of addedQuestions.value) {
    if (!map[q.type]) map[q.type] = []
    map[q.type].push(q)
  }
  return map
})

const submitTask = async() => {
  if(!taskForm.value.name) {
    ElMessage.error('请填写任务名称')
    return
  }
  if(!chosenCourse.value) {
    ElMessage.error('请先选择课程')
    return
  }
  if(taskForm.value.questionIds.length === 0) {
    ElMessage.error('请至少添加一个题目')
    return
  }
  const res = await createTask(chosenCourse.value,localStorage.getItem('userId'),new Date().getTime(),new Date().getTime()+7*24*60*60*1000,taskForm.value.public,taskForm.value.name,false,taskForm.value.questionIds,addedQuestions.value.filter(q => q.score !== undefined).map(q => q.score));
  if(res.success) {
    ElMessage.success('任务创建成功')
    localStorage.removeItem(STORAGE_KEY_IDS)
    localStorage.removeItem(STORAGE_KEY_QUESTIONS)
    localStorage.removeItem('taskName')
    localStorage.removeItem('taskPublic')
    localStorage.removeItem('taskCourseId')
    localStorage.removeItem('taskCourseName')
    loadFromLocalStorage
    setTimeout(() => {
        router.back();
      }, 2000);
  } else {
    ElMessage.error(res.errorMsg)
  }
  // localStorage.removeItem(STORAGE_KEY_IDS)
  // localStorage.removeItem(STORAGE_KEY_QUESTIONS)
  // localStorage.removeItem('taskName')
  // localStorage.removeItem('taskPublic')
  // localStorage.removeItem('taskCourseId')
  // localStorage.removeItem('taskCourseName')
  // loadFromLocalStorage
}
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

.action-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(203, 203, 203, 0.8);
  border: none !important;
  border-radius: 25px !important;
  backdrop-filter: blur(5px);
  box-shadow: none !important;
  scale: 1.5;
  margin-left: 40px;
  margin-right: 40px;
  margin-top:20px;
}

.submit-btn {
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

.card {
  margin-bottom: 5px;
  background: rgba(255, 255, 255, 0.1) !important;
  border: none !important;
}

.cardWord {
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 10px;
  display: inline-block;
  width: 150px;
  color: #c5c5c5;
}

.drawer-card-word {
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 10px;
  display: inline-block;
  width: 60px;
  color: #525252;
}

.cardButton {
  margin-top: -50px;
  height: 90px;
  width: 100px;
  margin-bottom: -50px;
  margin-right: -22px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(82, 82, 82, 0.8);
  border: none !important;
  border-radius: 25px !important;
  backdrop-filter: blur(5px);
  box-shadow: none !important;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  display: flex;
  flex-wrap: wrap;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-right: 10px;
}

.section-title {
  color: #c5c5c5;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.empty-tip {
  color: #c5c5c5;
  font-size: 1.2rem;
  text-align: center;
  padding: 20px;
}

.group-title {
  color: #c5c5c5;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.question-group {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.question-card {
  margin: 10px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #c5c5c5;
}

.option-list {
  padding-left: 20px;
  list-style-type: disc;
  color: #c5c5c5;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #525151 !important;
}

:deep(.el-switch__core) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

:deep(.el-drawer) {
  background-color: rgba(0, 0, 0, 0.9) !important;
}

:deep(.el-drawer__header) {
  color: #c5c5c5 !important;
}

:deep(.el-pagination) {
  color: #c5c5c5 !important;
}

:deep(.el-pagination .el-pagination__total),
:deep(.el-pagination .el-pagination__jump) {
  color: #c5c5c5 !important;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #c5c5c5 !important;
}

:deep(.el-pagination .el-pager li) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #c5c5c5 !important;
}

:deep(.el-pagination .el-pager li.active) {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
}

</style>

