<template>
  <NavBar active="3"/>
  <div class="background-layer">
    <h1 class="mainTitle">任务列表</h1>
  </div>

  <div class="content-container">
    <div class="tasks-header">
      <div class="options">
        <el-radio-group v-model="viewMode" size="large">
          <el-radio-button label="my">我的</el-radio-button>
          <el-radio-button label="all">全部</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="tasks-content">
      <div class="task-list">
        <el-card v-for="task in displayTasks" :key="task.id" class="card card-hover" @click="onTaskClick(task)">
          <div class="card-info">
            <span class="cardWord">{{ task.title }}</span>
            <span class="cardWord">截止日期：{{ task.deadline }}</span>
            <span class="cardWord">任务类型：{{ task.type }}</span>
            <span class="cardWord">{{ task.desc }}</span>
          </div>
        </el-card>
      </div>
      <div class="pagination-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredTasks.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 视图模式：我的/全部
const viewMode = ref('my');

// 任务数据（写死）
const tasks = ref([
  { id: 1, title: '软件工程作业1', deadline: '2024-06-10', type: '编程', desc: '实现用例建模并提交文档', is_private: true }, // 私有任务
  { id: 2, title: '数据结构实验', deadline: '2024-06-12', type: '实验', desc: '链表相关实验报告', is_private: false }, // 公开任务
  { id: 3, title: '操作系统论文', deadline: '2024-06-15', type: '论文', desc: '进程调度算法分析', is_private: true }, // 私有任务
  { id: 4, title: '数据库设计', deadline: '2024-06-18', type: '设计', desc: 'ER图与关系模式设计', is_private: false }, // 公开任务
  { id: 5, title: '网络安全测试', deadline: '2024-06-20', type: '测试', desc: '渗透测试报告', is_private: true }, // 私有任务
  { id: 6, title: '人工智能项目', deadline: '2024-06-22', type: '项目', desc: 'AI小组项目展示', is_private: false }, // 公开任务
  { id: 7, title: '机器学习作业', deadline: '2024-06-25', type: '编程', desc: '实现决策树算法', is_private: true }, // 私有任务
  { id: 8, title: '深度学习实验', deadline: '2024-06-28', type: '实验', desc: '卷积神经网络实验', is_private: false }, // 公开任务
]);

// 过滤任务 (保留原有身份逻辑)
const filteredTasks = computed(() => {
  if (viewMode.value === 'my') {
    // 我的任务：假设只显示私有任务
    return tasks.value.filter(task => task.is_private);
  }
  // 全部任务
  return tasks.value;
});

// 分页
const currentPage = ref(1);
const pageSize = 8; // 调整每页显示数量
const displayTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTasks.value.slice(start, start + pageSize);
});

// 点击任务卡片
const onTaskClick = (task) => {
   router.push(`/doTask/${task.id}`);
};
</script>

<style scoped>
.background-layer {
  position: fixed;
  height: 100vh;
  width: 100%;
  background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)),
              url('../assets/course_id_background.jpg'); /* 复用背景图 */
  background-size: cover;
  margin-top: -80px; /* 向上偏移以覆盖顶部 */
  margin-left: -8px; /* 向左偏移以覆盖左侧 */
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

.content-container {
  position: relative;
  top: 200px; /* 根据顶部标题和背景偏移调整 */
  padding: 20px 80px;
  background-color: rgba(255, 255, 255, 0.05); /* 半透明背景 */
  min-height: calc(100vh - 250px); /* 确保内容区域有最小高度 */
  z-index: 1;
  overflow-y: auto; /* 允许滚动 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.content-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari 和新版 Edge */
}


.tasks-header {
  display: flex;
  justify-content: flex-start; /* 选项靠左 */
  align-items: center;
  margin-bottom: 32px;
  padding: 0 10px; /* 与卡片列表内边距对齐 */
}

.options {
  display: flex;
  align-items: center;
  gap: 24px;
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 自适应列宽 */
  gap: 24px; /* 行间距和列间距 */
  width: 100%;
  padding: 0 10px; /* 调整内边距 */
  box-sizing: border-box; /* 将内边距计算在宽度内 */
}

.card {
  background-color: rgba(255, 255, 255, 0.1); /* 卡片背景半透明 */
  border-radius: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08); /* 阴影调整 */
  display: flex;
  flex-direction: column; /* 内容纵向排列 */
  justify-content: center;
  align-items: flex-start;
  padding: 16px; /* 内边距 */
  cursor: pointer;
}
.card-hover:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18); /* 悬停阴影调整 */
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 行间距 */
  width: 100%; /* 宽度占满 */
}

.cardWord {
  color: #c5c5c5; /* 文字颜色调整 */
  font-size: 1.2rem;
  font-weight: bold;
}


.pagination-box {
  margin-top: 40px; /* 调整间距 */
  text-align: center; /* 居中 */
}

/**** 覆盖element主题色为黑白灰 ****/
:deep(.el-radio-button__inner) {
  background: #f5f5f5; /* 按钮背景色 */
  color: #222; /* 按钮文字颜色 */
  border: 1.5px solid #bbb; /* 按钮边框颜色 */
  font-weight: 600;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background: #222; /* 选中时的背景色 */
  color: #fff; /* 选中时的文字颜色 */
  border-color: #222; /* 选中时的边框颜色 */
}

:deep(.el-radio-button__inner:hover) {
  background: #e0e0e0; /* 悬停时的背景色 */
  color: #222; /* 悬停时的文字颜色 */
  border-color: #888; /* 悬停时的边框颜色 */
}

:deep(.el-pagination) {
  --el-color-primary: #ffd04b; /* 主题色 */
  --el-color-primary-light-3: #ffecb3; /* 浅色主题色 */
  --el-color-primary-light-5: #fff3e0;
  --el-color-primary-light-7: #fff8f0;
  color: #c5c5c5; /* 文字颜色 */
}
:deep(.el-pagination .el-pager li) {
  background-color: rgba(255, 255, 255, 0.1); /* 页码背景 */
  color: #c5c5c5; /* 页码文字颜色 */
  border-radius: 4px;
  margin: 0 4px;
  min-width: 30px;
}
:deep(.el-pagination .el-pager li:hover) {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}
:deep(.el-pagination .el-pager li.is-active) {
  background: #ffd04b; /* 激活页码背景 */
  color: #222; /* 激活页码文字颜色 */
  font-weight: bold;
}
:deep(.el-pagination .btn-prev, .el-pagination .btn-next) {
   background-color: rgba(255, 255, 255, 0.1); /* 前后按钮背景 */
   color: #c5c5c5; /* 前后按钮颜色 */
   border-radius: 4px;
}
:deep(.el-pagination .btn-prev:hover, .el-pagination .btn-next:hover) {
   background-color: rgba(255, 255, 255, 0.2);
   color: #fff;
}

</style> 