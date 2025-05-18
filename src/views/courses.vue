<template>
  <NavBar active="2"/>
  <div class="background-layer">
    <h1 class="mainTitle">课程列表</h1>
  </div>

  <div class="content-container">
    <div class="courses-header">
      <div class="options">
        <el-radio-group v-model="viewMode" size="large">
          <el-radio-button label="my">我的</el-radio-button>
          <el-radio-button label="all">全部</el-radio-button>
        </el-radio-group>
        <div v-if="isAssistant" class="role-switch-group">
          <el-button :type="courseRole==='student'?'primary':'default'" @click="courseRole='student'">作为学生</el-button>
          <el-button :type="courseRole==='assistant'?'primary':'default'" @click="courseRole='assistant'">作为助教</el-button>
        </div>
      </div>
      <div class="search-box">
        <el-input
          v-model="searchClass"
          placeholder="输入班级号查询"
          class="search-input"
          clearable
          @clear="handleSearchClear"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <div class="courses-content">
      <div class="course-list">
        <el-card v-for="course in displayCourses" :key="course.id" class="card card-hover" @click="onCourseClick(course)">
          <div class="card-info">
            <span class="cardWord">{{ course.name }}</span>
            <span class="cardWord">授课教师：{{ course.teacher }}</span>
            <span class="cardWord">上课时间：{{ course.time }}</span>
            <span class="cardWord">上课地点：{{ course.location }}</span>
            <span class="cardWord">{{ course.desc }}</span>
          </div>
        </el-card>
      </div>

      <div class="pagination-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredCourses.length"
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
import { Search } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 用户身份（0老师，1学生，2助教）
const user = ref({ name: '张三', identity: 1 }); // 0老师 1学生 2助教
const isTeacher = computed(() => user.value.identity === 0);
const isAssistant = computed(() => user.value.identity === 2);

// 视图模式：我的/全部
const viewMode = ref('my');
// 助教身份下课程区角色切换
const courseRole = ref('student'); // student/assistant

// 搜索班级号
const searchClass = ref('');
const handleSearch = () => {
  // 这里可以对接后端接口，目前仅做前端过滤
  console.log('搜索班级号:', searchClass.value);
};
const handleSearchClear = () => {
  searchClass.value = '';
};

// 课程数据（写死）
const courses = ref([
  { id: 1, name: '软件工程', teacher: '张老师', time: '周一 1-2节', location: '教学楼A101', desc: '软件开发流程与实践' },
  { id: 2, name: '数据结构', teacher: '李老师', time: '周二 3-4节', location: '教学楼B202', desc: '算法与数据结构基础' },
  { id: 3, name: '操作系统', teacher: '王老师', time: '周三 5-6节', location: '教学楼C303', desc: '操作系统原理' },
  { id: 4, name: '数据库', teacher: '赵老师', time: '周四 7-8节', location: '教学楼D404', desc: '数据库设计与应用' },
  { id: 5, name: '计算机网络', teacher: '钱老师', time: '周五 1-2节', location: '教学楼E505', desc: '计算机网络基础' },
  { id: 6, name: '人工智能', teacher: '孙老师', time: '周一 3-4节', location: '教学楼F606', desc: '人工智能导论' },
  { id: 7, name: '机器学习', teacher: '周老师', time: '周二 5-6节', location: '教学楼G707', desc: '机器学习基础' },
  { id: 8, name: '深度学习', teacher: '吴老师', time: '周三 7-8节', location: '教学楼H808', desc: '深度学习理论与实践' },
]);

// 根据视图模式和搜索条件过滤课程
const filteredCourses = computed(() => {
  let result = courses.value;
  if (viewMode.value === 'my') {
    // 我的课程：老师显示创建的，学生显示加入的，助教根据角色切换
    if (isTeacher.value) {
      // 假设张老师是当前用户 (id: 0)
      result = result.filter(course => course.teacher === '王老师'); // 老师创建的示例
    } else if (isAssistant.value && courseRole.value === 'assistant') {
      // 假设张老师是当前用户 (id: 0)
      result = result.filter(course => course.teacher === '李老师'); // 助教负责的示例
    } else { // 学生 或 助教作为学生
      // 假设学生加入了 id 为 1, 2, 4 的课程
      result = result.filter(course => [1, 2, 4].includes(course.id));
    }
  }
  if (searchClass.value) {
    // 这里可以对接后端接口，目前仅做前端过滤
    result = result.filter(course =>
      Object.values(course).some(value =>
        String(value).toLowerCase().includes(searchClass.value.toLowerCase())
      )
    );
  }
  return result;
});

// 分页
const currentPage = ref(1);
const pageSize = 8; // 调整每页显示数量以铺满
const displayCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCourses.value.slice(start, start + pageSize);
});

// 点击课程卡片
const onCourseClick = (course) => {
   router.push(`/course/${course.id}`);
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


.courses-header {
  display: flex;
  justify-content: space-between; /* 选项和搜索框在同一行 */
  align-items: center;
  margin-bottom: 32px;
  padding: 0 10px; /* 与卡片列表内边距对齐 */
}

.options {
  display: flex;
  align-items: center;
  gap: 24px;
}

.role-switch-group {
  display: flex;
  gap: 0;
  border: 2px solid #888; /* 边框颜色调整 */
  border-radius: 18px;
  overflow: hidden;
  height: 48px;
}
.role-switch-group .el-button {
  border: none;
  border-radius: 0;
  font-size: 22px;
  height: 48px;
  min-width: 140px;
  background: #f5f5f5; /* 背景色调整 */
  color: #222; /* 文字颜色调整 */
  transition: background 0.2s, color 0.2s;
  margin: 0 !important;
  padding: 0 32px;
  font-weight: 700;
  box-shadow: none;
}
.role-switch-group .el-button.el-button--primary {
  background: #222; /* 选中背景色 */
  color: #fff; /* 选中文字颜色 */
}
.role-switch-group .el-button:not(.el-button--primary):hover {
  background: #e0e0e0; /* 悬停背景色 */
  color: #222; /* 悬停文字颜色 */
}

.search-box {
  display: flex;
  gap: 16px;
  align-items: center;
}
.search-input {
  width: 300px;
}

.courses-content {
  /* background: #fff; /* 不需要白色背景 */
  border-radius: 16px;
  padding: 0; /* 调整内边距，让卡片列表自己控制 */
  /* box-shadow: 0 2px 8px #e0e0e0; /* 调整阴影 */
}

.course-list {
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
:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1); /* 输入框背景半透明 */
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框颜色调整 */
  color: #c5c5c5; /* 文字颜色 */
  box-shadow: none;
}
:deep(.el-input__inner) {
  color: #c5c5c5; /* 文字颜色 */
  background: transparent;
}
:deep(.el-input__prefix) {
  color: #c5c5c5; /* 图标颜色 */
}
:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
}

:deep(.el-button--primary) {
  background: #ffd04b; /* 按钮背景色 */
  border-color: #ffd04b; /* 按钮边框颜色 */
  color: #222; /* 按钮文字颜色 */
  font-weight: bold;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
:deep(.el-button--primary:hover) {
  background: #fff; /* 悬停背景色 */
  border-color: #fff; /* 悬停边框颜色 */
  color: #222; /* 悬停文字颜色 */
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