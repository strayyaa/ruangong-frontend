<template>
  <NavBar />
  <div class = "background-layer">
    <h1 :style = "{'margin-top': distance}" class="courseNameTitle" @click="scrollToTop">{{ courseInfo.name }}</h1>
    <p :style = "{opacity:contentOpacity}" class="courseInfoContent">大纲：{{ courseInfo.syllabus }}</p>
    <p :style = "{opacity:contentOpacity}" class="courseInfoContent">考核方式：{{ courseInfo.assMethod }}</p>
    <p :style = "{opacity:contentOpacity}" class="courseInfoContent">学分：{{ courseInfo.score }}</p>
    <p :style = "{opacity:contentOpacity}" class="courseInfoContent">学时：{{ courseInfo.time }}</p>
    <el-button
        v-if = "status == 1"
        class="register-btn"
        :style = "{top: distanceOfButton}"
        @mouseenter="registerMouseEnter"
        @mouseleave="registerMouseLeave"
        @click="dealWithButtonClick"
    >->进入班级</el-button>

    <el-button
        v-if = "status == 0"
        class="register-btn"
        :style = "{top: distanceOfButton}"
        @mouseenter="registerMouseEnter"
        @mouseleave="registerMouseLeave"
        @click="dealWithButtonClick"
    >->添加课程助教/老师</el-button>

    <el-button
        v-if = "status == 3"
        class="register-btn"
        :style = "{top: distanceOfButton}"
        @mouseenter="registerMouseEnter"
        @mouseleave="registerMouseLeave"
        @click="dealWithButtonClick"
    >->选择课程</el-button>

    <el-drawer
      title="添加助教/老师"
      v-model="drawerOfAddAssAndTea"
      :direction="'rtl'"
      :before-close="(done) => { drawerOfAddAssAndTea = false; done(); }"
      style="z-index: 1001;"
      :append-to-body="true">
      <div style="margin-left: 20px;margin-top: 0px;">
        <el-button 
        style="margin-right: 20px;margin-top: -30px;scale: 1.2;font-size: 1rem;font-weight: bold;"
        @click="drawerChangeAssAndTea">{{ drawerButtonChangeAssandTeaWord }}</el-button>
        <div>
          <span style="color: rgb(135,135,135);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">搜索{{drawerIsAssistant}}：</span>
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
              <span class="drawer-card-word">{{ assAndTea.id }}</span>
              <span class="drawer-card-word">{{ assAndTea.username }}</span>
              <span class="drawer-card-word">{{ assAndTea.name }}</span>
              <span class="drawer-card-word">{{ assAndTea.email }}</span>
            </div>

            <!-- 右侧按钮 -->
            <div class="card-actions">
              <el-button class="cardButton"><span style="margin-top: 14px;" @click="drawerAddAssAndTea(assAndTea.id)">添加</span></el-button>
            </div>
          </div>
        </el-card>
        <el-pagination
          v-if="drawerFilteredAssAndTea.length > pageSize"
          layout="prev, pager, next"
          :total="drawerFilteredAssAndTea.length"
          :page-size="pageSize"
          :current-page="drawerCurrentPageOfAssAndTea"
          @current-change="handlePageChangeOfAssAndTea"
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
          v-for="student in pagedStudents" :key="student.id" border style="margin-bottom: 2px;" 
          class="descriptions"
          @click="goToProfile(student.id)">
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  {{ student.id }}
                </div>
              </template>
              <div class="descriptions-content">
                <strong>{{ student.username }}</strong>
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  {{ student.name }}
                </div>
              </template>
              <div class="descriptions-content">
                {{ student.email }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  {{ student.class }}
                </div>
              </template>
              <div class="descriptions-content">
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
              <el-card class="class-box" @click="router.push('/class/' + cls.id)">
                <div class="color-block" :style="{ backgroundColor: cls.color }"></div>
                <div class="class-code">{{ cls.code }}-{{ cls.name }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="class-box" @click="drawerOfCreatingClass = true">
                <div class="color-block" style=" background-color: rgb(30,150,230) "></div>
                <div class="class-code">添加课程</div>
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
          class="descriptions">
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
          @click="goToProfile(assAndTea.id)">
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  {{ assAndTea.id }}
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
                {{ assAndTea.email }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  <span class = "descriptions-content" v-if="assAndTea.classes.length == 0">无</span>
                  <span class="descriptions-content" v-for="(cls,index) in assAndTea.classes" :key="cls">
                    {{ cls }}
                  <span v-if="index!=assAndTea.classes.length-1">, </span>
                  </span>
                </div>
              </template>
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
              <span style="font-size: 1.5rem;font-weight: bold;">{{ tag }}</span>
            </el-checkbox>
          </el-checkbox-group>

          <el-card class="card">
            <span class="cardWord"><strong>资源编码</strong></span>
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
                <span class="cardWord">{{ res.code }}</span>
                <span class="cardWord">{{ res.name }}</span>
                <span class="cardWord">{{ res.public ? '是' : '否' }}</span>
                <span class="cardWord">{{ res.type }}</span>
                <span class="cardWord">{{ res.date }}</span>
                <span class="cardWord">{{ res.tag }}</span>
              </div>

              <!-- 右侧按钮 -->
              <div class="card-actions">
                <el-button class="cardButton"><span style="margin-top: 14px;" @click="searchHistory(res.code)">查询历史</span></el-button>
                <el-button class="cardButton"><span style="margin-top: 14px;" @click="previewRes(res.id)">预览</span></el-button>
                <el-button class="cardButton"><span style="margin-top: 14px;" @click="downloadRes(res.id)">下载</span></el-button>
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
                <span class="cardWord"><strong>资源编码</strong></span>
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
                  <span class="cardWord">{{ res.code }}</span>
                  <span class="cardWord">{{ res.name }}</span>
                  <span class="cardWord">{{ res.public ? '是' : '否' }}</span>
                  <span class="cardWord">{{ res.type }}</span>
                  <span class="cardWord">{{ res.date }}</span>
                  <span class="cardWord">{{ res.tag }}</span>
                </div>

                <!-- 右侧按钮 -->
                <div class="card-actions">
                  <el-button class="cardButton"><span style="margin-top: 14px;" @click="previewRes(res.id)">预览</span></el-button>
                  <el-button class="cardButton"><span style="margin-top: 14px;" @click="downloadRes(res.id)">下载</span></el-button>
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
import { ref, onMounted, onUnmounted,computed } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRoute } from 'vue-router';
import router from '../router';
import { getCourseInfoById,createClass } from '../js/api.js';
import { animate } from 'animejs'
import { ElMessage } from 'element-plus';

const route = useRoute();
const courseId = ref(0);
const status = ref(0); // 更换以模拟不同身份：0老师、1学生、2助教、3学生未选课、4老师与该课无关等
const belongingClass = ref(0); // 学生在该课程的班级

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
  syllabus: '主要讲解CPU与内存的交互原理、指令流水线等内容。长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-',
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
    return "切换到老师";
  }else{
    return "切换到助教";
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
const drawerPagedAssAndTea = computed(() => {
  const start = (drawerCurrentPageOfAssAndTea.value - 1) * pageSize
  return drawerFilteredAssAndTea.value.slice(start, start + pageSize)
})
const drawerAddAssAndTea = (id) => {
  ElMessage({
    message: '添加成功',
    type: 'success',
    duration: 2000
  });
}

//待完成
const dealWithButtonClick = () => {
  if(status.value == 1){

  }
  if(status.value == 0){
    drawerOfAddAssAndTea.value = true;
  }
}


const navItems = computed(() => {
  if(status.value == 1){
    return ['助教/老师','资源'];
  }
  if(status.value == 0||status.value == 2||status.value == 4){
    return ['学生', '班级', '助教/老师', '资源'];
  }
  if(status.value == 3){
    return ['助教/老师'];
  }
});

const currentTab = ref('助教/老师');

const searchText = ref('');

const sampleStudents = ref([
  { id: 101, username: 'stuA', name: '张三', email: 'zs@mail.com',class: 'C101' },
  { id: 102, username: 'stuB', name: '李四', email: 'ls@mail.com',class: 'C101' },
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
]);
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

const sampleAssistants = ref([
  { id: 201, username: 'taA', name: '王五', email: 'ww@mail.com',classes:['C101','C102'] },
  { id: 201, username: 'taA', name: '王五', email: 'ww@mail.com',classes:[] }
]);

const sampleTeachers = ref([
  { id: 301, username: 'tchA', name: '赵六', email: 'zl@mail.com',classes:['C101','C102'] }
]);

const isAssistant = ref("助教");
const changeAssandTeaWord = computed(() => {
  if(isAssistant.value == "助教"){
    return "切换到老师";
  }else{
    return "切换到助教";
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


const sampleClasses = ref([
  { code: 'C101',name:'a班', id:0,color: 'rgb(123,29,33)' },
  { code: 'C202',name:'b班',id:1,color: 'rgb(122,122,180)' }
]);

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
  ElMessage({
    message: '班级创建成功'+createClassForm.value.name,
    type: 'success',
    duration: 2000
  });
  // createClassForm.value = await createClass(courseInfo.value.course_id,createClassForm.value.name,createClassForm.value.name);
  createClassForm.value.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  sampleClasses.value.push(createClassForm.value);
  createClassForm.value = {
    code:'',
    name: '',
    id:-1,
    color: '',
  };
};

const allTags = ['讲义', '作业', '实验', '通知'];
const selectedTags = ref(['讲义', '作业', '实验', '通知']);

const sampleResources = ref([
  { id:0,url:"",code: 'R001', name: '实验一', public: true, type: 'PDF', date: '2025-05-01', tag: '实验' },
  { id:0,url:"",code: 'R002', name: '课程通知', public: false, type: 'DOCX', date: '2025-04-28', tag: '通知' },
  { id:0,url:"",code: 'R003', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' },
  { id:0,url:"",code: 'R003', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' },
  { id:0,url:"",code: 'R003', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' },
  { id:0,url:"",code: 'R003', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' }
]);

const filteredResources = computed(() =>
  sampleResources.value.filter((r) => selectedTags.value.includes(r.tag))
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
const searchHistory = (code) => {
  drawerOfSearchHistory.value = true;
}
const previewRes = (id) => {
  
};
const downloadRes = (id) => {
  ElMessage({
    message: '下载成功',
    type: 'success',
    duration: 2000
  });
}


const goToProfile = (id) => {
  router.push(`/profile/${id}`);
};

onMounted(() => {
  courseId.value = route.params.id;
  getCourse(courseId.value).then((res) => {
    courseInfo.value = res;
  });

  window.addEventListener('scroll', handleScroll)
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<style scoped>
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
  z-index: -1;
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
  width: 300px;
}
.descriptions-content{
  color: #424242;
  font-size: 1.2rem;
  width: 250px;
}
.class-box {
  height: 200px;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 10px; 
  display: inline-block;
  width: 140px;
}
.drawer-card-word{
  font-size: 1rem;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 10px; 
  display: inline-block;
  width: 40px;
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
