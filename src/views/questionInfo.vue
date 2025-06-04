<template>
  <NavBar />
  <div class="background-layer">
    <h1 :style="{ 'margin-top': distance }" class="questionTitle" @click="scrollToTop">{{ questionInfo.description }}</h1>
    <p :style="{ opacity: contentOpacity }" class="questionInfoContent">题目类型：{{ getTypeName(questionInfo.type) }}</p>
    <p :style="{ opacity: contentOpacity }" class="questionInfoContent">创建者：{{ questionInfo.creator_name }}</p>
    <p :style="{ opacity: contentOpacity }" class="questionInfoContent">是否公开：{{ questionInfo.is_public ? '是' : '否' }}</p>

    <el-button
      class="register-btn"
      :style="{ top: distanceOfButton }"
      @mouseenter="registerMouseEnter"
      @mouseleave="registerMouseLeave"
      @click="() => router.push('/questions')"
    >->返回题目列表</el-button>
  </div>

  <div class="tabs-container">
    <el-tabs v-model="currentTab" class="main-tabs">
      <el-tab-pane v-for="tab in navItems" :key="tab" :name="tab">
        <template #label>
          <span class="component-title" @click="scrollToPos">{{ tab }}</span>
        </template>
        <!-- 题目选项 -->
        <template v-if="tab === '题目选项'">
          <div class="content-section">
            <h2>题目选项</h2>
            <div v-if="parsedOptions.length">
              <div v-for="(option, idx) in parsedOptions" :key="idx" class="option-item">
                <span class="option-key">{{ optionLabels[idx] }}:</span>
                <span class="option-value">{{ option }}</span>
              </div>
            </div>
            <p v-else>无选项</p>
          </div>
        </template>

        <!-- 答案 -->
        <template v-else-if="tab === '答案'">
          <div class="content-section">
            <h2>答案</h2>
            <p>{{ questionInfo.answer }}</p>
          </div>
        </template>

        <!-- 解析 -->
        <template v-else-if="tab === '解析'">
          <div class="content-section">
            <h2>解析</h2>
            <p>{{ questionInfo.analysis || '暂无解析' }}</p>
          </div>
        </template>
      </el-tab-pane>
      <div style="height: 45vh;"></div>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRoute, useRouter } from 'vue-router';
import { animate } from 'animejs';
import {getQuestionInfo,getUserInfoById,getTeacherNameById} from '../js/api';



const user = ref({});
const userId = localStorage.getItem('userId');
const getUserInfo = async () => {
  console.log('开始获取用户信息', localStorage.getItem('userId'));
  const res = await getUserInfoById(localStorage.getItem('userId'));
  console.log('获取用户信息:', res);
  user.value = res;
  console.log(user.value);
}
const fetchQuesitonInfo =async ()=>{
  console.log('开始获取题目id',route.params.id,'的信息');
  const res = await getQuestionInfo(route.params.id);
  questionInfo.value = res;
  console.log('题目的信息为',questionInfo.value);
  const TeacherName = await getTeacherNameById(questionInfo.value.creator_id);
  console.log('创建者id',questionInfo.value.creator_id);
  console.log('创建老师名称',TeacherName);
  questionInfo.value.creator_name = TeacherName;
}
// 根据题目类型返回中文名称
function getTypeName(type) {
  switch (type) {
    case 0:
      return '选择题';
    case 1:
      return '填空题';
    case 2:
      return '简答题';
    case 3:
      return '编程题';
    default:
      return '未知类型';
  }
}

const route = useRoute();
const router = useRouter();
const questionId = ref(0);

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

const scrollToPos = () => {
  window.scrollTo({
    top: 500,
    behavior: 'smooth'
  });
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 题目信息（写死）
const questionInfo = ref({});

const navItems = ['题目选项', '答案', '解析'];
const currentTab = ref('题目选项');

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
const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const parsedOptions = computed(() => {
  if (!questionInfo.value.content) return [];
  let arr = [];
  try {
    arr = JSON.parse(questionInfo.value.content);
  } catch (e) {
    // 兼容后端返回已是数组的情况
    arr = Array.isArray(questionInfo.value.content) ? questionInfo.value.content : [];
  }
  return arr;
});
onMounted(async () => {
  () => {questionId.value = route.params.id;window.addEventListener('scroll', handleScroll);}
  await getUserInfo();
  fetchQuesitonInfo();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
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

.questionTitle {
  position: relative;
  color: rgb(206, 206, 206);
  font-size: 4rem;
  text-align: left;
  margin-left: 80px;
  font-weight: bold;
}

.questionInfoContent {
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

.tabs-container {
  position: relative;
  top: 600px;
  max-height: calc(100vh - 170px);
  overflow-y: auto;
  z-index: 1;
  background-color: rgb(255, 255, 255, 0.05);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.main-tabs :deep(.el-tabs__header) {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: transparent;
}

.component-title {
  color: #c5c5c5;
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 80px;
  margin-right: 80px;
}

.content-section {
  margin: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #c5c5c5;
}

.content-section h2 {
  color: #fff;
  margin-bottom: 15px;
}

.option-item {
  margin: 10px 0;
  display: flex;
  gap: 10px;
}

.option-key {
  font-size: 1.5rem;
  color: #ffd04b;
}

.option-value {
  color: #c5c5c5;
  font-size: 1.5rem;
}
p{
  font-size: 1.5rem;
}
</style> 