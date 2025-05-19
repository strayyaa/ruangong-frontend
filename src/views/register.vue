<template>
  <el-container>
    <div class="background-layer">
      <h1 class="background-title">
        <span class="toanimate">注</span>
        <span class="toanimate">册</span>
        <span class="toanimate">新</span>
        <span class="toanimate">用</span>
        <span class="toanimate">户</span>
      </h1>
    </div>
    <div class="form-container">
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" class="register-form">
        <el-form-item prop="studentId">
          <el-input v-model="registerForm.studentId" placeholder="学号">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="birthday">
          <el-date-picker v-model="registerForm.birthday" type="date" placeholder="生日（可选）" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="邮箱">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain style="width: 100%">发送验证码</el-button>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="registerForm.code" placeholder="验证码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="role">
          <el-radio-group v-model="registerForm.role">
            <el-radio label="student">学生</el-radio>
            <el-radio label="teacher">教师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button class="submit-btn" @click="handleRegister">注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" @click="goLogin">已有账号？去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </el-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { animate } from 'animejs'

const router = useRouter()
const registerForm = reactive({
  studentId: '',
  password: '',
  confirmPassword: '',
  birthday: '',
  email: '',
  code: '',
  role: 'student'
})
const registerRules = {
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择身份', trigger: 'change' }]
}
const handleRegister = async () => {
  // TODO: 注册逻辑
  ElMessage.success('注册成功')
  router.push('/login')
}
const goLogin = () => {
  router.push('/login')
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
})
</script>

<style scoped>
.background-layer {
  position: fixed;
  height: 100vh;
  width: 100%;
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
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: 200px;
}
.register-form {
  margin-top: -10px;
}
.submit-btn {
  width: 100%;
  height: 40px;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  transition: all 0.3s ease;
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

:deep(.el-radio__label) {
  color: rgba(255, 255, 255, 0.7);
}
</style> 