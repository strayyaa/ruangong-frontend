<template>
  <NavBar />
  <div class="background-layer">
    <h1 class="mainTitle">首页</h1>
  </div>

  <div class="tabs-container">
    <el-tabs v-model="currentTab" class="main-tabs">
      <!-- 我的待办 Tab -->
      <el-tab-pane name="todo">
        <template #label>
          <span class="component-title">我的待办</span>
        </template>
        <div class="module-content">
          <h2 class="module-title">{{ isStudent ? '待完成任务' : '待批改任务' }}</h2>
          <div class="card-list">
            <el-card v-for="item in pagedTodoItems" :key="item.id" class="card">
              <div class="card-row">
                <div class="card-info">
                  <span class="cardWord">{{ item.title }}</span>
                  <span class="cardWord">{{ item.dueDate }}</span>
                </div>
                <div class="card-actions">
                  <el-button class="cardButton" @click="goToTodoItem(item)">查看详情</el-button>
                </div>
              </div>
            </el-card>
          </div>
          <el-pagination
            v-if="filteredTodoItems.length > pageSize"
            layout="prev, pager, next"
            :total="filteredTodoItems.length"
            :page-size="pageSize"
            :current-page="currentTodoPage"
            @current-change="handleTodoPageChange"
            style="margin-top: 20px; text-align: center;"
          />
        </div>
      </el-tab-pane>

      <!-- 课程模块 Tab -->
      <el-tab-pane name="courses">
        <template #label>
          <span class="component-title">我的课程</span>
        </template>
        <div class="module-content">
          <div class="module-header">
            <h2 class="module-title">我的课程</h2>
            <div class="module-actions">
              <el-button v-if="isTeacher" class="create-button" @click="createCourse">创建课程</el-button>
              <el-button class="all-button" @click="goToCourses">全部</el-button>
            </div>
          </div>
          <div class="card-list">
            <el-card v-for="course in courses.slice(0, displayLimit)" :key="course.id" class="card">
              <div class="card-row">
                <div class="card-info">
                  <span class="cardWord">{{ course.name }}</span>
                  <span class="cardWord">{{ course.teacher }}</span>
                  <span class="cardWord">{{ course.time }}</span>
                </div>
                <div class="card-actions">
                  <el-button class="cardButton" @click="goToCourse(course.id)">进入课程</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>

      <!-- 任务模块 Tab -->
      <el-tab-pane name="tasks">
        <template #label>
          <span class="component-title">我的任务</span>
        </template>
        <div class="module-content">
          <div class="module-header">
            <h2 class="module-title">我的任务</h2>
             <div class="module-actions">
              <el-button v-if="isTeacher" class="create-button" @click="createTask">创建任务</el-button>
              <el-button class="all-button" @click="goToTasks">全部</el-button>
            </div>
          </div>
          <div class="card-list">
            <el-card v-for="task in filteredTasks.slice(0, displayLimit)" :key="task.id" class="card">
              <div class="card-row">
                <div class="card-info">
                  <span class="cardWord">{{ task.name }}</span>
                  <span class="cardWord">{{ task.begin_time }} ~ {{ task.end_time }}</span>
                  <span class="cardWord">{{ task.status }}</span>
                </div>
                <div class="card-actions">
                  <el-button class="cardButton" @click="goToTask(task.id)">去完成</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>

      <!-- 题目模块 Tab -->
      <el-tab-pane name="questions">
        <template #label>
          <span class="component-title">我的题目</span>
        </template>
        <div class="module-content">
          <div class="module-header">
            <h2 class="module-title">我的题目</h2>
             <div class="module-actions">
              <el-button v-if="isTeacher" class="create-button" @click="createQuestion">创建题目</el-button>
              <el-button class="all-button" @click="goToQuestions">全部</el-button>
            </div>
          </div>
          <div class="card-list">
            <el-card v-for="question in filteredQuestions.slice(0, displayLimit)" :key="question.id" class="card">
              <div class="card-row">
                <div class="card-info">
                  <span class="cardWord">{{ question.title }}</span>
                  <span class="cardWord">{{ question.type }}</span>
                  <span class="cardWord">{{ question.status }}</span>
                </div>
                <div class="card-actions">
                  <el-button class="cardButton" @click="goToQuestion(question.id)">查看</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>

        <!-- 公告模块 Tab -->
      <el-tab-pane name="notices">
        <template #label>
          <span class="component-title">最新公告</span>
        </template>
        <div class="module-content">
           <div class="module-header">
             <h2 class="module-title">最新公告</h2>
             <div class="module-actions">
               <el-button class="all-button" @click="goToNotices">全部</el-button>
             </div>
           </div>
          <div class="card-list">
            <el-card v-for="notice in notices.slice(0, displayLimit)" :key="notice.id" class="card">
              <div class="card-row">
                <div class="card-info">
                  <span class="cardWord">{{ notice.title }}</span>
                  <span class="cardWord">{{ notice.time }}</span>
                </div>
                <div class="card-actions">
                  <el-button class="cardButton" @click="goToNotice(notice.id)">详情</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div style="height: 40px;"></div> <!-- 底部留白 -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();

const currentTab = ref('todo'); // 默认选中待办 Tab

// 模拟用户身份 (0老师, 1学生, 2助教)
const user = ref({ id: 1001, name: '张三', identity: 1 }); // 切换这里的identity来模拟不同身份
const isTeacher = computed(() => user.value.identity === 0);
const isStudent = computed(() => user.value.identity === 1);
const isAssistant = computed(() => user.value.identity === 2);

const displayLimit = 4; // 其他模块显示的卡片数量
const pageSize = 6; // 待办事项每页显示数量
const currentTodoPage = ref(1); // 待办事项当前页

// 模拟待办数据
const allTodoItems = ref([
  { id: 1, title: '完成第三章作业', dueDate: '2024-03-27', type: 'task', status: 'pending' }, // 学生待完成任务
  { id: 2, title: '批改实验一报告', dueDate: '2024-03-25', type: 'task', status: 'pending' }, // 老师/助教待批改任务
  { id: 3, title: '完成期中复习任务', dueDate: '2024-04-15', type: 'task', status: 'pending' }, // 学生待完成任务
  { id: 4, title: '批改第四章作业', dueDate: '2024-04-05', type: 'task', status: 'pending' }, // 老师/助教待批改任务
  { id: 5, title: '阅读计算机网络第五章', dueDate: '2024-03-30', type: 'reading', status: 'pending' }, // 学生其他待办
  { id: 6, title: '准备下周课程内容', dueDate: '2024-03-29', type: 'prep', status: 'pending' }, // 老师其他待办
  { id: 7, title: '回答学生问题', dueDate: '2024-03-26', type: 'question', status: 'pending' }, // 老师/助教其他待办
]);

// 根据身份过滤待办事项
const filteredTodoItems = computed(() => {
  if (isStudent.value) {
    // 学生：待完成任务 (这里简化为所有status为pending的type为task的待办)
    return allTodoItems.value.filter(item => item.type === 'task' && item.status === 'pending');
  } else if (isTeacher.value || isAssistant.value) {
    // 老师/助教：待批改任务 (这里简化为所有status为pending的type为task的待办)
     return allTodoItems.value.filter(item => item.type === 'task' && item.status === 'pending');
  } else {
    return [];
  }
});

// 待办事项分页
const pagedTodoItems = computed(() => {
  const start = (currentTodoPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredTodoItems.value.slice(start, end);
});

const handleTodoPageChange = (page) => {
  currentTodoPage.value = page;
};

const goToTodoItem = (item) => {
  // 根据待办类型跳转到对应页面
  ElMessage({
    message: `查看待办详情: ${item.title}`,
    type: 'info',
    duration: 2000
  });
  // 实际应用中，这里会根据item.type和item.id跳转到具体任务或问题页面
};


// 模拟课程数据 (老师/助教显示自己创建或负责的，学生显示自己选的)
const allCourses = ref([
  { id: 1, name: '计算机组成原理', teacher: '张老师', time: '周一 8:00-10:00', creator_id: 100, is_student: true, is_assistant: false },
  { id: 2, name: '数据结构', teacher: '李老师', time: '周三 10:00-12:00', creator_id: 101, is_student: true, is_assistant: true }, // 模拟学生也是助教
  { id: 3, name: '操作系统', teacher: '王老师', time: '周五 14:00-16:00', creator_id: 102, is_student: false, is_assistant: false }, // 模拟老师创建的课程
  { id: 4, name: '计算机网络', teacher: '赵老师', time: '周二 9:00-11:00', creator_id: 103, is_student: true, is_assistant: false },
]);

const courses = computed(() => {
  if (isStudent.value) {
    return allCourses.value.filter(course => course.is_student || course.is_assistant);
  } else if (isTeacher.value) {
    return allCourses.value.filter(course => course.creator_id === user.value.id);
  } else if (isAssistant.value) {
     // 助教显示自己负责的课程（这里简化为is_assistant为true的课程）
     return allCourses.value.filter(course => course.is_assistant);
  }
   return [];
});

// 模拟任务数据 (老师/助教显示自己创建或负责的，学生显示私有任务)
const allTasks = ref([
  { id: 1, name: '第三章作业', begin_time: '2024-03-20', end_time: '2024-03-27', status: '未完成', is_private: true, creator_id: 201 }, // 私有任务
  { id: 2, name: '实验一', begin_time: '2024-03-10', end_time: '2024-03-15', status: '已完成', is_private: false, creator_id: 202 }, // 公开任务
  { id: 3, name: '期中复习任务', begin_time: '2024-04-01', end_time: '2024-04-15', status: '未完成', is_private: true, creator_id: 201 }, // 私有任务
]);

const filteredTasks = computed(() => {
  if (isStudent.value) {
    return allTasks.value.filter(task => task.is_private); // 学生只看私有任务
  } else if (isTeacher.value || isAssistant.value) {
     return allTasks.value.filter(task => task.creator_id === user.value.id); // 老师/助教看自己创建的
  }
   return [];
});

// 模拟题目数据 (老师/助教显示自己创建的，学生显示私有题目)
const allQuestions = ref([
  { id: 1, title: '二叉树遍历', type: '选择题', status: '未完成', is_private: true, creator_id: 301 }, // 私有题目
  { id: 2, title: '动态规划', type: '简答题', status: '已完成', is_private: false, creator_id: 302 }, // 公开题目
  { id: 3, title: '链表操作', type: '编程题', status: '未完成', is_private: true, creator_id: 301 }, // 私有题目
]);

const filteredQuestions = computed(() => {
   if (isStudent.value) {
    return allQuestions.value.filter(question => question.is_private); // 学生只看私有题目
  } else if (isTeacher.value || isAssistant.value) {
     return allQuestions.value.filter(question => question.creator_id === user.value.id); // 老师/助教看自己创建的
  }
   return [];
});

// 模拟公告数据
const notices = ref([
  { id: 1, title: '清明节放假通知', time: '2024-04-01' },
  { id: 2, title: '期中考试安排', time: '2024-04-10' },
  { id: 3, title: '实验室开放通知', time: '2024-03-28' },
]);

// 路由跳转函数
const goToCourses = () => { router.push('/courses'); };
const goToCourse = (id) => { router.push(`/course/${id}`); };

const goToTasks = () => { router.push('/tasks'); };
const goToTask = (id) => { router.push(`/doTask/${id}`); }; // 跳转到做任务页面

const goToQuestions = () => { router.push('/questions'); };
const goToQuestion = (id) => { router.push(`/question/${id}`); }; // 跳转到题目详情页面

const goToNotices = () => { /* router.push('/notices'); */ ElMessage('跳转到公告列表页'); }; // 假设有公告列表页
const goToNotice = (id) => { /* router.push(`/notice/${id}`); */ ElMessage(`查看公告详情 ${id}`); }; // 假设有公告详情页

// 创建功能跳转 (仅老师可见)
const createCourse = () => { router.push('/createCourse'); }; // 假设有创建课程页面
const createTask = () => { router.push('/createTask'); };   // 假设有创建任务页面
const createQuestion = () => { router.push('/createQuestion'); }; // 假设有创建题目页面


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
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  min-width: 300px; /* 调整最小宽度以适应布局 */
  max-width: 400px; /* 调整最大宽度以适应布局 */
  flex: 1 1 300px; /* 调整 flex basis */
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
}
.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0 10px 10px;
}
.cardWord {
  color: #c5c5c5;
  font-size: 1.2rem;
  font-weight: bold;
}
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-right: 10px;
}
.cardButton {
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
</style>
