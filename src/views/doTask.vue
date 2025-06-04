<template>
  <NavBar />
  <div class="background-layer">
    <h1 :style="{ 'margin-top': distance }" class="taskTitle" @click="scrollToTop">{{ exer.name }}</h1>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">{{ formatDate(exer.begin_time) }} ~ {{ formatDate(exer.end_time) }}</p>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">是否可以多次提交：{{ exer.is_multi }}</p>
    <p :style="{ opacity: contentOpacity }" class="totalScore">总分：{{ totalMaxScore }}分</p>
  </div>

  <div class="content-container">
    <div v-for="(question, index) in questionList" :key="question.id" class="question-card">
      <div class="question-header">
        <h2>题目 {{ index + 1 }}</h2>
        <div class="header-right">
          <span class="score-label">总分：{{ maxScoresList[index] }}分</span>
          <el-button
            class="star-button"
            :class="{ 'is-collected': isCollected(question.prob_id) }"
            @click="toggleCollect(question.prob_id)"
          >
            <el-icon v-if="isCollected(question.prob_id)"><StarFilled /></el-icon>
            <el-icon v-else><Star /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="question-content">
        <h3>
          {{ question.description }}
          <span style="font-size:1rem;color:#ffd04b;margin-left:16px;">
            [{{ typeMap[question.type] }}]
          </span>
        </h3>
        <!-- 选择题 -->
        <template v-if="question.type === 0">
          <el-radio-group v-model="studentAnswers[index]" class="options-group">
            <el-radio 
              v-for="(option, key) in JSON.parse(question.content)" 
              :key="key" 
              :label="String.fromCharCode(65 + parseInt(key))"
              class="option-item"
            >
              <span class="option-label">{{ String.fromCharCode(65 + parseInt(key)) }}: {{ option }}</span>
            </el-radio>
          </el-radio-group>
          <!-- <div class="auto-score">得分：{{ scoreList[index] }}分 <span v-if="scoreList[index] < maxScoresList[index]" style="color:#ffd04b">（错误，正确答案：{{question.answer}}）</span></div> -->
        </template>
        <!-- 填空题 -->
        <template v-else-if="question.type === 1">
          <el-input
            v-model="studentAnswers[index]"
            type="textarea"
            :rows="1"
            class="answer-input"
            @paste.prevent
            @copy.prevent
            @cut.prevent
          />
        </template>
        <!-- 简答题和编程题 -->
        <template v-else>
          <el-input
            v-model="studentAnswers[index]"
            type="textarea"
            :rows="3"
            class="answer-input"
            @paste.prevent
            @copy.prevent
            @cut.prevent
          />
        </template>
      </div>
    </div>
    <div class="submit-section">
      <el-button 
        type="primary" 
        size="large"
        @click="saveAnswer"
        
      >
        暂存答案
      </el-button>
      <el-button 
        type="primary" 
        size="large"
        @click="submitTask"
        color="#ffd04b"
      >
        提交任务
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed,toRaw  } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Star, StarFilled } from '@element-plus/icons-vue'
import { getUserInfoById, getExerAllinfoById, getExerQuestionById, pushCollectProblem, deleteCollectProblem, getCollectProblem,saveExerciseAnswer,submitExercise } from '../js/api';
// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const route = useRoute();
const router = useRouter();
const userId = localStorage.getItem('userId');
const user = ref({});
const getUserInfo = async () => {
  console.log('开始获取用户信息', userId);
  const res = await getUserInfoById(userId);
  console.log('获取用户信息:', res);
  user.value = res;
};
const exer = ref({});
const fetchExerName= async ()=>{
    try {
      const ref = await getExerAllinfoById(route.params.id);
      console.log('获取任务名称:', ref);
      exer.value = ref;
      // 初始化题目列表
    } catch (error) {
      ElMessage.error('获取任务名称失败');
      console.error('获取任务名称失败:', error);
    }
}
const questionList = ref([]);
const studentAnswers = ref([]);
const maxScoresList = ref([]);
const typeMap = ['选择', '填空', '简答', '编程'];
const fetchQuestionList = async () => {
  try {
    const response = await getExerQuestionById(route.params.id);
    questionList.value = response || [];
    studentAnswers.value = new Array(questionList.value.length).fill("");
    maxScoresList.value = questionList.value.map(q => q.score);
  } catch (error) {
    ElMessage.error('获取题目列表失败');
    console.error('获取题目列表失败:', error);
  }
};
const submitTask = async () => {
  try {
    console.log('开始提交任务', route.params.id, userId);
    const response = await submitExercise(route.params.id,userId);
    ElMessage.success('任务提交成功');
    router.back();
  } catch (error) {
    ElMessage.error('任务提交失败，请稍后再试');
    console.error('任务提交失败:', error);
  }
};
const saveAnswer = async () => {
  try {
    console.log('开始暂存任务', route.params.id, userId, studentAnswers.value);
    const response = await saveExerciseAnswer(route.params.id,userId,studentAnswers);
    ElMessage.success('任务暂存成功');
  } catch (error) {
    ElMessage.error('任务暂存失败，请稍后再试');
    console.error('任务暂存失败:', error);
  }
};
const totalMaxScore = computed(() => {
  return maxScoresList.value.reduce((sum, score) => sum + (score || 0), 0);
});

const collectedProblems = ref([]);

// 获取收藏题目列表
const fetchCollectedProblems = async () => {
  try {
    const res = await getCollectProblem(userId);
    console.log('获取收藏题目列表:', res);
    collectedProblems.value = res || [];
  } catch (error) {
    console.error('获取收藏题目列表失败:', error);
  }
};

// 判断题目是否已收藏
const isCollected = (probId) => {
  return collectedProblems.value.some(problem => problem.prob_id === probId);
};

// 切换收藏状态
const toggleCollect = async (probId) => {
  try {
    if (isCollected(probId)) {
      await deleteCollectProblem(probId, userId);
      collectedProblems.value = collectedProblems.value.filter(problem => problem.prob_id !== probId);
      ElMessage.success('取消收藏成功');
      console.log("取消收藏后的列表为",collectedProblems.value);
    } else {
      await pushCollectProblem(probId, userId);
      collectedProblems.value.push({ prob_id: probId });
      ElMessage.success('收藏成功');
      console.log("添加收藏后的列表为",collectedProblems.value);
    }
  } catch (error) {
    ElMessage.error('操作失败：' + error.message);
  }
};

onMounted(async () => {
  await getUserInfo();
  await fetchExerName();
  await fetchQuestionList();
  await fetchCollectedProblems();
});

const distance = ref('140px');
const distanceOfButton = ref('630px');
const contentOpacity = ref(1);

const handleScroll = () => {
  const currentScroll = window.pageYOffset;
  const scrollProgress = Math.min(currentScroll / 500, 1);
  distance.value = `${Math.max(140 - scrollProgress * 140, 80)}px`;
  distanceOfButton.value = `${Math.max(630 - currentScroll, 110)}px`;
  contentOpacity.value = Math.max(0, 1 - scrollProgress);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

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
.taskTitle {
  position: relative;
  color: rgb(206, 206, 206);
  font-size: 4rem;
  text-align: left;
  margin-left: 80px;
  font-weight: bold;
}
.taskInfoContent {
  position: relative;
  color: rgb(206, 206, 206);
  font-size: 1.5rem;
  text-align: left;
  margin-top: 20px;
  margin-left: 80px;
  max-width: 800px;
}
.register-btn {
  position: absolute;
  right: 40px;
  bottom: 60px;
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(203, 203, 203, 0.8);
  border: none !important;
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 25px !important;
  backdrop-filter: blur(5px);
  box-shadow: none !important;
}
.content-container {
  position: relative;
  top: 600px;
  padding: 20px 80px;
  background-color: rgba(255, 255, 255, 0.05);
  min-height: calc(100vh - 600px);
}
.question-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.question-header h2 {
  color: #c5c5c5;
  font-size: 1.8rem;
  margin: 0;
}
.score-label {
  color: cyan;
  font-size: 1.3rem;
  font-weight: bold;
}
.question-content {
  color: #c5c5c5;
  margin-bottom: 10px;
}
.question-content h3 {
  font-size: 1.6rem;
  margin-bottom: 15px;
  color: white;
}
.question-description {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: white;
}
.options-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  margin-left: 40px;
  margin-top: 20px;
}
.option-item {
  font-size: 1.35rem;
  color: #c5c5c5;
  align-items: center;
  display: flex;
}
.option-label {
  font-size: 1.35rem;
  color: rgb(206, 206, 206);
  font-weight: 500;
}
.answer-input {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #c5c5c5;
  font-size: 1.2rem;
}
.auto-score, .manual-score {
  margin-top: 15px;
  font-size: 1.3rem;
  color: cyan;
  font-weight: bold;
}
.score-input {
  width: 120px;
}
.comment-section {
  margin-top: 10px;
}
.comment-input {
  font-size: 1.2rem;
  width: 100%;
  background-color: rgba(255,255,255,0.08);
  color: #c5c5c5;
}
.final-comment-input {
  width: 100%;
  margin-bottom: 20px;
  background-color: rgba(255,255,255,0.08);
  color: #c5c5c5;
}
.submit-section {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;
}
.submit-section .el-button {
  padding: 15px 40px;
  font-size: 1.2rem;
}
.floating-score {
  position: fixed;
  right: 40px;
  bottom: 40px;
  background: rgba(0,0,0,0.7);
  color: cyan;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 18px 36px;
  border-radius: 18px;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  pointer-events: none;
}
.totalScore {
  position: relative;
  color: #ffd04b;
  font-size: 1.5rem;
  text-align: left;
  margin-top: 20px;
  margin-left: 80px;
  max-width: 800px;
  font-weight: bold;
}
/* 选中项的背景和字体颜色 */
:deep(.el-radio.is-checked .el-radio__inner) {
  border-color: #ffd04b !important;
  background-color: #ffd04b !important;
}

:deep(.el-radio.is-checked .el-radio__input) {
  color: #222 !important;
}

:deep(.el-radio.is-checked .option-label) {
  color: #ffd04b !important;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.star-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #c5c5c5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.star-button:hover {
  transform: scale(1.1);
}

.star-button.is-collected {
  color: #ffd04b;
}

.star-button i {
  font-size: 24px;
}

</style> 