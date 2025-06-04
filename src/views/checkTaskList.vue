<template>
  <NavBar />
  <div class="background-layer">
    <h1 class="mainTitle">批改任务总览</h1>
  </div>
  <div class="tabs-container">
    <div class="module-content">
      <h2 class="module-title">未批改学生列表（剩余 {{ studentList.length }} 人）</h2>
      <div v-if="studentList.length > 0" class="card-list">
        <el-card v-for="stu in studentList" :key="stu.user_id" class="card">
          <div class="card-row">
            <div class="card-info">
              <span class="cardWord">姓名：{{ stu.name }}</span>
              <span class="cardWord">学号：{{ stu.username }}</span>
            </div>
            <div class="card-actions">
              <el-button class="cardButton" @click="goToCheck(stu.user_id)">去批改</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div v-else class="no-data">
        <el-empty description="暂无未批改学生" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from '../components/NavBar.vue';
import { ElMessage } from 'element-plus';
import { getUnmarkedStudents } from '../js/api';

const route = useRoute();
const router = useRouter();
const exer_id = ref(route.params.exer_id);

const studentList = ref([]);

const fetchStudentList = async () => {
  try {
    console.log('当前批改的任务id为',route.params.id)
    const res = await getUnmarkedStudents(route.params.id);
    studentList.value = res.data || [];
  } catch (e) {
    ElMessage.error('获取未批改学生列表失败');
  }
};

const goToCheck = (user_id) => {
  console.log('任务id是',exer_id.value,'学生id是',user_id);
  router.push(`/checkTask/${route.params.id}/${user_id}`);
};
onMounted(
  fetchStudentList
);
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
.mainTitle {
  color: rgb(206, 206, 206);
  font-size: 3.5rem;
  font-weight: bold;
  margin-left: 80px;
  margin-top: 120px;
  margin-bottom: 40px;
}

/* 复制 classInfo 的 tabs-container 样式 */
.tabs-container {
  position: relative;
  top: 200px; /* 根据顶部标题高度调整 */
  max-height: calc(100vh - 250px); /* 根据顶部标题和底部留白调整 */
  overflow-y: auto;
  z-index: 1;
  background-color: rgb(255, 255, 255, 0.05);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  padding: 0 80px;
}

.tabs-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari 和新版 Edge */
}

/* 复制 classInfo 的 main-tabs 样式并调整居中分布 */
.main-tabs :deep(.el-tabs__header) {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: transparent; /* 可自定义背景 */
  display: flex; /* 启用 Flexbox */
  justify-content: center; /* 水平居中 */
  width: 100%; /* 宽度占满容器 */
}

.main-tabs :deep(.el-tabs__nav) {
    width: 100%; /* 导航区域宽度占满 */
    display: flex; /* 启用 Flexbox */
    justify-content: space-around; /* 子项（Tab Items）均匀分布 */
}

.main-tabs :deep(.el-tabs__item) {
   flex-basis: 0; /* Tab 项的基础宽度为0 */
   flex-grow: 1; /* Tab 项平均分配剩余空间 */
   text-align: center; /* Tab 项内部文字居中 */
   padding: 0; /* 移除默认内边距 */
   /* 其他样式保持原样或微调 */
   color: #c5c5c5;
   font-size: 1.5rem;
   font-weight: bold;
   height: 50px; /* 根据需要调整 */
   line-height: 50px; /* 根据需要调整 */
}


/* 复制 classInfo 的 component-title 样式并调整居中 */
.component-title {
  color: inherit; /* 继承父元素的颜色 */
  font-size: 1.5rem;
  font-weight: bold;
  /* margin已通过el-tabs__item的padding和justify-content调整 */
}

/* 模块内容容器，增加内边距 */
.module-content {
  padding: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.module-title {
  color: #ffd04b;
  font-size: 2rem;
  font-weight: bold;
  margin-left: 10px;
}

.module-actions .all-button, .module-actions .create-button {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(203, 203, 203, 0.8);
    border: none;
    padding: 8px 15px;
    font-size: 1rem;
    border-radius: 15px;
    transition: background 0.2s, color 0.2s;
}

.module-actions .all-button:hover, .module-actions .create-button:hover {
    background: rgba(255, 255, 255, 0.3);
    color: rgb(206, 206, 206);
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  align-items: stretch;
}
.card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  min-width: 0; /* 让grid自适应 */
  max-width: 100%;
  height: 140px; /* 固定高度，保证整齐 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.card:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
}
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0 10px 10px;
}
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-right: 10px;
  justify-content: center;
  height: 100%;
}
.cardWord {
  color: #c5c5c5;
  font-size: 1.2rem;
  font-weight: bold;
}
.cardButton {
  margin-left: 9px;
  background: #ffd04b;
  color: #222;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 8px 18px;
  transition: background 0.2s, color 0.2s;
}
.cardButton:hover {
  background: #fff;
  color: #222;
}


.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
</style> 