<template>
  <NavBar />
  <div class="questions-container">
    <div class="questions-header">
      <div class="title">题目列表</div>
      <div class="options" v-if="isStudent">
        <el-radio-group v-model="questionTab" size="large">
          <el-radio-button label="favorite">收藏</el-radio-button>
          <el-radio-button label="wrong">错题</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="questions-content">
      <div class="question-list">
        <el-card v-for="question in displayQuestions" :key="question.id" class="question-card card-hover" @click="onQuestionClick(question)">
          <div class="question-title">{{ question.title }}</div>
          <div class="question-meta"><span class="icon">📚</span>类型：{{ question.type }}</div>
          <div class="question-meta"><span class="icon">⏰</span>难度：{{ question.level }}</div>
          <div class="question-desc">{{ question.desc }}</div>
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
const pageSize = 4;
const displayQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredQuestions.value.slice(start, start + pageSize);
});

// 点击题目卡片
const onQuestionClick = (question) => {
  alert('点击了题目：' + question.title);
};
</script>

<style scoped>
.questions-container {
  background: linear-gradient(135deg, #f2f2f2 60%, #e0e0e0 100%);
  min-height: 100vh;
  padding: 24px 40px;
  overflow: hidden;
}
.questions-header {
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
  content: '\2753'; /* ❓ */
  font-size: 32px;
  margin-right: 6px;
}
.options {
  display: flex;
  align-items: center;
  gap: 24px;
}
.questions-content {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px #e0e0e0;
}
.question-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  gap: 40px 20px;
  width: 100%;
  padding: 20px;
  align-items: stretch;
  justify-items: stretch;
}
.question-card {
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
.question-card.card-hover:hover {
  box-shadow: 0 8px 32px #bbb;
  transform: translateY(-6px) scale(1.04);
  background: linear-gradient(120deg, #e0e0e0 60%, #cfcfcf 100%);
}
.question-title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.question-title::before {
  content: '\1F52C'; /* 🔬 */
  font-size: 22px;
  margin-right: 4px;
}
.question-meta {
  font-size: 15px;
  color: #444;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.question-desc {
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