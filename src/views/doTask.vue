<template>
  <NavBar />
  <div class="background-layer">
    <h1 :style="{ 'margin-top': distance }" class="taskTitle" @click="scrollToTop">{{ taskInfo.name }}</h1>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">开始时间：{{ taskInfo.begin_time }}</p>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">截止时间：{{ taskInfo.end_time }}</p>
    <p :style="{ opacity: contentOpacity }" class="taskInfoContent">是否可重复提交：{{ taskInfo.is_multi ? '是' : '否' }}</p>

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
        <el-button 
          class="favorite-btn"
          :class="{ 'is-favorite': question.is_favorite }"
          @click="toggleFavorite(question.id)"
        >
          <el-icon>
            <component :is="question.is_favorite ? StarFilled : Star" />
          </el-icon>
        </el-button>
      </div>
      
      <div class="question-content">
        <h3>{{ question.title }}</h3>
        <p class="question-description">{{ question.description }}</p>
        
        <!-- 选择题 -->
        <template v-if="question.type === '选择题'">
          <el-radio-group v-model="answers[question.id]" class="options-group">
            <el-radio 
              v-for="(option, key) in question.content" 
              :key="key" 
              :label="key"
              class="option-item"
            >
              <span class="option-label">{{ key }}: {{ option }}</span>
            </el-radio>
          </el-radio-group>
        </template>

        <!-- 填空题 -->
        <template v-else-if="question.type === '填空题'">
          <el-input
            v-model="answers[question.id]"
            type="textarea"
            :rows="3"
            placeholder="请输入答案"
            class="answer-input"
          />
        </template>

        <!-- 简答题 -->
        <template v-else-if="question.type === '简答题'">
          <el-input
            v-model="answers[question.id]"
            type="textarea"
            :rows="6"
            placeholder="请输入答案"
            class="answer-input"
          />
        </template>
      </div>
    </div>

    <div class="submit-section">
      <el-button 
        type="primary" 
        size="large"
        @click="submitAnswers"
        :disabled="!canSubmit"
      >
        提交答案
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRoute, useRouter } from 'vue-router';
import { Star, StarFilled } from '@element-plus/icons-vue';
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
  probs: [1, 2, 3],
  scores: [30, 30, 40],
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
      is_favorite: false
    },
    {
      id: 2,
      title: '快速排序',
      type: '填空题',
      description: '请写出快速排序的平均时间复杂度。',
      is_favorite: false
    },
    {
      id: 3,
      title: '动态规划',
      type: '简答题',
      description: '请详细解释动态规划的基本思想和应用场景。',
      is_favorite: false
    },
    {
      id: 4,
      title: '冒泡排序',
      type: '填空题',
      description: '请写出冒泡排序的最坏时间复杂度。',
      is_favorite: false
    }
  ]
});

const answers = ref({});
const canSubmit = computed(() => {
  return taskInfo.value.questions.every(q => answers.value[q.id]);
});

const toggleFavorite = (questionId) => {
  const question = taskInfo.value.questions.find(q => q.id === questionId);
  if (question) {
    question.is_favorite = !question.is_favorite;
    ElMessage({
      message: question.is_favorite ? '收藏成功' : '取消收藏',
      type: 'success',
      duration: 2000
    });
  }
};

const submitAnswers = () => {
  // 这里添加提交答案的逻辑
  ElMessage({
    message: '提交成功',
    type: 'success',
    duration: 2000
  });
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

onMounted(() => {
  taskId.value = route.params.id;
  window.addEventListener('scroll', handleScroll);
  
  // 禁用复制粘贴
  document.addEventListener('copy', (e) => e.preventDefault());
  document.addEventListener('paste', (e) => e.preventDefault());
  document.addEventListener('cut', (e) => e.preventDefault());
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('copy', (e) => e.preventDefault());
  document.removeEventListener('paste', (e) => e.preventDefault());
  document.removeEventListener('cut', (e) => e.preventDefault());
});
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

.favorite-btn {
  background: transparent;
  border: none;
  color: #c5c5c5;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-btn.is-favorite {
  color: #ffd04b;
}

.question-content {
  color: #c5c5c5;
  margin-bottom: 10px;
}

.question-content h3 {
  font-size: 1.6rem;
  margin-bottom: 15px;
  color:white;
}

.question-description {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color:white;
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
}

.answer-input :deep(.el-textarea__inner) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #c5c5c5;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size:1.2rem
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
</style> 