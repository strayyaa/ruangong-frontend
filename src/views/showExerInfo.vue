<template>
    <NavBar />
    <div class="background-layer">
      <h1 :style="{ 'margin-top': distance }" class="taskTitle" @click="scrollToTop">{{ exer.name }}(任务信息)</h1>
      <p :style="{ opacity: contentOpacity }" class="taskInfoContent">{{ formatDate(exer.begin_time) }} ~ {{ formatDate(exer.end_time) }}</p>
      <p :style="{ opacity: contentOpacity }" class="taskInfoContent">是否可以多次提交：{{ exer.is_multi }}</p>
      <p :style="{ opacity: contentOpacity }" class="totalScore">总分：{{ totalMaxScore }}分</p>
    </div>
  
    <div class="content-container">
      <div v-for="(question, index) in questionList" :key="question.id" class="question-card">
        <div class="question-header">
          <h2>题目 {{ index + 1 }}</h2>
          <span class="score-label">总分：{{ maxScoresList[index] }}分</span>
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
            <el-radio-group v-model="question.answer" class="options-group">
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
              v-model="question.answer"
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
              v-model="question.answer"
              type="textarea"
              :rows="3"
              class="answer-input"
              @paste.prevent
              @copy.prevent
              @cut.prevent
            />
          </template>
          <h3 style="color: greenyellow;">题目解析:{{ question.analysis }}</h3>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import NavBar from '../components/NavBar.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { getUserInfoById, getExerAllinfoById,getExerQuestionById} from '../js/api';
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
        const ref = await getExerAllinfoById(route.params.exer_id);
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
      const response = await getExerQuestionById(route.params.exer_id);
      questionList.value = response || [];
      maxScoresList.value = questionList.value.map(q => q.score);
      // questionList.value.pop();
    } catch (error) {
      ElMessage.error('获取题目列表失败');
      console.error('获取题目列表失败:', error);
    }
  };
  
  const totalMaxScore = computed(() => {
    return maxScoresList.value.reduce((sum, score) => sum + (score || 0), 0);
  });
  
  onMounted(async () => {
    await getUserInfo();
    await fetchExerName();
    await fetchQuestionList();
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