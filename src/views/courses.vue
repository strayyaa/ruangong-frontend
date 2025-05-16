<template>
  <NavBar active="2"/>
  <div class="courses-container">
    <div class="courses-header">
      <div class="title">课程列表</div>
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
        <el-card v-for="course in displayCourses" :key="course.id" class="course-card card-hover" @click="onCourseClick(course)">
          <div class="course-title">{{ course.name }}</div>
          <div class="course-teacher">授课教师：{{ course.teacher }}</div>
          <div class="course-time">上课时间：{{ course.time }}</div>
          <div class="course-location">上课地点：{{ course.location }}</div>
          <div class="course-desc">{{ course.desc }}</div>
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
      result = result.filter(course => course.teacher === '张老师'); // 假设张老师是当前用户
    } else if (isAssistant.value && courseRole.value === 'assistant') {
      result = result.filter(course => course.teacher === '张老师'); // 假设张老师是当前用户
    } else {
      result = result.filter(course => course.teacher !== '张老师'); // 假设张老师是当前用户
    }
  }
  if (searchClass.value) {
    // 这里可以对接后端接口，目前仅做前端过滤
    result = result.filter(course => course.name.includes(searchClass.value));
  }
  return result;
});

// 分页
const currentPage = ref(1);
const pageSize = 4;
const displayCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCourses.value.slice(start, start + pageSize);
});

// 点击课程卡片
const onCourseClick = (course) => {
  alert('点击了课程：' + course.name);
};
</script>

<style scoped>
.courses-container {
  background: linear-gradient(135deg, #f2f2f2 60%, #e0e0e0 100%);
  min-height: 100vh;
  padding: 24px 40px;
  overflow: hidden;
}
.courses-header {
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
  content: '\1F393'; /* 🎓 */
  font-size: 32px;
  margin-right: 6px;
}
.options {
  display: flex;
  align-items: center;
  gap: 24px;
}
.role-switch-group {
  display: flex;
  gap: 0;
  border: 2px solid #888;
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
  background: #f5f5f5;
  color: #222;
  transition: background 0.2s, color 0.2s;
  margin: 0 !important;
  padding: 0 32px;
  font-weight: 700;
  box-shadow: none;
}
.role-switch-group .el-button.el-button--primary {
  background: #222;
  color: #fff;
}
.role-switch-group .el-button:not(.el-button--primary):hover {
  background: #e0e0e0;
  color: #222;
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
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px #e0e0e0;
}
.course-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列布局 */
  grid-template-rows: auto; /* 自动行高 */
  gap: 40px 20px; /* 行间距和列间距 */
  width: 100%;
  padding: 20px; /* 与工作区保持一致的间隔 */
  align-items: stretch;
  justify-items: stretch;
}
.course-card {
  width: 85%;
  min-height: 100px; /* 缩小卡片高度 */
  height: auto;
  background: linear-gradient(120deg, #f7f7f7 70%, #e3e3e3 100%);
  border: 1.5px solid #bbb;
  border-radius: 16px; /* 调整圆角大小 */
  box-shadow: 0 2px 12px #e0e0e0; /* 调整阴影 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 16px 16px 16px; /* 缩小内边距 */
  transition: box-shadow 0.25s, transform 0.25s, background 0.25s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.course-card.card-hover:hover {
  box-shadow: 0 8px 32px #bbb;
  transform: translateY(-6px) scale(1.04);
  background: linear-gradient(120deg, #e0e0e0 60%, #cfcfcf 100%);
}
.course-card .icon {
  position: absolute;
  top: 18px;
  right: 24px;
  font-size: 32px;
  color: #888;
  opacity: 0.18;
  pointer-events: none;
}
.course-title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.course-title::before {
  content: '\1F4D6'; /* 📖 */
  font-size: 22px;
  margin-right: 4px;
}
.course-teacher::before {
  content: '\1F464'; /* 👤 */
  margin-right: 4px;
}
.course-time::before {
  content: '\23F0'; /* ⏰ */
  margin-right: 4px;
}
.course-location::before {
  content: '\1F3EB'; /* 🏫 */
  margin-right: 4px;
}
.course-teacher, .course-time, .course-location {
  font-size: 15px;
  color: #444;
  margin-bottom: 4px;
}
.course-desc {
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
  background: #f5f5f5;
  border-radius: 8px;
  border: 1.5px solid #bbb;
  color: #222;
}
:deep(.el-input__inner) {
  color: #222;
  background: transparent;
}
:deep(.el-input__prefix) {
  color: #888;
}
:deep(.el-button--primary) {
  background: #222;
  border-color: #222;
  color: #fff;
}
:deep(.el-button--primary:hover) {
  background: #444;
  border-color: #444;
  color: #fff;
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