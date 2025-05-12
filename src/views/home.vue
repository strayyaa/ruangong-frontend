<template>
  <NavBar />
  <div class="home-container">
    <!-- 顶部Tab区 -->
    <div class="tab-center-wrapper">
      <el-tabs
        v-model="activeTab"
        class="custom-tabs"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
          @mouseenter="hoverTab = tab.name"
          @mouseleave="hoverTab = ''"
        >
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 工作区内容 -->
    <div class="work-area">
      <!-- 待办区 -->
      <div v-if="activeTab === 'todo'" class="todo-area-flex">
        <!-- 左侧表格 -->
        <div class="todo-table-area">
          <div class="area-title">待办事项</div>
          <el-table
            :data="todoData.slice((todoPage-1)*todoPageSize, todoPage*todoPageSize)"
            border
            stripe
            style="width: 100%;min-height: 400px;"
            class="custom-table"
            @row-click="onTodoRowClick"
            row-class-name="todo-row"
          >
            <el-table-column prop="title" label="事项" />
            <el-table-column prop="status" label="状态" />
          </el-table>
          <div class="pagination-box">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="todoData.length"
              :page-size="todoPageSize"
              v-model:current-page="todoPage"
            />
          </div>
        </div>
        <!-- 右侧时间 -->
        <div class="todo-time-area">
          <Clock />
        </div>
      </div>

      <!-- 课程区 -->
      <div v-if="activeTab === 'course'" class="course-area">
        <div class="area-header">
          <div class="area-title">课程</div>
          <!-- 助教身份时显示身份切换按钮 -->
          <div v-if="isAssistant" class="role-switch-group">
            <el-button :type="courseRole==='student'?'primary':'default'" @click="courseRole='student'">作为学生</el-button>
            <el-button :type="courseRole==='assistant'?'primary':'default'" @click="courseRole='assistant'">作为助教</el-button>
          </div>
          <el-button v-if="isTeacher" type="primary" class="create-btn" @click="createCourse">创建课程</el-button>
          <el-button class="all-btn" @click="showAllCourses">全部</el-button>
        </div>
        <div class="course-list">
          <el-card v-for="course in courseData.slice(0, 4)" :key="course.id" class="course-card card-hover">
            <div class="course-title">{{ course.name }}</div>
            <div class="course-desc">{{ course.desc }}</div>
          </el-card>
        </div>
      </div>

      <!-- 任务区 -->
      <div v-if="activeTab === 'task'" class="task-area">
        <div class="area-header">
          <div class="area-title">我的任务</div>
          <el-button v-if="isTeacher" type="primary" class="create-btn" @click="createTask">创建任务</el-button>
          <el-button class="all-btn" @click="showAllTasks">全部</el-button>
        </div>
        <el-table :data="taskData" border stripe style="width: 100%">
          <el-table-column prop="title" label="任务标题" />
          <el-table-column prop="detail" label="任务详情" />
        </el-table>
      </div>

      <!-- 题目区 -->
      <div v-if="activeTab === 'question'" class="question-area">
        <div class="area-header">
          <div class="area-title">我的题目</div>
          <el-button v-if="isTeacher" type="primary" class="create-btn" @click="createQuestion">创建题目</el-button>
          <el-button class="all-btn" @click="showAllQuestions">全部</el-button>
        </div>
        <el-table :data="questionData" border stripe style="width: 100%">
          <el-table-column prop="title" label="题目标题" />
          <el-table-column prop="detail" label="题目详情" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import Clock from '../components/Clock.vue';
import { useRouter } from 'vue-router';
// 时间卡片组件
const TimeCard = {
  name: 'TimeCard',
  setup() {
    const now = ref(new Date());
    let timer = null;
    onMounted(() => {
      timer = setInterval(() => {
        now.value = new Date();
      }, 1000);
    });
    return { now };
  },
  template: `<div class='time-card'><div class='time-title'>当前时间</div><div class='time-value'>{{ now.toLocaleString() }}</div></div>`
};

// tabs配置
const tabs = [
  { name: 'todo', label: '待办' },
  { name: 'course', label: '课程' },
  { name: 'task', label: '任务' },
  { name: 'question', label: '题目' },
];
const activeTab = ref('todo');
const hoverTab = ref('');

// 用户身份（0老师，1学生，2助教）
const user = ref({ name: '张三', identity: 2 }); // 0老师 1学生 2助教
const isTeacher = computed(() => user.value.identity === 0);
const isAssistant = computed(() => user.value.identity === 2);

// 助教身份下课程区角色切换
const courseRole = ref('student'); // student/assistant

// 待办数据
const todoData = ref([
  { id: 1, title: '批改作业1', status: '未完成' },
  { id: 2, title: '批改作业2', status: '未完成' },
  { id: 3, title: '发布通知', status: '已完成' },
  { id: 4, title: '课程答疑', status: '未完成' },
  { id: 5, title: '整理资料', status: '未完成' },
  { id: 6, title: '准备课件', status: '未完成' },
]);
const todoPage = ref(1);
const todoPageSize = 4;

// 课程数据
const courseData = ref([
  { id: 1, name: '软件工程', desc: '软件开发流程与实践' },
  { id: 2, name: '数据结构', desc: '算法与数据结构基础' },
  { id: 3, name: '操作系统', desc: '操作系统原理' },
  { id: 4, name: '数据库', desc: '数据库设计与应用' },
]);

// 任务数据
const taskData = ref([
  { id: 1, title: '作业1', detail: '完成第1章课后题' },
  { id: 2, title: '作业2', detail: '完成第2章编程题' },
  { id: 3, title: '实验报告', detail: '提交实验报告' },
]);

// 题目数据
const questionData = ref([
  { id: 1, title: '选择题1', detail: '关于软件生命周期的题目' },
  { id: 2, title: '编程题1', detail: '实现链表反转' },
  { id: 3, title: '简答题1', detail: '简述进程与线程的区别' },
]);

// tab切换
function handleTabClick(tab) {
  activeTab.value = tab.paneName;
}

// 创建按钮事件
function createCourse() {
  alert('创建课程');
}
function createTask() {
  alert('创建任务');
}
function createQuestion() {
  alert('创建题目');
}
function showAllCourses() {
  router.push('/courses');
}
function showAllTasks() {
  alert('显示全部任务');
}
function showAllQuestions() {
  alert('显示全部题目');
}

// 点击待办行
function onTodoRowClick(row) {
  alert('点击了：' + row.title);
}
</script>

<style scoped>
.home-container {
  background-size: cover;
  overflow: hidden;
  background: #fff;
  min-height: 100vh;
  padding: 24px 40px;
}
.tab-center-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}
.custom-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  min-width: unset;
  max-width: unset;
  padding: 0;
}
:deep(.el-tabs__header) {
  display: flex;
  justify-content: center;
  width: auto;
  margin: 0;
}
:deep(.el-tabs__nav) {
  display: flex;
  justify-content: center;
  width: auto;
  margin: 0;
}
:deep(.el-tabs__item) {
  color: #333;
  background: #f5f5f5;
  border-radius: 24px 24px 0 0;
  margin-right: 18px;
  font-size: 22px;
  font-weight: 500;
  height: 56px;
  line-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s, box-shadow 0.5s;
  box-sizing: border-box;
  padding: 0 0;
  min-width: 160px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.el-tabs__item:last-child) {
  margin-right: 0;
}
:deep(.el-tabs__item.is-active),
:deep(.el-tabs__item):hover {
  background: #222;
  color: #fff;
  box-shadow: 0 4px 16px #eaeaea;
}
:deep(.el-tabs__active-bar) {
  display: none !important;
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
.role-switch-group {
  display: flex;
  gap: 0;
  border: 2px solid #3a8ee6;
  border-radius: 18px;
  overflow: hidden;
  margin-right: 24px;
  height: 48px;
}
.role-switch-group .el-button {
  border: none;
  border-radius: 0;
  font-size: 22px;
  height: 48px;
  min-width: 140px;
  background: #f5f5f5;
  color: #333;
  transition: background 0.2s, color 0.2s;
  margin: 0 !important;
  padding: 0 32px;
  font-weight: 700;
  box-shadow: none;
}
.role-switch-group .el-button.el-button--primary {
  background: #409eff;
  color: #fff;
}
.role-switch-group .el-button:not(.el-button--primary):hover {
  background: #e0e0e0;
  color: #222;
}

.work-area {
  background: #fafafa;
  border-radius: 16px;
  padding: 32px 40px;
  min-height: 500px;
  box-shadow: 0 2px 8px #eee;
}

.todo-area-flex {
  display: flex;
  gap: 32px;
  height: 280px;
}
.todo-table-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 0;
  min-height:500px;
}
.todo-time-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.time-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px #eaeaea;
  padding: 40px 32px;
  text-align: center;
  width: 100%;
  max-width: 320px;
}
.time-title {
  font-size: 20px;
  color: #222;
  margin-bottom: 16px;
  font-weight: 600;
}
.time-value {
  font-size: 28px;
  color: #333;
  font-family: monospace;
}

.area-title {
  font-size: 24px;
  font-weight: bold;
  color: #222;
  margin-bottom: 20px;
}
.area-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.create-btn {
  margin-left: 16px;
}
.all-btn {
  background: #333;
  color: #fff;
  border: none;
  margin-left: 16px;
}
.course-list {
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 50px 20px;
  width: 100%;
  height: 360px;
  align-items: stretch;
  justify-items: stretch;
}
.course-card {
  width: 85%;
  min-height: 120px;
  height: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 16px;
  box-shadow: 0 1px 8px #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16px;
  transition: box-shadow 0.25s, transform 0.25s;
  cursor: pointer;
}
.course-card.card-hover:hover {
  box-shadow: 0 8px 32px #bbb;
  transform: translateY(-6px) scale(1.04);
}
.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
}
.course-desc {
  color: #666;
  font-size: 14px;
}
.pagination-box {

  margin-left: 70%;
  margin-top: 14px;
}

/**** 表格美化 ****/
.custom-table {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px #eaeaea;
  transition: box-shadow 0.2s;
}
:deep(.el-table__body tr.todo-row) {
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
}
:deep(.el-table__body tr.todo-row:hover) {
  background: #f0f2f5 !important;
  box-shadow: 0 2px 12px #eaeaea;
}
:deep(.el-table__body tr.todo-row:active) {
  background: #e0e0e0 !important;
  box-shadow: 0 2px 16px #bdbdbd;
}
:deep(.el-table__row) {
  border-radius: 12px;
  transition: background 0.18s, box-shadow 0.18s;
}
:deep(.el-table__row:hover) {
  background: #f0f2f5 !important;
}
:deep(.el-table__row:active) {
  background: #e0e0e0 !important;
}
:deep(.el-table) {
  border-radius: 16px;
  overflow: hidden;
}
:deep(.el-table__cell) {
  font-size: 17px;
  padding: 14px 12px;
}
</style>
