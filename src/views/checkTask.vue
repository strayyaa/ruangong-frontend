<template>
  <NavBar />
  <div class="background-layer">
    <h1 :style="{ 'margin-top': distance }" class="taskTitle" @click="scrollToTop">{{ taskInfo.name }}（批改）</h1>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">学生：{{ studentInfo.name }}（ID: {{ studentInfo.id }}）</p>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">开始时间：{{ taskInfo.begin_time }}</p>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">截止时间：{{ taskInfo.end_time }}</p>
    <el-button
      class="register-btn"
      :style="{ top: distanceOfButton }"
      @mouseenter="registerMouseEnter"
      @mouseleave="registerMouseLeave"
      @click="router.push('/class/' + taskInfo.course_id)"
    >->返回班级页面</el-button>
  </div>

  <div class="content-container">
    <div v-for="(question, index) in taskInfo.questions" :key="question.id" class="question-card">
      <div class="question-header">
        <h2>题目 {{ index + 1 }}</h2>
        <span class="score-label">总分：{{ taskInfo.scores[index] }}分</span>
      </div>
      <div class="question-content">
        <h3>{{ question.title }}</h3>
        <p class="question-description">{{ question.description }}</p>
        <!-- 选择题 -->
        <template v-if="question.type === '选择题'">
          <el-radio-group v-model="studentAnswers[question.id]" class="options-group" disabled>
            <el-radio 
              v-for="(option, key) in question.content" 
              :key="key" 
              :label="key"
              class="option-item"
            >
              <span class="option-label">{{ key }}: {{ option }}</span>
            </el-radio>
          </el-radio-group>
          <div class="auto-score">得分：{{ autoScores[index] }}分 <span v-if="autoScores[index] < taskInfo.scores[index]" style="color:#ffd04b">（错误，正确答案：{{ question.answer }}）</span></div>
        </template>
        <!-- 填空题 -->
        <template v-else-if="question.type === '填空题'">
          <el-input
            v-model="studentAnswers[question.id]"
            type="textarea"
            :rows="3"
            class="answer-input"
            readonly
          />
          <div class="auto-score">得分：{{ autoScores[index] }}分 <span v-if="autoScores[index] < taskInfo.scores[index]" style="color:#ffd04b">（错误，正确答案：{{ question.answer }}）</span></div>
        </template>
        <!-- 简答题 -->
        <template v-else-if="question.type === '简答题'">
          <el-input
            v-model="studentAnswers[question.id]"
            type="textarea"
            :rows="6"
            class="answer-input"
            readonly
          />
          <div class="manual-score">
            <el-input-number
              v-model="manualScores[index]"
              :min="0"
              :max="taskInfo.scores[index]"
              :step="1"
              label="得分"
              class="score-input"
            />
            <span style="margin-left:10px; color:#c5c5c5;">/ {{ taskInfo.scores[index] }}分</span>
          </div>
        </template>
      </div>
    </div>
    <div class="submit-section">
      <el-input
        v-model="finalComment"
        type="textarea"
        :rows="3"
        placeholder="任务整体评语（可选）"
        class="final-comment-input"
      />
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

const route = useRoute();
const router = useRouter();
const taskId = ref(0);

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

// 学生信息（写死）
const studentInfo = ref({
  id: 1001,
  name: '张三'
});

// 任务信息（写死）
const taskInfo = ref({
  id: 1,
  course_id: 101,
  creator_id: 201,
  begin_time: '2024-03-20 00:00:00',
  end_time: '2024-03-27 23:59:59',
  is_public: true,
  name: '第三章作业',
  is_multi: false,
  probs: [1, 2, 3, 4],
  scores: [30, 30, 40, 20],
  questions: [
    {
      id: 1,
      title: '二叉树遍历',
      type: '选择题',
      description: '给定一棵二叉树，输出其前序遍历序列。',
      content: {
        'A': '根-左-右',
        'B': '左-根-右',
        'C': '左-右-根',
        'D': '根-右-左'
      },
      answer: 'A'
    },
    {
      id: 2,
      title: '快速排序',
      type: '填空题',
      description: '请写出快速排序的平均时间复杂度。',
      answer: 'O(nlogn)'
    },
    {
      id: 3,
      title: '动态规划',
      type: '简答题',
      description: '请详细解释动态规划的基本思想和应用场景。'
    },
    {
      id: 4,
      title: '冒泡排序',
      type: '填空题',
      description: '请写出冒泡排序的最坏时间复杂度。',
      answer: 'O(n^2)'
    }
  ]
});

// 学生答案（写死）
const studentAnswers = ref({
  1: 'D',
  2: 'O(n^2)',
  3: '将复杂问题分解为子问题，递归求解并保存子问题结果。',
  4: 'O(n^2)'
});

// 自动批改得分（选择题、填空题）
const autoScores = ref([0, 0, 0, 0]);

// 主观题得分
const manualScores = ref([0, 0, 0, 0]);

// 评语
const comments = ref(['', '', '', '']);
const finalComment = ref('');

// 计算自动批改分数
const calcAutoScores = () => {
  taskInfo.value.questions.forEach((q, idx) => {
    if (q.type === '选择题') {
      autoScores.value[idx] = (studentAnswers.value[q.id] === q.answer) ? taskInfo.value.scores[idx] : 0;
    } else if (q.type === '填空题') {
      autoScores.value[idx] = (studentAnswers.value[q.id]?.replace(/\s/g, '').toLowerCase() === q.answer.replace(/\s/g, '').toLowerCase()) ? taskInfo.value.scores[idx] : 0;
    } else {
      autoScores.value[idx] = 0;
    }
  });
};

// 初始化主观题得分为满分
onMounted(() => {
  taskId.value = route.params.id;
  window.addEventListener('scroll', handleScroll);
  calcAutoScores();
  // 主观题初始分数为满分
  taskInfo.value.questions.forEach((q, idx) => {
    if (q.type === '简答题') {
      manualScores.value[idx] = taskInfo.value.scores[idx];
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 总分计算
const totalScore = computed(() => {
  let sum = 0;
  taskInfo.value.questions.forEach((q, idx) => {
    if (q.type === '简答题') {
      sum += manualScores.value[idx] || 0;
    } else {
      sum += autoScores.value[idx] || 0;
    }
  });
  return sum;
});

const submitCheck = () => {
  // 构造提交数据
  const scores = taskInfo.value.questions.map((q, idx) =>
    q.type === '简答题' ? manualScores.value[idx] : autoScores.value[idx]
  );
  const infos = comments.value;
  const data = {
    user_id: studentInfo.value.id,
    exer_id: taskInfo.value.id,
    scores,
    infos
  };
  ElMessage({
    message: '批改提交成功！',
    type: 'success',
    duration: 2000
  });
  // 这里可以添加实际提交逻辑
  console.log('批改提交数据：', data, '任务评语：', finalComment.value);
};

const registerMouseEnter = () => {
  animate('.register-btn', {
    scale: 1.2,
    backgroundColor: '#FFFFFF',
    color: 'rgba(0, 0, 0, 0.8)',
    duration: 300,
    easing: 'easeOutExpo'
  });
};

const registerMouseLeave = () => {
  animate('.register-btn', {
    scale: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(203, 203, 203, 0.8)',
    duration: 300,
    easing: 'easeOutExpo'
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
</style> 