<template>
  <NavBar active="3"/>
  <div class="tasks-container">
    <div class="tasks-header">
      <div class="title">任务列表</div>
      <div class="options">
        <el-radio-group v-model="viewMode" size="large">
          <el-radio-button label="my">我的</el-radio-button>
          <el-radio-button label="all">全部</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="tasks-content">
      <div class="task-list">
        <el-card v-for="task in displayTasks" :key="task.id" class="task-card card-hover" @click="onTaskClick(task)">
          <div class="task-title">{{ task.title }}</div>
          <div class="task-meta"><span class="icon">🗓️</span>截止日期：{{ task.deadline }}</div>
          <div class="task-meta"><span class="icon">📍</span>任务类型：{{ task.type }}</div>
          <div class="task-desc">{{ task.desc }}</div>
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

// 视图模式：我的/全部
const viewMode = ref('my');

// 任务数据（写死）
const tasks = ref([
  { id: 1, title: '软件工程作业1', deadline: '2024-06-10', type: '编程', desc: '实现用例建模并提交文档' },
  { id: 2, title: '数据结构实验', deadline: '2024-06-12', type: '实验', desc: '链表相关实验报告' },
  { id: 3, title: '操作系统论文', deadline: '2024-06-15', type: '论文', desc: '进程调度算法分析' },
  { id: 4, title: '数据库设计', deadline: '2024-06-18', type: '设计', desc: 'ER图与关系模式设计' },
  { id: 5, title: '网络安全测试', deadline: '2024-06-20', type: '测试', desc: '渗透测试报告' },
  { id: 6, title: '人工智能项目', deadline: '2024-06-22', type: '项目', desc: 'AI小组项目展示' },
  { id: 7, title: '机器学习作业', deadline: '2024-06-25', type: '编程', desc: '实现决策树算法' },
  { id: 8, title: '深度学习实验', deadline: '2024-06-28', type: '实验', desc: '卷积神经网络实验' },
]);

// 过滤任务
const filteredTasks = computed(() => {
  if (viewMode.value === 'my') {
    // 我的任务：假设id为1,3,5,7为我的
    return tasks.value.filter(task => [1,3,5,7].includes(task.id));
  }
  return tasks.value;
});

// 分页
const currentPage = ref(1);
const pageSize = 4;
const displayTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTasks.value.slice(start, start + pageSize);
});

// 点击任务卡片
const onTaskClick = (task) => {
  alert('点击了任务：' + task.title);
};
</script>

<style scoped>
.tasks-container {
  background: linear-gradient(135deg, #f2f2f2 60%, #e0e0e0 100%);
  min-height: 100vh;
  padding: 24px 40px;
  overflow: hidden;
}
.tasks-header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}
.title {
  font-size: 28px;
  font-weight: bold;
  color: #222;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.title::before {
  content: '\1F4CB'; /* 📋 */
  font-size: 32px;
  margin-right: 6px;
}
.options {
  display: flex;
  align-items: center;
  gap: 24px;
}
.tasks-content {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px #e0e0e0;
}
.task-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  gap: 40px 20px;
  width: 100%;
  padding: 20px;
  align-items: stretch;
  justify-items: stretch;
}
.task-card {
  width: 85%;
  min-height: 100px;
  height: auto;
  background: linear-gradient(120deg, #f7f7f7 70%, #e3e3e3 100%);
  border: 1.5px solid #bbb;
  border-radius: 16px;
  box-shadow: 0 2px 12px #e0e0e0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 16px 16px 16px;
  transition: box-shadow 0.25s, transform 0.25s, background 0.25s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.task-card.card-hover:hover {
  box-shadow: 0 8px 32px #bbb;
  transform: translateY(-6px) scale(1.04);
  background: linear-gradient(120deg, #e0e0e0 60%, #cfcfcf 100%);
}
.task-title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.task-title::before {
  content: '\1F4DD'; /* 📝 */
  font-size: 22px;
  margin-right: 4px;
}
.task-meta {
  font-size: 15px;
  color: #444;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.task-desc {
  font-size: 15px;
  color: #666;
  margin-top: 8px;
}
.pagination-box {
  margin-top: 60px;
  text-align: right;
}
/**** 覆盖element主题色为黑白灰 ****/
:deep(.el-radio-button__inner) {
  background: #f5f5f5;
  color: #222;
  border: 1.5px solid #bbb;
  font-weight: 600;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background: #222;
  color: #fff;
  border-color: #222;
}
:deep(.el-radio-button__inner:hover) {
  background: #e0e0e0;
  color: #222;
  border-color: #888;
}
:deep(.el-pagination) {
  --el-color-primary: #222;
  --el-color-primary-light-3: #888;
  --el-color-primary-light-5: #bbb;
  --el-color-primary-light-7: #e0e0e0;
}
:deep(.el-pagination .el-pager li.is-active) {
  background: #222;
  color: #fff;
}
:deep(.el-pagination .el-pager li) {
  color: #222;
}
</style> 