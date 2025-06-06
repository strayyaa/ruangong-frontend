<template>

  <NavBar />
  <div class = "background-layer">
    <h1 :style = "{'margin-top': distance}" class="courseNameTitle" @click="scrollToTop">{{ courseInfo.name }}</h1>
    <p :style = "{opacity:contentOpacity}" class="courseInfoContent">大纲：{{ courseInfo.syllabus }}</p>
    <p :style = "{opacity:contentOpacity}" class="courseInfoContent">考核方式：{{ courseInfo.assMethod }}</p>
    <p :style = "{opacity:contentOpacity}" class="courseInfoContent">学分：{{ courseInfo.score }}</p>
    <p :style = "{opacity:contentOpacity}" class="courseInfoContent">学时：{{ courseInfo.time }}</p>
    <p v-if="status!==null&&status===1" :style = "{opacity:contentOpacity}" class="courseInfoContent">任务完成情况:{{ finishRateOfStu[0] }}/{{ finishRateOfStu[1] }}</p>
    <div v-if="status !==null">
      <div v-if="status!==1||targetClass!==null">
    <el-button
        v-if = "status == 1"
        class="register-btn"
        :style = "{top: distanceOfButton}"
        @mouseenter="registerMouseEnter"
        @mouseleave="registerMouseLeave"
        @click="dealWithButtonClick"
    >->进入班级{{ targetClass.name }}</el-button>

    <el-button
        v-if = "status == 0"
        class="register-btn"
        :style = "{top: distanceOfButton}"
        @mouseenter="registerMouseEnter"
        @mouseleave="registerMouseLeave"
        @click="dealWithButtonClick"
    >->添加课程助教/老师</el-button>
    </div>
      </div>

    <el-drawer
      title="添加助教/老师"
      v-model="drawerOfAddAssAndTea"
      :direction="'rtl'"
      :before-close="(done) => { drawerOfAddAssAndTea = false; done(); }"
      style="z-index: 1001;"
      :size="'50%'"
      :append-to-body="true">
      <div style="margin-left: 20px;margin-top: 0px;">
        <el-button 
        style="margin-right: 20px;margin-top: -30px;scale: 1.2;font-size: 1rem;font-weight: bold;"
        @click="drawerChangeAssAndTea">{{ drawerButtonChangeAssandTeaWord }}</el-button>
        <div>
          <span style="color: rgb(135,135,135);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">添加{{drawerIsAssistant}}：</span>
          <el-input
            v-model="drawerSearchTextOfAssAndTea"
            placeholder="搜索信息"
            clearable
            style="width: 300px; margin-bottom: 10px;"
          />
        </div>
        <el-card v-for="assAndTea in drawerPagedAssAndTea" :key="assAndTea.id" class="card">
          <div class="card-row">
            <!-- 左侧内容 -->
            <div class="card-info">
              <span class="drawer-card-word">{{ assAndTea.user_id }}</span>
              <span class="drawer-card-word">{{ assAndTea.username }}</span>
              <span class="drawer-card-word">{{ assAndTea.name }}</span>
              <span class="drawer-card-word">{{ assAndTea.mail }}</span>
            </div>

            <!-- 右侧按钮 -->
            <div class="card-actions">
              <el-button class="cardButton"><span style="margin-top: 14px;" @click="drawerAddAssAndTea(assAndTea.username)">添加</span></el-button>
            </div>
          </div>
        </el-card>
        <el-pagination
          v-if="drawerFilteredAssAndTea.length > pageSize"
          layout="prev, pager, next"
          :total="drawerFilteredAssAndTea.length"
          :page-size="pageSize"
          :current-page="drawerCurrentPageOfAssAndTea"
          @current-change="handleDrawerPageChangeOfAssAndTea"
          style="margin-top: 20px; text-align: center;">
        </el-pagination>
      </div>
    </el-drawer>

  </div>

  <div class="tabs-container">
  <el-tabs v-model="currentTab" class="main-tabs">
      <el-tab-pane  v-for="tab in navItems" :key="tab" :name="tab">
        <template #label>
          <span class = "coponent-title" @click = "scrollToPos" >{{ tab }}</span>
        </template>
        
        <!-- 学生页 -->
        <template v-if="tab === '学生'">
          <div style="margin-left: 20px;margin-top: 10px;">
            <span style="color: rgb(235,235,235);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">搜索学生：</span>
            <el-input
              v-model="searchText"
              placeholder="搜索学生信息"
              clearable
              style="width: 300px; margin-bottom: 20px;"
            />
          </div>
          <el-descriptions 
           border style="margin-bottom: 2px;" 
          class="descriptions">
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  <strong>用户名</strong>
                </div>
              </template>
              <div class="descriptions-content">
                姓名
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  邮箱
                </div>
              </template>
              <div class="descriptions-content">
                班级
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  任务完成率
                </div>
              </template>
              <div class="descriptions-content">
              </div>
            </el-descriptions-item>
          </el-descriptions>

          <el-descriptions 
          v-for="student in pagedStudents" :key="student.id" border style="margin-bottom: 2px;" 
          class="descriptions">
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  <strong>{{ student.username }}</strong>
                </div>
              </template>
              <div class="descriptions-content">
                {{ student.name }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  {{ student.mail }}
                </div>
              </template>
              <div class="descriptions-content">
                {{ student.class }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  {{ student.finishRate?.[0] ?? '-' }}/{{ student.finishRate?.[1] ?? '-' }}
                </div>
              </template>
              <div class = "descriptions-content">
                  <el-button style="scale: 1.2;font-size: 1rem;font-weight: bold;" @click="router.push('/profile/'+student.user_id)">查看学生</el-button>
              </div>
            </el-descriptions-item>
          </el-descriptions>
          <el-pagination
            v-if="filteredStudents.length > pageSize"
            layout="prev, pager, next"
            :total="filteredStudents.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
            style="margin-top: 20px; text-align: center;"
          />
        </template>

        <!-- 班级页 -->
        <template v-else-if="tab === '班级'">
          <el-row :gutter="20">
            <el-col :span="6" v-for="cls in sampleClasses" :key="cls.code">
              <el-card class="class-box" @click="jumpToClass(cls.class_id)">
                <div class="color-block" :style="{ backgroundColor: cls.color.replace('rgb', 'rgba').replace(')', ', 0.5)') }"></div>
                <div class="class-code">{{ cls.class_code }}-{{ cls.name }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="class-box" v-if="status==0||status==2" @click="drawerOfCreatingClass = true">
                <div class="color-block" style=" background-color: rgb(30,150,230,0.5) "></div>
                <div class="class-code">添加班级</div>
              </el-card>
            </el-col>
          </el-row>
          <el-drawer
            title="创建班级"
            v-model="drawerOfCreatingClass"
            :direction="'rtl'"
            :before-close="(done) => { drawerOfCreatingClass = false; done(); }"
            style="z-index: 1001;"
            :append-to-body="true">
            <div style="margin-left: 20px;margin-top: 150px;">
              <span style="color: rgb(100,100,100);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">输入班级名称：</span>
              <el-input
                v-model="createClassForm.name"
                placeholder="班级名称"
                clearable
                style="width: 300px; margin-bottom: 20px;"
              />
            </div>
            <el-button style="margin-left:20px;margin-top: 10px;background-color:  rgb(80,80,80);color: white;"
            @click="createClassSubmit">创建班级</el-button>
          </el-drawer>
        </template>

        

        <!-- 助教/老师 -->
        <template v-else-if="tab === '助教/老师'">
          <div style="margin-left: 20px;margin-top: 10px;">
            <el-button 
            style="margin-right: 20px;margin-top: -10px;scale: 1.2;font-size: 1rem;font-weight: bold;"
            @click="changeAssAndTea">{{ changeAssandTeaWord }}</el-button>
            <span style="color: rgb(235,235,235);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">搜索{{isAssistant}}：</span>
            <el-input
              v-model="searchTextOfAssAndTea"
              placeholder="搜索信息"
              clearable
              style="width: 300px; margin-bottom: 10px;"
            />
          </div>
          <el-descriptions 
           border style="margin-bottom: 2px;" 
          class="descriptions"
          >
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  用户ID
                </div>
              </template>
              <div class="descriptions-content">
                <strong>用户名</strong>
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  姓名
                </div>
              </template>
              <div class="descriptions-content">
                邮箱
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  班级
                </div>
              </template>
              <div class="descriptions-content">
                
              </div>
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions 
          v-for="assAndTea in pagedAssAndTea" :key="assAndTea.id" border style="margin-bottom: 2px;" 
          class="descriptions"
          >
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  {{ assAndTea.user_id }}
                </div>
              </template>
              <div class="descriptions-content">
                <strong>{{ assAndTea.username }}</strong>
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  {{ assAndTea.name }}
                </div>
              </template>
              <div class="descriptions-content">
                {{ assAndTea.mail }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  <span v-if="assAndTea.classes.length == 0">无</span>
                  <span v-for="(cls,index) in assAndTea.classes" :key="cls">
                    {{ cls }}
                  <span v-if="index!=assAndTea.classes.length-1">, </span>
                  </span>
                </div>
              </template>
              <div class="descriptions-content">
              <el-button style="scale: 1.2;font-size: 1rem;font-weight: bold;" @click="router.push('/profile/'+assAndTea.user_id)">查看用户</el-button>
                </div>
            </el-descriptions-item>
          </el-descriptions>
          <el-pagination
            v-if="filteredAssAndTea.length > pageSize"
            layout="prev, pager, next"
            :total="filteredAssAndTea.length"
            :page-size="pageSize"
            :current-page="currentPageOfAssAndTea"
            @current-change="handlePageChangeOfAssAndTea"
            style="margin-top: 20px; text-align: center;"
          />
        </template>

        <!-- 资源页 -->
        <template v-else-if="tab === '资源'">
          <el-checkbox-group v-model="selectedTags" class="tag-selector">
            <el-checkbox v-for="tag in allTags" :label="tag" :key="tag">
              <span style="font-size: 1.5rem;font-weight: bold;">{{ tag.name }}</span>
            </el-checkbox>
          </el-checkbox-group>

          <el-card class="card">
            <span class="cardWord"><strong>名称</strong></span>
            <span class="cardWord"><strong>公开</strong></span>
            <span class="cardWord"><strong>类型</strong></span>
            <span class="cardWord"><strong>上传时间</strong></span>
            <span class="cardWord"><strong>类型</strong></span>
          </el-card>
          <el-card v-for="res in pagedResources" :key="res.code" class="card">
            <div class="card-row">
              <!-- 左侧内容 -->
              <div class="card-info">
                <span class="cardWord">{{ res.name }}</span>
                <span class="cardWord">{{ res.process_id===-1 ? '是' : '否' }}</span>
                <span class="cardWord">{{ res.type }}</span>
                <span class="cardWord">{{ res.date.split('T')[0] }}</span>
                <span class="cardWord">
                  <template v-for="(tagIdx, idx) in String(res.tag).split(',')" :key="tagIdx">
                    {{ allTagsWhenCreate[Number(tagIdx)]?.name || allTagsWhenCreate[Number(tagIdx)] }}
                    <span v-if="idx !== String(res.tag).split(',').length - 1">, </span>
                  </template>
                </span>
              </div>

              <!-- 右侧按钮 -->
              <div class="card-actions">
                <el-button class="cardButton"><span style="margin-top: 14px;" @click="searchHistory(res.res_id)">查询历史</span></el-button>
                <el-button class="cardButton"><span style="margin-top: 14px;" @click="previewRes(res.url)">预览</span></el-button>
                <el-button class="cardButton"><span style="margin-top: 14px;" @click="downloadRes(res.res_id)">下载</span></el-button>
                <el-button class="cardButton"><span style="margin-top: 14px;" @click="deleteRes(res.res_id)">删除</span></el-button>
              </div>
            </div>
          </el-card>
          <el-pagination
            v-if="filteredResources.length > pageSize"
            layout="prev, pager, next"
            :total="filteredResources.length"
            :page-size="pageSize"
            :current-page="currentPageOfRes"
            @current-change="handlePageChangeOfRes"
            style="margin-top: 20px; text-align: center;">
          </el-pagination>

          <el-drawer
            title="查询文件历史"
            v-model="drawerOfSearchHistory"
            :direction="'btt'"
            :before-close="(done) => { drawerOfSearchHistory = false; done(); }"
            style="z-index: 1001;"
            :append-to-body="true"
            :size="'50%'" >
              <el-card class="card">
                <span class="cardWord"><strong>名称</strong></span>
                <span class="cardWord"><strong>公开</strong></span>
                <span class="cardWord"><strong>类型</strong></span>
                <span class="cardWord"><strong>上传时间</strong></span>
                <span class="cardWord"><strong>类型</strong></span>
              </el-card>
              <el-card v-for="res in historyResources" :key="res.code" class="card">
              <div class="card-row">
                <!-- 左侧内容 -->
                <div class="card-info">
                  <span class="cardWord">{{ res.name }}</span>
                  <span class="cardWord">{{ res.process_id===-1 ? '是' : '否' }}</span>
                  <span class="cardWord">{{ res.type }}</span>
                  <span class="cardWord">{{ res.date.split('T')[0] }}</span>
                  <span class="cardWord">
                  <template v-for="(tagIdx, idx) in String(res.tag).split(',')" :key="tagIdx">
                    {{ allTagsWhenCreate[Number(tagIdx)]?.name || allTagsWhenCreate[Number(tagIdx)] }}
                    <span v-if="idx !== String(res.tag).split(',').length - 1">, </span>
                  </template>
                </span>
                </div>

                <!-- 右侧按钮 -->
                <div class="card-actions">
                  <el-button class="cardButton"><span style="margin-top: 14px;" @click="previewRes(res.url)">预览</span></el-button>
                  <el-button class="cardButton"><span style="margin-top: 14px;" @click="downloadRes(res.res_id)">下载</span></el-button>
                </div>
              </div>
            </el-card>
          </el-drawer>
        </template>
      </el-tab-pane>
      <div style="height: 45vh;"></div>
    </el-tabs>
    
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,computed,inject } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRoute,onBeforeRouteLeave } from 'vue-router';
import router from '../router';
import { getCourseInfoById,createClass, getClassListByCourseId, getUserCourses,getAllClassListByCourseId, getStudentListByClassId,fetchAllStudents, fetchAllTeachers, addAssAndTeaToCourse, getTeacherListByCourseId, getProcessesByClassId, getResourcesByProcessId, getAllTags, downloadResource, getClassOfAssAndTeaOfCourse, getHistoryByResourceId, getStuClassByCourseId, deleteResource, getFinishRateOfStudent } from '../js/api.js';
import { animate } from 'animejs'
import { ElMessage } from 'element-plus';
import { lo } from 'element-plus/es/locales.mjs';
import { all } from 'axios';
import { Base64 } from 'js-base64';

const loading = inject('globalLoading'); // 全局 loading 状态
const route = useRoute();
const courseId = ref(0);
const status = ref(null); // 更换以模拟不同身份：0老师、1学生、2助教、3学生未选课、4老师与该课无关等
const userAllCourses = ref([]);
const judgeStatus = async () => {
  const userId = localStorage.getItem('userId');
  const rawStatus = Number(localStorage.getItem('userIdentity')); // 原始身份
  courseId.value = route.params.id; // 确保courseId已赋值
  const cid = Number(courseId.value);

  console.log("当前用户ID:"+userId);
  const res = await getUserCourses(userId);
  if (!res.success) {
    ElMessage({
      message: '获取用户课程信息失败',
      type: 'error',
      duration: 2000
    });
    return;
  }
  userAllCourses.value = res.data;
  console.log("用户所属所有课程:", userAllCourses.value);

  if (rawStatus === 0) {
    // 老师
    // userAllCourses.value 是课程id数组
    const courseList = userAllCourses.value[0];
    if (courseList && courseList.some(c => c.course_id === cid)) {
      status.value = 0; // 老师且与该课有关
    } else {
      status.value = 4; // 老师但与该课无关
    }
  } else if (rawStatus === 1) {
    // 学生
    // userAllCourses.value 是 [学生课程列表, 助教课程列表]
    const [studentCourses, assistantCourses] = userAllCourses.value;
    const inStudent = studentCourses && studentCourses.some(c => c.course_id === cid);
    const inAssistant = assistantCourses && assistantCourses.some(c => c.course_id === cid);
    if (inStudent) {
      status.value = 1; // 学生
    } else if (inAssistant) {
      status.value = 2; // 助教
    } else {
      status.value = 3; // 学生未选课
    }
  }
  // 测试用
  // status.value = 0;
  console.log("身份状态:", status.value);
}

const distance = ref('140px');
const distanceOfButton = ref('630px');
const contentOpacity = ref(1);

const handleScroll = () => {
  const currentScroll = window.pageYOffset;

  const scrollProgress = Math.min(currentScroll / 500, 1);
  distance.value = `${Math.max(140 - scrollProgress * 140,80)}px`;
  distanceOfButton.value = `${Math.max(630 - currentScroll, 110)}px`;
  contentOpacity.value = Math.max(0, 1 - scrollProgress);
};

const scrollToPos = () =>{
  window.scrollTo({
    top: 500,
    behavior: 'smooth'
  });
}
const scrollToTop = () =>{
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
} 


const courseInfo = ref({
  course_id: 0,
  name: '计算机组成原理',
  creator_id: 0,
  syllabus: '主要讲解CPU与内存的交互原理、指令流水线等内容。长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-',
  assMethod: '闭卷 + 实验报告',
  score: 3,
  time: 48
});

const getCourse = async (id) => {
  const res = await getCourseInfoById(id);
  return res;
};

const registerMouseEnter = () => {
  animate('.register-btn', {
    scale: 1.2,
    backgroundColor: '#FFFFFF', // 改为明确属性
    color: 'rgba(0, 0, 0, 0.8)', // 使用标准rgba格式
    duration: 300,
    easing: 'easeOutExpo'
  });
};

const registerMouseLeave = () => {
  animate('.register-btn', {
    scale: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 统一使用rgba格式
    color: 'rgba(203, 203, 203, 0.8)', // 保持格式一致
    duration: 300,
    easing: 'easeOutExpo'
  });
};

const imgMouseEnter = (str) => {
  animate(str, {
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    duration: 300,
    easing: 'easeOutExpo'
  });
};
const imgMouseLeave = (str) => {
  animate(str, {
    scale: 1,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    duration: 300,
    easing: 'easeOutExpo'
  });
};

const drawerOfAddAssAndTea = ref(false);
const drawerSearchTextOfAssAndTea = ref('');

const getAllTheStudents = async () => {
  const res = await fetchAllStudents();
  if (res.success) {
    allTheStudents.value = res.data;
  } else {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
};
const getAllTheTeachers = async()=>{
  const res = await fetchAllTeachers();
  if (res.success) {
    allTheTeachers.value = res.data;
  } else {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}
const allTheStudents = ref([
  { id: 101, username: 'stuA', name: '张三', email: 'zs@mail.com' },
  { id: 102, username: 'stuB', name: '李四', email: 'ls@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
]);
const allTheTeachers = ref([
  { id: 301, username: 'tchA', name: '赵六', email: 'zl@mail.com'}
]);
const drawerIsAssistant = ref("助教");
const drawerButtonChangeAssandTeaWord = computed(() => {
  if(drawerIsAssistant.value == "助教"){
    return "查看老师";
  }else{
    return "查看助教";
  }
});
const drawerChangeAssAndTea = () => {
  if(drawerIsAssistant.value == "助教"){
    drawerIsAssistant.value = "老师";
  }else{
    drawerIsAssistant.value = "助教";
  }
};
const drawerFilteredAssAndTea = computed(() => {
  const keyword = drawerSearchTextOfAssAndTea.value.trim().toLowerCase()

  return (drawerIsAssistant.value == "助教" ? allTheStudents : allTheTeachers).value
    .filter(student => {
      // 匹配任意字段
      return Object.values(student).some(value =>
        String(value).toLowerCase().includes(keyword)
      )
    })
    .sort((a, b) => {
      // 先按 class 排序（字符串），再按 id 排序（数字）
      return a.id - b.id
    })
})
const drawerCurrentPageOfAssAndTea = ref(1)
const handleDrawerPageChangeOfAssAndTea = (page) => {
  drawerCurrentPageOfAssAndTea.value = page
}
const drawerPagedAssAndTea = computed(() => {
  const start = (drawerCurrentPageOfAssAndTea.value - 1) * pageSize
  return drawerFilteredAssAndTea.value.slice(start, start + pageSize)
})
const drawerAddAssAndTea = async (username) => {
  const res = await addAssAndTeaToCourse(username,courseId.value);
  if(res.success === false) {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
    return;
  }
  drawerOfAddAssAndTea.value = false;
  await getCourseTeachers();
  ElMessage({
    message: '添加成功',
    type: 'success',
    duration: 2000
  });
}


const dealWithButtonClick = () => {
  if(status.value == 1){
    router.push('/class/' + targetClass.value.class_id);
  }
  if(status.value == 0){
    drawerOfAddAssAndTea.value = true;
  }
}


const navItems = computed(() => {
  if(status.value == 1){
    return ['班级','助教/老师','资源'];
  }
  if(status.value == 0||status.value == 2){
    return ['学生', '班级', '助教/老师', '资源'];
  }
  if(status.value == 3||status.value == 4){
    return ['班级','助教/老师'];
  }
});

const currentTab = ref('助教/老师');

const searchText = ref('');

const sampleStudents = ref([
  { id: 101, username: 'stuA', name: '张三', email: 'zs@mail.com',class: 'C101',finishRate: [0, 0] },
  { id: 102, username: 'stuB', name: '李四', email: 'ls@mail.com',class: 'C101' ,finishRate: [0, 0]},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102',finishRate: [0, 0]},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102',finishRate: [0, 0]},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102',finishRate: [0, 0]},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102',finishRate: [0, 0]},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102',finishRate: [0, 0]},
]);
const getStudentsOfCourse = async ()=>{
  sampleStudents.value = [];
  for(let i=0;i<sampleClasses.value.length;i++){
    const res = await getStudentListByClassId(courseId.value,sampleClasses.value[i].class_id,localStorage.getItem('userId'));
    sampleStudents.value = sampleStudents.value.concat(res.data);
  }
  console.log("获取到的学生列表:",sampleStudents.value);
  for(let i=0;i<sampleStudents.value.length;i++){
    const res = await getClassListByCourseId(courseId.value,sampleStudents.value[i].user_id);
    // const res = await getStuClassByCourseId(courseId.value,sampleStudents.value[i].user_id);
    if (res.success) {
      sampleStudents.value[i].class = res.data[0].name;
    } else {
      sampleStudents.value[i].class = '无';
    }
    const res2 = await getFinishRateOfStudent(sampleStudents.value[i].user_id,courseId.value,res.data[0].class_id);
    if(res2.success){
      sampleStudents.value[i].finishRate = res2.data;
    }else{
      sampleStudents.value[i].finishRate = [];
      ElMessage({
        message: res2.errorMsg,
        type: 'error',
        duration: 2000
      });
    }
  }
}

const filteredStudents = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()

  return sampleStudents.value
    .filter(student => {
      // 匹配任意字段
      return Object.values(student).some(value =>
        String(value).toLowerCase().includes(keyword)
      )
    })
    .sort((a, b) => {
      // 先按 class 排序（字符串），再按 id 排序（数字）
      if (a.class < b.class) return -1
      if (a.class > b.class) return 1
      return a.id - b.id
    })
})
const currentPage = ref(1)
const pageSize = 10

const pagedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredStudents.value.slice(start, start + pageSize)
})

const handlePageChange = (page) => {
  currentPage.value = page
}

const getClassOfAssAndTea = async(user)=>{
  const res2 = await getClassOfAssAndTeaOfCourse(courseId.value,user.user_id);
  if (res2.success) {
    user.classes = res2.data.map(cls => cls.name);
  } else {
    user.classes = [];
  }
  if (user.identity === 0) {
    sampleTeachers.value.push(user);
  } else if (user.identity === 1) {
    sampleAssistants.value.push(user);
  }
}

const getCourseTeachers = async () => {
  const res = await getTeacherListByCourseId(courseId.value);
  if (res.success) {
    // 清空原有数据
    sampleTeachers.value = [];
    sampleAssistants.value = [];
    // 遍历并分类
    for(const user of res.data) {
      await getClassOfAssAndTea(user);
    }
  } else {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}

const sampleAssistants = ref([
  { id: 201, username: 'taA', name: '王五', mail: 'ww@mail.com',classes:['C101','C102'] },
  { id: 201, username: 'taA', name: '王五', mail: 'ww@mail.com',classes:[] }
]);

const sampleTeachers = ref([
  { id: 301, username: 'tchA', name: '赵六', mail: 'zl@mail.com',classes:['C101','C102'] }
]);

const isAssistant = ref("助教");
const changeAssandTeaWord = computed(() => {
  if(isAssistant.value == "助教"){
    return "查看老师";
  }else{
    return "查看助教";
  }
});
const changeAssAndTea = () => {
  if(isAssistant.value == "助教"){
    isAssistant.value = "老师";
  }else{
    isAssistant.value = "助教";
  }
};
const searchTextOfAssAndTea = ref('');
const filteredAssAndTea = computed(() => {
  const keyword = searchTextOfAssAndTea.value.trim().toLowerCase()

  return (isAssistant.value == "助教" ? sampleAssistants : sampleTeachers).value
    .filter(student => {
      // 匹配任意字段
      return Object.values(student).some(value =>
        String(value).toLowerCase().includes(keyword)
      )
    })
    .sort((a, b) => {
      // 先按 class 排序（字符串），再按 id 排序（数字）
      return a.id - b.id
    })
})
const currentPageOfAssAndTea = ref(1)
const pagedAssAndTea = computed(() => {
  const start = (currentPageOfAssAndTea.value - 1) * pageSize
  return filteredAssAndTea.value.slice(start, start + pageSize)
})
const handlePageChangeOfAssAndTea = (page) => {
  currentPageOfAssAndTea.value = page
}

const targetClass = ref(null);
const sampleClasses = ref([
  { class_code: 'C101',name:'a班', class_id:0,color: 'rgb(123,29,33)' },
  { class_code: 'C202',name:'b班',class_id:1,color: 'rgb(122,122,180)' }
]);
const jumpToClass = (id) => {
  if(status.value == 1){
    if(targetClass.value.class_id == id){
      router.push('/class/' + id);
      return;
    }else{
      ElMessage({
        message: '无法访问别人的班级',
        type: 'warning',
        duration: 2000
      });
    }
  }
  router.push('/class/' + id);
};
const getClass = async (id) => {
  const res = await getClassListByCourseId(id,localStorage.getItem('userId'));
  console.log("Class info:",res.data);
  if (res.success) {
    targetClass.value = res.data[0];
  } else {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
};
const finishRateOfStu = ref([]);
const getFinishRate = async()=>{
  const res = await getFinishRateOfStudent(localStorage.getItem('userId'),courseId.value,targetClass.value.class_id);
  if(res.success){
    finishRateOfStu.value = res.data;
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}
const getAllClasses = async (id) => {
  const res = await getAllClassListByCourseId(id,localStorage.getItem('userId'));
  console.log(res);
  return res;
};

const drawerOfCreatingClass = ref(false);

const createClassForm = ref({
  code:'',
  name: '',
  id:-1,
  color: '',
});

//创建班级
const createClassSubmit = async () => {
  drawerOfCreatingClass.value = false;
  createClassForm.value = await createClass(courseInfo.value.course_id,createClassForm.value.name);
  createClassForm.value.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  sampleClasses.value.push(createClassForm.value);
  console.log(createClassForm.value);
  ElMessage({
    message: '班级创建成功'+createClassForm.value.name,
    type: 'success',
    duration: 2000
  });
  createClassForm.value = {
    code:'',
    name: '',
    id:-1,
    color: '',
  };
};

const fetchAllTags = async () => {
  const res = await getAllTags();
  if (res.success) {
    allTagsWhenCreate.value = res.data;
    selectedTags.value = res.data; // 默认选中所有标签
  } else {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
};

const allTags = ref([]);
const selectedTags = ref(['讲义', '作业', '实验', '通知']);
const allTagsWhenCreate = ref([]);

const fetchAllResources = async ()=>{
  sampleResources.value = [];
  for(let i=0;i<sampleClasses.value.length;i++){
    if(status.value == 1 && sampleClasses.value[i].class_id != targetClass.value.class_id){
      continue; // 学生只能查看自己所在班级的资源
    }
    const res = await getProcessesByClassId(courseId.value,sampleClasses.value[i].class_id);
    if(res.success){
      
    }else{
      ElMessage({
        message: res.errorMsg,
        type: 'error',
        duration: 2000
      });
      return;
    }
    const allTheProcesses = res.data;
    if(allTheProcesses.length == 0){
      continue;
    }
    // 遍历所有的流程，获取每个流程下的资源
    for(let j=0;j<allTheProcesses.length;j++){
      const res2 = await getResourcesByProcessId(courseId.value,allTheProcesses[j].process_id);
      if(res2.success){
        sampleResources.value = sampleResources.value.concat(res2.data);
      }else{
        ElMessage({
          message: res2.errorMsg,
          type: 'error',
          duration: 2000
        });
      }
    }
  }
  const res2 = await getResourcesByProcessId(courseId.value,-1);
  if(res2.success){
    sampleResources.value = sampleResources.value.concat(res2.data);
  }else{
    ElMessage({
      message: res2.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
  for(let i=0;i<sampleResources.value.length;i++){
    const tagIndexes = String(sampleResources.value[i].tag).split(',').map(s => s.trim());
    tagIndexes.forEach(idx => {
      const tagName = allTagsWhenCreate.value[Number(idx)];
      if (tagName && !allTags.value.includes(tagName)) {
        allTags.value.push(tagName);
      }
    });
  }
  console.log("获取到的资源列表:",sampleResources.value);
}
const sampleResources = ref([
  { res_id:0,url:"",res_code: 'R001', name: '实验一', process_id: 0, type: 'PDF', date: '2025-05-01', tag: '实验' },
  { res_id:0,url:"",res_code: 'R002', name: '课程通知', process_id: false, type: 'DOCX', date: '2025-04-28', tag: '通知' },
  { res_id:0,url:"",res_code: 'R003', name: '作业一', process_id: true, type: 'PDF', date: '2025-05-03', tag: '作业' },
  { res_id:0,url:"",res_code: 'R003', name: '作业一', process_id: true, type: 'PDF', date: '2025-05-03', tag: '作业' },
  { res_id:0,url:"",res_code: 'R003', name: '作业一', process_id: true, type: 'PDF', date: '2025-05-03', tag: '作业' },
  { res_id:0,url:"",res_code: 'R003', name: '作业一', process_id: true, type: 'PDF', date: '2025-05-03', tag: '作业' }
]);

const filteredResources = computed(() =>
  sampleResources.value.filter((r) => {
    const tagIndexes = String(r.tag).split(',').map(s => s.trim());
    // 只要有一个 tag 被选中就显示
    return (
      selectedTags.value.length === 0 ||
      tagIndexes.some(idx => selectedTags.value.includes(allTagsWhenCreate.value[Number(idx)]))
    );
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
);
const currentPageOfRes = ref(1);
const pagedResources = computed(() => {
  const start = (currentPageOfRes.value - 1) * pageSize
  return filteredResources.value.slice(start, start + pageSize)
})
const handlePageChangeOfRes = (page) => {
  currentPageOfRes.value = page
}

const historyResources = ref([
  { id:0,url:"",code: 'R001', name: '实验一', public: true, type: 'PDF', date: '2025-05-01', tag: '实验' },
  { id:0,url:"",code: 'R001', name: '课程通知', public: false, type: 'DOCX', date: '2025-04-28', tag: '通知' },
  { id:0,url:"",code: 'R001', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' }
]);

const drawerOfSearchHistory = ref(false);
const searchHistory = async (id) => {
  drawerOfSearchHistory.value = true;
  console.log("查询资源历史，资源ID:", id);
  const res = await getHistoryByResourceId(id);
  if (res.success) {
    historyResources.value = res.data;
  } else {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}
const previewRes = (url) => {
  window.open('http://101.42.92.21:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
};
const downloadRes = async (id) => {
  const res = await downloadResource(id);
  if (!res.success) {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
    return;
  }
  window.open(res.data);
  ElMessage({
    message: '下载成功',
    type: 'success',
    duration: 2000
  });
}
const deleteRes = async(id)=>{
  const res = await deleteResource(id);
  if(!res.success) {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
    return;
  }else{
    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 2000
    });
    await fetchAllResources();
  }
}


const goToProfile = (id) => {
  router.push(`/profile/${id}`);
};

const loadingMask = ref(null);
onMounted(async () => {
  courseId.value = route.params.id;
  console.log(courseId.value);
  // 获取课程信息
  await getCourse(courseId.value).then((res) => {
    courseInfo.value = res.data;
    console.log(courseInfo.value);
  });
  // 获取用户状态
  await judgeStatus();

  // 获取课程下的班级列表
  await getAllClasses(courseId.value).then((res) => {
    sampleClasses.value = res.data;
    for (let i = 0; i < sampleClasses.value.length; i++) {
      sampleClasses.value[i].color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }
  });
  

  console.log("用户状态2："+status.value);
  // 学生：获取自己所属班级
  if(status.value == 1){
    await getClass(courseId.value);
  }
  console.log("获取到的班级信息:",targetClass.value);
  if(status.value == 1){
    await getFinishRate();
  }
  // 助教/老师：获取课程所有学生;获得所有学生列表（添加助教);获取所有老师列表（添加老师）
  if(status.value == 0||status.value == 2){
    await getStudentsOfCourse();
    await getAllTheStudents();
    await getAllTheTeachers();
  }

  // 所有用户：查看该课程的助教和老师
  await getCourseTeachers();
  
  if(status.value != 3 && status.value != 4){
    // 获取课程下的所有资源
    await fetchAllTags();
    await fetchAllResources();
  }

  window.addEventListener('scroll', handleScroll)
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<style scoped>
.loading-mask {
  position: fixed;
  left: 0; top: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(90deg, #414141 0%, #414141 100%);
  z-index: 9980;
  transition: width 0.8s cubic-bezier(.77,0,.18,1);
  pointer-events: all;
}

/* 可选：淡出动画 */
.slide-fade-leave-active {
  transition: opacity 0.5s;
}
.slide-fade-leave-to {
  opacity: 0;
}

.background-layer {
  position: fixed;
  height: 100vh;
  width:100%;
    background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), 
              url('../assets/course_id_background.jpg');
  background-size: cover;
  margin-top: -80px;
  margin-left: -8px;
  background-position: center;
  z-index: 1;
}
.courseNameTitle {
  position: relative;
  color: rgb(206, 206, 206);
  font-size: 4rem;
  text-align: left;
  
  margin-left: 80px;
  font-weight: bold;
}
.courseInfoContent {
  position: relative;
  color: rgb(206, 206, 206);
  font-size: 1.5rem;
  text-align: left;
  margin-top: 20px;
  margin-left: 80px;
  max-width: 800px;
}
.register-btn {
  position: absolute;
  right: 40px;
  bottom: 60px;
  background-color: rgba(255, 255, 255, 0.1); 
  color: rgba(203, 203, 203, 0.8) ; 
  border: none !important;
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 25px !important;
  backdrop-filter: blur(5px);
  /* transition: all 0.3s ease; */
  /* 添加初始缩放 */
  /* transform: scale(1); */
  /* 防止Element UI覆盖 */
  box-shadow: none !important;

}

.tabs-container {
  position: relative;
  top: 600px;
  max-height: calc(100vh - 170px);
  overflow-y: auto;
  z-index: 1;

  background-color: rgb(255, 255, 255,0.05);
  /* 隐藏滚动条，保留滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.tabs-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari 和新版 Edge */
}


/* 使 tabs 栏固定在容器顶部 */
.main-tabs :deep(.el-tabs__header ) {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color:transparent; /* 可自定义背景 */
  /* color:rgb(255,255,255,1); */
}
.main-tabs :deep(.el-tabs__content) {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE 10+ */
}
.coponent-title {
  color: #c5c5c5;
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 80px;
  margin-right: 80px;
}

.descriptions-label {
  color: #424242;
  font-size: 1.2rem;
  font-weight: bold;
  width: 120px;
}
.descriptions-content{
  color: #424242;
  font-size: 1.2rem;
  width: 120px;
}
.class-box {
  height: 200px;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.7);
}

/* 上半部分：颜色块 */
.color-block {
  flex: 1;
  height: 140px;
  margin-top: -20px;
  margin-left:-20px;
  margin-right:-20px;
}

/* 下半部分：文字区域 */
.class-code {
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #313131;
}
.tag-selector {
  margin: 20px;
  display: flex;
  flex-wrap: wrap;
}
.card{
  margin-bottom: 5px;
}
.cardWord{
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 10px; 
  display: inline-block;
  width: 180px;
}
.drawer-card-word{
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 10px; 
  display: inline-block;
  width: 60px;
}
.cardButton{
  margin-top: -50px;
  height: 90px;
  width: 100px;
  margin-bottom: -50px;
  margin-right: -22px;
  font-size: 1.1rem;
  transition: all 0.3s ease-in-out !important;
}
.cardButton:hover{
  background-color: rgb(66, 66, 66);
  color: white;
}
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  display: flex;
  flex-wrap: wrap; /* 可换行，也可不加 */
}
.card-actions {
  display: flex;
  gap: 10px;
  margin-right: 10px;
}
</style>
