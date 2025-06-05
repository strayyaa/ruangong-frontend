<template>
  <NavBar />
  <div class="background-layer">
    <h1 :style="{ 'margin-top': distance }" class="taskTitle" @click="scrollToTop">{{ exer.name }}（批改反馈）</h1>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">学生：{{ studentInfo.name }}（ID: {{ studentInfo.id }}）</p>
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
        <h3>{{ question.description }}</h3>
        <!-- 选择题 -->
        <template v-if="question.type === 0">
          <el-radio-group v-model="studentAnswers[index]" class="options-group" disabled>
            <el-radio 
              v-for="(option, key) in JSON.parse(question.content)" 
              :key="key" 
              :label="String.fromCharCode(65 + parseInt(key))"
              class="option-item"
            >
              <span class="option-label">{{ String.fromCharCode(65 + parseInt(key)) }}: {{ option }}</span>
            </el-radio>
          </el-radio-group>
          <div class="auto-score">得分：{{ scoreList[index] }}分 <span v-if="scoreList[index] < maxScoresList[index]" style="color:#ffd04b">（错误，正确答案：{{question.answer}}）</span></div>
        </template>
        <!-- 填空题 -->
        <template v-else-if="question.type === 1">
          <el-input
            v-model="studentAnswers[index]"
            type="textarea"
            :rows="3"
            class="answer-input"
            readonly
          />
          <div class="auto-score">得分：{{ scoreList[index] }}分 <span v-if="scoreList[index] < maxScoresList[index]" style="color:#ffd04b">（错误，正确答案：{{ question.answer }}）</span></div>
        </template>
        <!-- 简答题和编程题 -->
        <template v-else>
          <el-input
            v-model="studentAnswers[index]"
            type="textarea"
            :rows="6"
            class="answer-input"
            readonly
          />
          <!-- <div class="manual-score">
            <el-input-number
              v-model="scoreList[index]"
              :min="0"
              :max="maxScoresList[index]"
              :step="1"
              label="得分"
              class="score-input"
            />
            <span style="margin-left:10px; color:#c5c5c5;">/ {{ maxScoresList[index] }}分</span>
          </div> -->
          <div class="auto-score">得分：{{ scoreList[index] }}分 <span v-if="scoreList[index] < maxScoresList[index]" style="color:#ffd04b">（错误，正确答案：{{ question.answer }}）</span></div>
        </template>
        <!-- 评语输入框 -->
        <div class="comment-section">
          <el-input
            v-model="comments[index]"
            type="textarea"
            :rows="2"
            placeholder="当前暂无评语"
            class="comment-input"
            readonly
          />
        </div>
      </div>
    </div>
    <div class="floating-score">
      当前总分：{{ totalScore }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Star, StarFilled } from '@element-plus/icons-vue'
import { getCheckDetail, getUserInfoById, getExerAllinfoById, pushCollectProblem, deleteCollectProblem, getCollectProblem } from '../js/api';

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
const studentInfo = ref({
  id: '',
  name: ''
});
const fetchStudentInfo = async () => {
  try {
    const res = await getUserInfoById(route.params.user_id);
    studentInfo.value.name = res.name;
    studentInfo.value.id = res.username;
  } catch (error) {
    console.error('获取学生信息失败:', error);
  }
};
const exer = ref({});
const fetchExerName= async ()=>{
    await getExerAllinfoById(route.params.exer_id).then(res=>{
        exer.value = res;
    }).catch(err=>{
        console.error('获取练习名称失败:', err);
    });
}
const questionList = ref([]);
const studentAnswers = ref([]);
const comments = ref([]);
const maxScoresList = ref([]);
const ifCheckedList = ref([]);
const scoreList = ref([]);
const collectedProblems = ref([]);

// 获取批改详情
const fetchCheckDetail = async () => {
  console.log('开始获取批改任务详情，任务ID:', route.params.exer_id);
  const res = await getCheckDetail(route.params.exer_id, route.params.user_id);
  console.log('获取批改任务详情结果:', res);
  if (res) {
    questionList.value = res[0] || [];
    // 初始化studentAnswers为空列表，长度与questionList一致
    studentAnswers.value = new Array(questionList.value.length).fill('');
    // 如果有学生答案，则更新对应位置
    if (res[4] && res[4].length > 0) {
      res[4].forEach((answer, index) => {
        if (index < studentAnswers.value.length) {
          studentAnswers.value[index] = answer;
        }
      });
    }
    comments.value = res[2] || [];
    maxScoresList.value = res[5] || [];
    ifCheckedList.value = res[3] || [];
    scoreList.value = res[1] || [];
    
    // 初始化评语数组
    if (!comments.value.length) {
      comments.value = new Array(questionList.value.length).fill('');
    }

    const hasUncheckedQuestions = ifCheckedList.value.includes(0);
    if (hasUncheckedQuestions) {
      ElMessage({
        message: '当前任务尚未批改完毕，请等待批改完成后再查看',
        type: 'warning',
        duration: 2000
      });
      setTimeout(() => {
        router.back();
      }, 2000);
      return;
    } else {
      console.log('全部批改完毕');
    }
    
    console.log('批改任务详情:', res);
  } else {
    ElMessage.error('获取批改任务详情失败');
  }
};

// 计算总分
const totalScore = computed(() => {
  return scoreList.value.reduce((sum, score) => sum + (score || 0), 0);
});

// 计算总分
const totalMaxScore = computed(() => {
  return maxScoresList.value.reduce((sum, score) => sum + (score || 0), 0);
});

// 获取收藏题目列表
const fetchCollectedProblems = async () => {
  try {
    const res = await getCollectProblem(route.params.user_id);
    console.log(  '获取收藏题目列表:', res);
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
      await deleteCollectProblem(probId,route.params.user_id);
      collectedProblems.value = collectedProblems.value.filter(problem => problem.prob_id !== probId);
      ElMessage.success('取消收藏成功');
      console.log("取消收藏后的列表为",collectedProblems.value);
    } else {
      await pushCollectProblem(probId,route.params.user_id);
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
  await fetchCheckDetail();
  await fetchExerName();
  await fetchCollectedProblems();
  fetchStudentInfo();
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