<template>
  <el-container>
    <div class="background-layer">
      <h1 class="background-title">
        <span class="toanimate">课</span>
        <span class="toanimate">程</span>
        <span class="toanimate">管</span>
        <span class="toanimate">理</span>
        <span class="toanimate">平</span>
        <span class="toanimate">台</span>
      </h1>
    </div>

    <div class="form-container">
      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名">
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="密码">
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button 
                class="submit-btn"
                @mouseenter="submitMouseEnter"
                @mouseleave="submitMouseLeave"
                @click="handleLogin"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="注册" name="register">
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" class="register-form">
            <el-form-item prop="username">
              <el-input v-model="registerForm.username" placeholder="用户名">
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
            <el-form-item prop="role">
              <el-radio-group v-model="registerForm.role">
                <el-radio label="student">学生</el-radio>
                <el-radio label="teacher">教师</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button 
                class="submit-btn"
                @mouseenter="submitMouseEnter"
                @mouseleave="submitMouseLeave"
                @click="handleRegister"
              >注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { animate } from 'animejs'

const router = useRouter()
const activeTab = ref('login')

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
})

// 注册表单
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  role: 'student'
})

// 表单验证规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const registerRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
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
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 按钮动画效果
const submitMouseEnter = () => {
  animate('.submit-btn', {
    scale: 1.1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    duration: 300,
    easing: 'easeOutExpo'
  })
}

const submitMouseLeave = () => {
  animate('.submit-btn', {
    scale: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    duration: 300,
    easing: 'easeOutExpo'
  })
}

// 登录处理
const handleLogin = async () => {
  try {
    // TODO: 实现登录逻辑
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (error) {
    ElMessage.error('登录失败')
  }
}

// 注册处理
const handleRegister = async () => {
  try {
    // TODO: 实现注册逻辑
    ElMessage.success('注册成功')
    activeTab.value = 'login'
  } catch (error) {
    ElMessage.error('注册失败')
  }
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
.el-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

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
  top: 20%;
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
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: 300px;
}

.login-tabs {
  width: 100%;
}

.login-form,
.register-form {
  margin-top: 20px;
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

:deep(.el-tabs__item) {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}

:deep(.el-tabs__item.is-active) {
  color: #fff;
}

:deep(.el-radio__label) {
  color: rgba(255, 255, 255, 0.7);
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
</style> 