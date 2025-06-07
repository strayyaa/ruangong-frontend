<template>
  <NavBar />
  <div class="background-layer">
    <h1 class="mainTitle">首页</h1>
  </div>

  <div class="tabs-container">
    <el-tabs v-model="currentTab" class="main-tabs">
      <!-- 我的待办 Tab -->
      <el-tab-pane label="我的待办" name="todo">
        <div class="module-content">
          <div class="module-header">
            <h2 class="module-title">我的待办</h2>
            <!-- 助教身份选择 -->
            <div v-if="isStudent && hasAssistantRole" class="role-selector">
              <el-radio-group v-model="assistantRole" @change="handleRoleChange">
                <el-radio-button label="student">作为学生</el-radio-button>
                <el-radio-button label="assistant">作为助教</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div v-if="displayTodoTask.length > 0" class="card-list">
            <el-card v-for="item in displayTodoTask" :key="item.exer_id" class="card">
              <div class="card-row">
                <div class="card-info">
                  <span class="cardWord">{{ truncateText(item.name) }}</span>
                  <span class="cardWord">开始：{{ formatDate(item.begin_time) }}</span>
                  <span class="cardWord">截止：{{ formatDate(item.end_time) }}</span>
                </div>
                <div class="card-actions">
                  <el-button class="cardButton" @click="goToTodoItem(item)">{{ getTodoButtonText() }}</el-button>
                </div>
              </div>
            </el-card>
          </div>
          <div v-else class="no-data">
            <el-empty description="暂无待办事项" />
          </div>
        </div>
      </el-tab-pane>

      <!-- 课程模块 Tab -->
      <el-tab-pane label="我的课程" name="courses">
        <div class="module-content">
          <div class="module-header">
            <h2 class="module-title">我的课程</h2>
            <!-- 助教身份选择 -->
            <div v-if="isStudent && hasAssistantRole" class="role-selector">
              <el-radio-group v-model="assistantRole" @change="handleRoleChange">
                <el-radio-button label="student">作为学生</el-radio-button>
                <el-radio-button label="assistant">作为助教</el-radio-button>
              </el-radio-group>
            </div>
            <div class="module-actions">
              <el-button v-if="isTeacher" class="create-button" @click="createCourse">创建课程</el-button>
              <el-button class="all-button" @click="goToAllCourse">全校课程</el-button>
            </div>
          </div>
          
          <!-- 课程列表 -->
          <div v-if="displayCourses.length > 0" class="card-list">
            <el-card v-for="course in displayCourses" :key="course.course_id" class="card">
              <div class="card-row">
                <div class="card-info">
                  <span class="cardWord">{{ truncateText(course.name,8) }}</span>
                  <span class="cardWord">考核方式：{{ course.assMethod }}</span>
                  <span class="cardWord">学分：{{ course.score }}</span>
                  <span class="cardWord">学时：{{ course.time }}</span>
                </div>
                <div class="card-actions">
                  <el-button class="cardButton" @click="goToCourse(course.course_id)">进入课程</el-button>
                </div>
              </div>
            </el-card>
          </div>
          <!-- 无课程提示 -->
          <div v-else class="no-data">
            <el-empty description="暂无课程" />
          </div>
        </div>
      </el-tab-pane>

      <!-- 任务模块 Tab -->
      <el-tab-pane label="我的任务" name="tasks">
        <div class="module-content">
          <div class="module-header">
            <h2 class="module-title">我的任务</h2>
            <!-- 助教身份选择 -->
            <div v-if="isStudent && hasAssistantRole" class="role-selector">
              <el-radio-group v-model="assistantRole" @change="handleRoleChange">
                <el-radio-button label="student">作为学生</el-radio-button>
                <el-radio-button label="assistant">作为助教</el-radio-button>
              </el-radio-group>
            </div>
            <div class="module-actions">
              <el-button v-if="isTeacher" class="create-button" @click="createTask">创建任务</el-button>
              <el-button v-if="isStudent" class="create-button" @click="downReport">练习报告</el-button>
            </div>
          </div>
          
          <div v-if="currentTaskList.length > 0" class="card-list">
            <el-card v-for="task in currentTaskList" :key="task.id" class="card">
              <div class="card-row">
                <div class="card-info">
                  <span class="cardWord">{{ truncateText(task.name) }}</span>
                  <span class="cardWord">{{ formatDate(task.begin_time) }} ~ {{ formatDate(task.end_time) }}</span>
                </div>
                <div class="card-actions">
                  <el-button 
                    class="cardButton" 
                    :class="{ 'disabled-button': isTaskButtonDisabled(task) }"
                    :disabled="isTaskButtonDisabled(task)"
                    @click="goToTaskItem(task)"
                  >
                    {{ getTaskButtonText(task) }}
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
          <div v-else class="no-data">
            <el-empty :description="getEmptyDescription()" />
          </div>
        </div>
      </el-tab-pane>

      <!-- 题目模块 Tab -->
      <el-tab-pane label="我的题目" name="questions">
        <div class="module-content">
          <div class="module-header">
            <h2 class="module-title">我的题目</h2><!-- 题目类型选择器：老师不显示，助教三选项，学生两选项 -->
          <div v-if="!isTeacher" class="question-type-selector">
            <el-radio-group v-model="currentQuestionType" @change="handleQuestionTypeChange">
              <el-radio-button label="collect">我的收藏</el-radio-button>
              <el-radio-button label="wrong">我的错题</el-radio-button>
              <el-radio-button v-if="hasAssistantRole" label="created">我创建的</el-radio-button>
            </el-radio-group>
          </div>
            <div class="module-actions">
              <el-button v-if="isTeacher||hasAssistantRole" class="create-button" @click="createQuestion">创建题目</el-button>
            </div>
          </div>

          

          <!-- 题目列表 -->
          <div v-if="currentQuestionList.length > 0" class="card-list">
            <el-card v-for="question in currentQuestionList" :key="question.prob_id" class="card">
              <div class="card-row">
                <div class="card-info">
                  <span class="cardWord">{{ getQuestionTypeText(question.type) }}</span>
                  <span class="cardWord">{{ truncateText(question.description) }}</span>
                  <span v-if="currentQuestionType === 'wrong'" class="cardWord">题目来自:{{ question.exer_name }}</span>
                </div>
                <div class="card-actions">
                  <el-button class="cardButton" @click="goToQuestion(question.prob_id)">查看</el-button>
                </div>
              </div>
            </el-card>
          </div>
          <!-- 无题目提示 -->
          <div v-else class="no-data">
            <el-empty :description="getQuestionEmptyDescription()" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div style="height: 40px;"></div> <!-- 底部留白 -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElNotification } from 'element-plus';
import { getUserCourses,getUserInfoById,getUserTodolist,getUserTasks,getUserQuestions, generateReportOfTaskOfStu} from '../js/api';
import { it } from 'element-plus/es/locales.mjs';

const router = useRouter();
const currentTab = ref('todo'); // 默认选中待办 Tab

// 模拟用户身份 (0老师, 1学生, 2助教)
//const user = ref({ id: 61, name: '张三', identity: 2 }); // 切换这里的identity来模拟不同身份
const user = ref({}); // 用户信息
const userId = localStorage.getItem('userId');
const getUserInfo = async () => {
  console.log('开始获取用户信息', userId);
  const res = await getUserInfoById(userId);
  console.log('获取用户信息:', res);
  user.value = res;
  console.log(user.value);
}

const isTeacher = computed(() => user.value.identity === 0);
const isStudent = computed(() => user.value.identity === 1);

const displayLimit = 4; // 其他模块显示的卡片数量
const pageSize = 6; // 待办事项每页显示数量
const currentTodoPage = ref(1); // 待办事项当前页

// 待办数据
const allTodoItems = ref([]);
const teacherTodo = ref([]);
const studentTodo = ref([]);
const assistantTodo = ref([]);
const allQuestions = ref([]);
// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 获取任务列表
const fetchTodoList = async () => {
  try {
    const response = await getUserTodolist(user.value.user_id, isTeacher.value, hasAssistantRole.value);
    if(isTeacher.value){
      console.log('教师身份，获取代办列表');
      teacherTodo.value = response[0]||[];
      teacherTodo.value.forEach(item => {
         //输出每个任务的截止时间
         console.log('任务截止时间:', item.end_time);
      });
    }else if(isStudent.value&&hasAssistantRole.value){
      studentTodo.value = response[0]||[];
      assistantTodo.value = response[1]||[];
    }else{
      studentTodo.value = response[0]||[];
    }
    console.log('代办列表数据:', allTodoItems.value);
  } catch (error) {
    ElMessage.error('获取代办列表失败');
    console.error('获取代办列表失败:', error);
  }
};
//决定显示的代办
const displayTodoTask = computed(() => {
  if (isTeacher.value) {
    return teacherTodo.value;
  } else if (isStudent.value) {
    if (hasAssistantRole.value) {
      return assistantRole.value === 'student' ? studentTodo.value : assistantTodo.value;
    }
    return studentTodo.value;
  }
  return [];
});
const downReport = async () => {
  console.log('下载练习报告');
  // 这里可以添加下载报告的逻辑
  const res = await generateReportOfTaskOfStu(localStorage.getItem('userId'));
  if (res.success) {
    window.open(res.data, '_blank'); // 打开新窗口下载报告
    ElMessage.success('下载练习报告成功');
  } else {
    ElMessage.error(res.errorMsg);
  }
}
const goToTaskItem = (task) => {
  console.log('获取到的按钮用户id是',userId);
  const now = new Date();
  const endTime = new Date(task.end_time);
  
  if (isTeacher.value || (hasAssistantRole.value && assistantRole.value === 'assistant')) {
    // 教师跳转到查看任务详情页面
    router.push(`/showExerInfo/${task.exer_id}`);
  } else {
    // 学生根据时间判断跳转
    if (now > endTime) {
      // 超过截止时间，跳转到查看批改页面
      router.push(`/showCheckDetail/${task.exer_id}/${userId}`);
    } else if (task.is_multi) {
      // 未超过截止时间且允许多次提交，跳转到做题页面
      router.push(`/doTask/${task.exer_id}`);
    }
    // 未超过截止时间且不允许多次提交，按钮禁用，不跳转
  }
};
const goToTodoItem = (item) => {
  console.log('获取到的按钮用户id是',userId);
  if (isTeacher.value||(hasAssistantRole.value&&assistantRole.value==='assistant')) {
    // 教师跳转到查看任务详情页面
    router.push(`/checkTaskList/${item.exer_id}`);
  } else {
    console.log(userId);
    // 学生跳转到查询批改信息页面
    router.push(`/doTask/${item.exer_id}`);
  }
};
// 获取任务按钮文本
const getTodoButtonText = () => {
  if (isTeacher.value || (hasAssistantRole.value && assistantRole.value === 'assistant')) {
    return '去批改';
  }
  return '去做题';
};
// 课程数据
const studentCourses = ref([]);
const assistantCourses = ref([]);
const teacherCourses = ref([]);
const assistantRole = ref('student'); // 助教身份选择
const hasAssistantRole = ref(false); // 是否有助教身份

// 根据当前身份和选择显示课程
const displayCourses = computed(() => {
  if (isTeacher.value) {
    return teacherCourses.value;
  } else if (isStudent.value) {
    if (hasAssistantRole.value) {
      return assistantRole.value === 'student' ? studentCourses.value : assistantCourses.value;
    }
    return studentCourses.value;
  }
  return [];
});
//console.log('当前的题目类型是',currentQuestionType.value);
// 获取课程数据
const fetchCourses = async () => {
  try {
    console.log("开始获取课程");
    const response = await getUserCourses(user.value.user_id);
    console.log('用户id:', user.value.user_id);
    console.log('课程数据:', response.data);
    console.log('第一个列表',response.data[0]);
    if (isTeacher.value) {
      // 教师身份
      console.log("是老师");
      teacherCourses.value = response.data[0] || [];
    } else if (isStudent.value) {
      console.log("response",response.data[1]);
      // 学生身份
      if (Array.isArray(response.data) && response.data[1].length !==0 ) {
        console.log("是助教");
      
        // 返回两个列表，说明同时是助教
        studentCourses.value = response.data[0] || [];
        assistantCourses.value = response.data[1] || [];
        hasAssistantRole.value = true;
      } else {
        console.log("是学生");
        // 返回单个列表，纯学生身份
        studentCourses.value = response.data[0] || [];
        hasAssistantRole.value = false;
      }
    }
    console.log('学生课表为：',studentCourses.value);
  } catch (error) {
    ElMessage.error('获取课程列表失败');
    console.error('获取课程列表失败:', error);
  }
};

// 处理助教身份切换
const handleRoleChange = (value) => {
  assistantRole.value = value;
  
};
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
// 在组件挂载时获取课程数据
onMounted(async () => {
  await getUserInfo();
  await fetchCourses();
  await fetchTodoList();
  await fetchTasks();
  await fetchQuestionlist();
  window.addEventListener('scroll', handleScroll)
  
  // 添加检查截止时间的调用
  setTimeout(() => {
    checkDeadlines();
  }, 1000); // 延迟1秒执行，确保数据已加载完成
});

// 任务数据
const allTasks = ref([]); // 存储所有任务列表

// 获取当前显示的任务列表
const currentTaskList = computed(() => {
  if (!allTasks.value || allTasks.value.length === 0) return [];
  if (isTeacher.value || !hasAssistantRole.value) {
    return allTasks.value[0] || [];
  }
  console.log('现在是助教')
  return assistantRole.value === 'student' ? allTasks.value[0] || [] : allTasks.value[1] || [];
});
// 获取任务列表
const fetchTasks = async () => {
  try {
    const response = await getUserTasks(user.value.user_id, isTeacher.value, hasAssistantRole.value);
    allTasks.value = response || [];
    console.log('任务列表数据:', allTasks.value);
  } catch (error) {
    ElMessage.error('获取任务列表失败');
    console.error('获取任务列表失败:', error);
  }
};

// 获取任务按钮文本
const getTaskButtonText = (task) => {
  if (isTeacher.value || (hasAssistantRole.value && assistantRole.value === 'assistant')) {
    return '查看任务';
  }
  
  const now = new Date();
  const endTime = new Date(task.end_time);
  
  if (now > endTime) {
    return '查询批改';
  } else if (task.is_multi) {
    return '去做题';
  } else {
    return '已完成';
  }
};

// 判断按钮是否禁用
const isTaskButtonDisabled = (task) => {
  if (isTeacher.value || (hasAssistantRole.value && assistantRole.value === 'assistant')) {
    return false;
  }
  
  const now = new Date();
  const endTime = new Date(task.end_time);
  
  return now <= endTime && !task.is_multi;
};

// 获取空状态描述文本
const getEmptyDescription = () => {
  if (isTeacher.value) {
    return '暂无创建的任务';
  } else if (hasAssistantRole.value) {
    return assistantRole.value === 'student' ? '暂无待完成任务' : '暂无创建的任务';
  } else {
    return '暂无待完成任务';
  }
};

// 路由跳转函数
const goToCourse = (id) => { router.push(`/course/${id}`); };
const goToQuestion = (id) => { router.push(`/question/${id}`); }; // 跳转到题目详情页面
const goToAllCourse = () => { router.push(`/selectCourseList`); };
// 创建功能跳转 (仅老师可见)
const createCourse = () => { router.push('/createCourse'); }; // 假设有创建课程页面
const createTask = () => { router.push('/createTask'); };   // 假设有创建任务页面
const createQuestion = () => { router.push('/createQuestion'); }; // 假设有创建题目页面

const currentQuestionType = ref('collect'); // 当前选中的题目类型
const wrongQeustionExercise = ref([]); // 错题练习列表
const fetchQuestionlist = async () => {
  try {
    // user.value.user_id、isTeacher.value、hasAssistantRole.value 已在 setup 中定义
    const response = await getUserQuestions(user.value.user_id, isTeacher.value, hasAssistantRole.value);
    allQuestions.value = response || [];

    wrongQeustionExercise.value = allQuestions.value[3] || [];
    if(!isTeacher.value) {
      addExerNameToWrongQuestions(allQuestions.value[1], wrongQeustionExercise.value);
    }
    console.log('题目列表数据:', allQuestions.value);
  } catch (error) {
    ElMessage.error('获取题目列表失败');
    console.error('获取题目列表失败:', error);
  }
};
function addExerNameToWrongQuestions(wrongQuestions, wrongQeustionExercise) {
  if (!Array.isArray(wrongQuestions) || !Array.isArray(wrongQeustionExercise)) return;
  wrongQuestions.forEach((problem, idx) => {
    problem.exer_name = wrongQeustionExercise[idx].name || '';
  });
}
const currentQuestionList = computed(() => {
  if (!allQuestions.value || allQuestions.value.length === 0) return [];
  if (isTeacher.value) {
    return allQuestions.value[0] || [];
  } else if (hasAssistantRole.value) {
    switch (currentQuestionType.value) {
      case 'collect': return allQuestions.value[0] || [];
      case 'wrong': return allQuestions.value[1] || [];
      case 'created': return allQuestions.value[2] || [];
      default: return [];
    }
  } else {
    switch (currentQuestionType.value) {
      case 'collect': return allQuestions.value[0] || [];
      case 'wrong': return allQuestions.value[1] || [];
      default: return [];
    }
  }
});

// 获取题目类型文本
const getQuestionTypeText = (type) => {
  const typeMap = {
    0: '选择题',
    1: '填空题',
    2: '简答题',
    3: '编程题'
  };
  return typeMap[type] || '未知类型';
};

// 添加文本截断方法
const truncateText = (text, maxLength = 10) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// 获取题目空状态描述
const getQuestionEmptyDescription = () => {
  if (isTeacher.value) {
    return '暂无创建的题目';
  } else if (hasAssistantRole.value && assistantRole.value === 'assistant') {
    switch (currentQuestionType.value) {
      case 'collect':
        return '暂无收藏的题目';
      case 'wrong':
        return '暂无错题';
      case 'created':
        return '暂无创建的题目';
      default:
        return '暂无题目';
    }
  } else {
    switch (currentQuestionType.value) {
      case 'collect':
        return '暂无收藏的题目';
      case 'wrong':
        return '暂无错题';
      default:
        return '暂无题目';
    }
  }
};

// 处理题目类型切换
const handleQuestionTypeChange = (value) => {
  currentQuestionType.value = value;
  console.log('当前的题目类型是',currentQuestionType.value);
};

// 添加检查截止时间的函数
const checkDeadlines = () => {
  const now = new Date();
  console.log('当前时间:', now);
  let offset = 0; // 用于计算每个通知的偏移量
  
  displayTodoTask.value.forEach(task => {
    const endTime = new Date(task.end_time);
    console.log(`任务 "${task.name}" 的截止时间:`, endTime);
    const timeDiff = endTime - now;
    const hoursLeft = timeDiff / (1000 * 60 * 60);
    
    if (hoursLeft > 0 && hoursLeft <= 24) {
      ElNotification({
        title: '任务即将截止',
        message: `任务"${task.name}"剩余时间不足1天`,
        type: 'warning',
        offset: offset, // 设置偏移量
        //duration: 0, // 通知不会自动关闭
        position: 'top-right'
      });
      offset += 100; // 每个通知向下偏移120像素
    }
  });
};

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
  flex: 0 0 auto; /* 防止标题被压缩 */
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

.sub-title {
  color: #ffd04b;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 20px 0 10px 10px;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.role-selector {
  margin: 20px;
  text-align: center;
  flex: 1; /* 让选项占据剩余空间 */
}

.role-selector :deep(.el-radio-button__inner) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #c5c5c5;
  border-color: #ffd04b;
}

.role-selector :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #ffd04b;
  color: #222;
  border-color: #ffd04b;
  box-shadow: -1px 0 0 0 #ffd04b;
}

.question-type-selector {
  margin: 20px;
  text-align: center;
}

.question-type-selector :deep(.el-radio-button__inner) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #c5c5c5;
  border-color: #ffd04b;
}

.question-type-selector :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #ffd04b;
  color: #222;
  border-color: #ffd04b;
  box-shadow: -1px 0 0 0 #ffd04b;
}

.disabled-button {
  background: #666 !important;
  color: #999 !important;
  cursor: not-allowed !important;
}
</style>
