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
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <el-form-item prop="account">
          <el-input v-model="loginForm.account" placeholder="邮箱或学号">
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
          <el-button class="submit-btn" @click="handleLogin">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" @click="goRegister">没有账号？去注册</el-link>
        </el-form-item>
      </el-form>
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
const loginForm = reactive({
  account: '',
  password: '',
})
const loginRules = {
  account: [{ required: true, message: '请输入邮箱或学号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const handleLogin = async () => {
  // TODO: 登录逻辑
  ElMessage.success('登录成功')
  router.push('/home')
}
const goRegister = () => {
  router.push('/register')
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
  max-height: 300px;
  margin: 0 auto;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: 200px;
}
.login-form {
  margin-top: 10px;
  /* margin-bottom: 0px; */
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
</style> 