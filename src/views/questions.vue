<template>
  <NavBar active="4"/>
  <div class="background-layer">
    <h1 class="mainTitle">题目列表</h1>
  </div>

  <div class="content-container">
    <div class="questions-header">
      <div class="options" v-if="isStudent">
        <el-radio-group v-model="questionTab" size="large">
          <el-radio-button label="favorite">收藏</el-radio-button>
          <el-radio-button label="wrong">错题</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="questions-content">
      <div class="question-list">
        <el-card v-for="question in displayQuestions" :key="question.id" class="card card-hover" @click="onQuestionClick(question)">
          <div class="card-info">
            <span class="cardWord">{{ question.title }}</span>
            <span class="cardWord">类型：{{ question.type }}</span>
            <span class="cardWord">难度：{{ question.level }}</span>
            <span class="cardWord">{{ question.desc }}</span>
          </div>
        </el-card>
      </div>
      <div class="pagination-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredQuestions.length"
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

// 用户身份（0老师，1学生）
const user = ref({ name: '张三', identity: 1 }); // 0老师 1学生
const isTeacher = computed(() => user.value.identity === 0);
const isStudent = computed(() => user.value.identity === 1);

// 学生tab
const questionTab = ref('favorite');

// 题目信息（写死）
const questions = ref([
  { id: 1, title: '二叉树遍历', type: '选择题', level: '中等', desc: '给定一棵二叉树，输出其前序遍历序列。' },
  { id: 2, title: 'SQL查询', type: '填空题', level: '简单', desc: '写出查询所有学生信息的SQL语句。' },
  { id: 3, title: '进程与线程', type: '简答题', level: '中等', desc: '简述进程和线程的区别。' },
  { id: 4, title: '冒泡排序', type: '编程题', level: '简单', desc: '实现冒泡排序算法。' },
  { id: 5, title: 'TCP三次握手', type: '选择题', level: '困难', desc: 'TCP三次握手的过程描述正确的是？' },
  { id: 6, title: '数据库范式', type: '简答题', level: '中等', desc: '简述数据库第三范式的定义。' },
  { id: 7, title: 'Dijkstra算法', type: '编程题', level: '困难', desc: '实现Dijkstra最短路径算法。' },
  { id: 8, title: '死锁条件', type: '选择题', level: '中等', desc: '下列哪个不是死锁产生的必要条件？' },
]);

// 过滤题目
const filteredQuestions = computed(() => {
  if (isStudent.value) {
    if (questionTab.value === 'favorite') {
      // 假设收藏题目id为1,3,5,7
      return questions.value.filter(q => [1,3,5,7].includes(q.id));
    } else {
      // 假设错题id为2,4,6,8
      return questions.value.filter(q => [2,4,6,8].includes(q.id));
    }
  }
  // 老师显示全部题目
  return questions.value;
});

// 分页
const currentPage = ref(1);
const pageSize = 8; // 调整每页显示数量
const displayQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredQuestions.value.slice(start, start + pageSize);
});

// 点击题目卡片
const onQuestionClick = (question) => {
  router.push(`/question/${question.id}`);
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


.questions-header {
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

.question-list {
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