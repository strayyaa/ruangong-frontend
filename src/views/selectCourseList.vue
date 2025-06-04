<template>
    <NavBar />
    <div class="background-layer">
      <h1 class="mainTitle">选课大厅</h1>
    </div>
  
    <div class="tabs-container">
      <el-tabs v-model="currentTab" class="main-tabs">
        <!-- 课程模块 Tab -->
        <el-tab-pane label="全部课程" name="全部课程">
          <div class="module-content">
            <div class="module-header">
              <div class="module-actions">
                <el-button v-if="isTeacher" class="create-button" @click="createCourse">创建课程</el-button>
                <!-- <el-button class="all-button" @click="goToCourses">全部</el-button> -->
              </div>
            </div>
            <!-- 课程列表 -->
            <div v-if="allCourse.length > 0" class="card-list">
              <el-card v-for="course in allCourse" :key="course.course_id" class="card">
                <div class="card-row">
                  <div class="card-info">
                    <span class="cardWord">{{ course.name }}</span>
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
      </el-tabs>
      <div style="height: 40px;"></div> <!-- 底部留白 -->
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import NavBar from '../components/NavBar.vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { getAllCourseList,getUserInfoById} from '../js/api';
  
  const router = useRouter();
  
  const currentTab = ref('全部课程'); // 默认选中待办 Tab
  
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
  
  // 课程数据
  const allCourse = ref([]);
  const fetchCourses = async () => {
    try {
      console.log("开始获取课程");
      const response = await getAllCourseList();
      allCourse.value = response || [];
      console.log('获取课程列表成功:', allCourse.value);
    } catch (error) {
      ElMessage.error('获取课程列表失败');
      console.error('获取课程列表失败:', error);
    }
  };  
  // 在组件挂载时获取课程数据
  onMounted(async () => {
    await getUserInfo();
    await fetchCourses();
  });
  
  const goToCourse = (id) => { router.push(`/course/${id}`); };
  
  // 创建功能跳转 (仅老师可见)
  const createCourse = () => { router.push('/createCourse'); }; // 假设有创建课程页面
  
  
  
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
  
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
  </style>
  