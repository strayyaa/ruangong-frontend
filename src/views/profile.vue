<template>
  <el-container class="profile-page">
    <div class="background-layer">
      <h1 class="background-title">
        <span class="toanimate">个</span>
        <span class="toanimate">人</span>
        <span class="toanimate">空</span>
        <span class="toanimate">间</span>
      </h1>
    </div>
    <div class="profile-main-content">
      <!-- 个人信息卡片 -->
      <el-card class="profile-info-card">
        <div class="profile-info-header">
          <el-avatar :size="80" :src="user.avatar" />
          <div class="user-basic">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-identity">{{ user.identity }}</div>
            <div class="user-id">学号：{{ user.studentId }}</div>
            <div class="user-email">邮箱：{{ user.email }}</div>
            <div class="user-birthday">生日：{{ user.birthday }}</div>
          </div>
          <el-button class="edit-btn" type="primary" size="small" @click="startEdit" v-if="!editing && isCurrentUser">修改资料</el-button>
        </div>
        <el-form v-if="editing" :model="editUser" :rules="rules" ref="formRef" label-width="80px" class="profile-edit-form">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editUser.name" />
          </el-form-item>
          <el-form-item label="身份" prop="identity">
            <el-input v-model="editUser.identity" disabled />
          </el-form-item>
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="editUser.studentId" disabled />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUser.email" />
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="editUser.birthday" type="date" style="width: 100%" />
          </el-form-item>
          <div class="btn-group">
            <el-button type="success" @click="saveInfo">保存</el-button>
            <el-button @click="cancelEdit">取消</el-button>
          </div>
        </el-form>
      </el-card>

      <!-- 加入的课程 -->
      <!-- <div class="section-title">加入的课程</div>
      <div class="courses-list">
        <el-card v-for="course in courses" :key="course.id" class="course-card">
          <div class="course-cover">[课程封面] {{ course.title }}</div>
          <div class="course-info">{{ course.desc }}</div>
        </el-card>
      </div> -->

      <!-- 我的任务 -->
      <!-- <div class="section-title">我的任务</div>
      <div class="tasks-list">
        <el-card v-for="task in tasks" :key="task.id" class="task-card">
          <div class="task-title">{{ task.title }}</div>
          <div class="task-desc">{{ task.desc }}</div>
          <div class="task-deadline">截止日期：{{ task.deadline }}</div>
        </el-card>
      </div> -->
    </div>
  </el-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { animate } from 'animejs'
import { getUserInfoById } from '../js/api'

const route = useRoute()
const userId = route.params.id
const currentUserId = localStorage.getItem('userId');

const isCurrentUser = ref(userId === currentUserId);

const editing = ref(false)
const formRef = ref()
const user = reactive({
  avatar: '',
  studentId: '',
  name: '',
  identity: '',
  email: '',
  birthday: '',
  registerTime: '',
})
const editUser = ref({})
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
}
const courses = ref([])
const tasks = ref([])

const fetchUserInfo = async () => {
  try {
    console.log(777)
    const res = await getUserInfoById(route.params.id)
    console.log(888)
    user.studentId = res.username || ''
    user.name = res.name || ''
    user.identity = res.identity === 0 ? '老师' : '同学'
    user.email = res.mail || ''
    user.birthday = res.birthday || ''
    console.log(isCurrentUser.value)
    console.log(currentUserId)
    console.log(userId)
    // console.log()
    // 这里可以根据实际接口返回的数据结构调整
    // courses.value = data.courses || []
    // tasks.value = data.tasks || []
  } catch (e) {
    console.log(999)
    ElMessage.error('获取用户信息失败')
  }
}

const startEdit = () => {
  editUser.value = { ...user }
  editing.value = true
}
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};
const saveInfo = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const newUser = { ...editUser.value };
      newUser.birthday = formatDate(newUser.birthday);
      Object.assign(user, newUser);
      editing.value = false;
      ElMessage.success('保存成功')
    }
  })
}
const cancelEdit = () => {
  editing.value = false
}

onMounted(() => {
  animate('.toanimate', {
    y: [
      { to: '-2.75rem', ease: 'outExpo', duration: 600 },
      { to: '0px', ease: 'outBounce', duration: 800, delay: 100 }
    ],
    delay: (_, i) => i * 50,
    ease: 'inOutCirc',
    loopDelay: 3000,
    loop: true
  })
  console.log(666)
  fetchUserInfo()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  background: transparent;
}
.background-layer {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)),
              url('../assets/backgroundimage_example.jpg');
  background-size: cover;
  background-position: center;
  z-index: -1;
}
.background-title {
  position: relative;
  top: 5%;
  z-index: 2;
  text-align: center;
  color: white;
  font-size: 4rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
.toanimate {
  display: inline-block;
  margin: 0 5px;
  position: relative;
}
.profile-main-content {
  max-width: 900px;
  margin: 140px auto 0 auto;
  padding-bottom: 60px;
}
.profile-info-card {
  background: rgba(255,255,255,0.13);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  padding: 32px 32px 16px 32px;
  backdrop-filter: blur(10px);
  margin-bottom: 32px;
}
.profile-info-header {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
}
.user-basic {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
  flex-grow: 1;
}
.user-name {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
}
.user-identity {
  color: #ffd04b;
  font-size: 1.1rem;
}
.user-id, .user-email, .user-birthday {
  color: #fff;
  font-size: 1rem;
}

.profile-edit-form {
  margin-top: 16px;
}
.btn-group {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
.section-title {
  color: #ffd04b;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 32px 0 16px 0;
}
.courses-list {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}
.course-card {
  min-width: 220px;
  background: rgba(255,255,255,0.08);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 18px 16px;
  color: #fff;
}
.course-cover {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
}
.course-info {
  font-size: 1rem;
  color: #ffd04b;
}
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 40px;
}
.task-card {
  background: rgba(255,255,255,0.08);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 18px 16px;
  color: #fff;
}
.task-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 6px;
}
.task-desc {
  font-size: 1rem;
  color: #ffd04b;
  margin-bottom: 4px;
}
.task-deadline {
  font-size: 0.95rem;
  color: #fff;
}
:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
:deep(.el-input__inner) {
  color: #fff;
}
:deep(.el-input__prefix) {
  color: rgba(255, 255, 255, 0.7);
}
:deep(.el-form-item__label) {
  color: #fff;
  font-size: 1.1rem;
}
</style>