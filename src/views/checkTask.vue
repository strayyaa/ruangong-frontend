<template>
  <NavBar />
  <div class="background-layer">
    <h1 :style="{ 'margin-top': distance }" class="taskTitle" @click="scrollToTop">{{ exer.name }}（批改）</h1>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">学生：{{ studentInfo.name }}（ID: {{ studentInfo.id }}）</p>
    <p :style="{ opacity: contentOpacity }" class="totalScore">总分：{{ totalMaxScore }}分</p>
  </div>

  <div class="content-container">
    <div v-for="(question, index) in questionList" :key="question.id" class="question-card">
      <div class="question-header">
        <h2>题目 {{ index + 1 }}</h2>
        <span class="score-label">总分：{{ maxScoresList[index] }}分</span>
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
          <div class="manual-score">
            <el-input-number
              v-model="scoreList[index]"
              :min="0"
              :max="maxScoresList[index]"
              :step="1"
              label="得分"
              class="score-input"
            />
            <span style="margin-left:10px; color:#c5c5c5;">/ {{ maxScoresList[index] }}分</span>
          </div>
        </template>
        <!-- 评语输入框 -->
        <div class="comment-section">
          <el-input
            v-model="comments[index]"
            type="textarea"
            :rows="2"
            placeholder="请输入评语"
            class="comment-input"
          />
        </div>
      </div>
    </div>
    <div class="submit-section">
      <el-button 
        type="primary" 
        size="large"
        @click="submitCheck"
      >
        提交批改
      </el-button>
    </div>
    <div class="floating-score">
      当前总分：{{ totalScore }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getCheckDetail, getUserInfoById, pushWrongQuestion, pushCheckInfo, getExerAllinfoById } from '../js/api';

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
// function getStudentAnswersIndexArray() {
//   return questionList.value.map((q, idx) => {
//     if (q.type === 0 && /^[A-D]$/.test(studentAnswers.value[idx])) {
//       return String("ABCD".indexOf(studentAnswers.value[idx]));
//     }
//     return studentAnswers.value[idx];
//   });
// }
// 获取批改详情
const fetchCheckDetail = async () => {
  console.log('开始获取批改任务详情，任务ID:', route.params.exer_id);
  const res = await getCheckDetail(route.params.exer_id, route.params.user_id);
  console.log('获取批改任务详情结果:', res);
  if (res) {
    questionList.value = res[0] || [];
    studentAnswers.value = res[4] || [];
    // getStudentAnswersIndexArray();
    comments.value = res[2] || [];
    maxScoresList.value = res[5] || [];
    ifCheckedList.value = res[3] || [];
    scoreList.value = res[1] || [];
    
    // 初始化评语数组
    if (!comments.value.length) {
      comments.value = new Array(questionList.value.length).fill('');
    }
    
    console.log('批改任务详情:', res);
  } else {
    ElMessage.error('获取批改任务详情失败');
  }
};

// 提交批改
const submitCheck = async () => {
  try {
    // 提交批改信息
    console.log('开始提交批改信息，用户ID:', route.params.user_id, '练习ID:', route.params.exer_id);
    console.log('提交的分数列表:', scoreList.value);
    console.log('提交的评语列表:', comments.value);
    await pushCheckInfo(route.params.user_id, route.params.exer_id, scoreList.value, comments.value);
    
    // 收集错题并提交
    const wrongQuestions = questionList.value
      .map((q, idx) => ({
        id: q.prob_id,
        score: scoreList.value[idx],
        maxScore: maxScoresList.value[idx]
      }))
      .filter(q => q.score < q.maxScore)
      .map(q => q.id);  // 取 id，这里就是 prob_id

    // 提交每个错题
    for (const prob_id of wrongQuestions) {

      try{
        await pushWrongQuestion(prob_id, route.params.exer_id, route.params.user_id);
      }catch (error) {
        continue; // 如果某个错题提交失败，继续处理下一个
      }
    }
    
    ElMessage({
      message: '批改提交成功！',
      type: 'success',
      duration: 2000
    });
    
    // 返回上一页
    router.back();
  } catch (error) {
    ElMessage.error('批改提交失败：' + error.message);
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

onMounted(async () => {
  await getUserInfo();
  await fetchCheckDetail();
  await fetchExerName();
  fetchStudentInfo();
  window.addEventListener('scroll', handleScroll);
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

</style> 