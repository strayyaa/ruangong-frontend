<!-- 这个文件仅用于测试 -->

<template>
    <el-container>
        <el-header 
            ref="header"
            :style="{ 
                // backgroundColor: headerBg,
                // backdropFilter: `blur(${headerBlur}px)`
            }"
            class="main-header"
            >
            <h1 class="header-title" :style="{ opacity: titleOpacity }">课程管理平台</h1>
            <el-button
                @mouseenter="mouseenter"
                @mouseleave="mouseleave"
                :style="{
                    'color': wordcolor,
                    'background-color': backcolor,
                    }"
                class="loginbtn"
            >登录</el-button>
        </el-header>
        <el-main>
            <div class="background-layer">
                <h1 class="background-title">
                    <span class="toanimate">课</span>
                    <span class="toanimate">程</span>
                    <span class="toanimate">管</span>
                    <span class="toanimate">理</span>
                    <span class="toanimate">平</span>
                    <span class="toanimate">台</span>
                </h1>
                <el-button
                    class="register-btn"
                    @mouseenter="registerMouseEnter"
                    @mouseleave="registerMouseLeave"
                >->注册成为新用户</el-button>
            </div>
            
            <div class="main-content">
              <div class="followMouse"></div>
              <div class="content-container">
                <img 
                  src="../assets/homepage_teacher2.jpg" 
                  alt="教学场景"
                  class="main-image"
                  @mouseenter="imgMouseEnter"
                  @mouseleave="imgMouseLeave"
                >
                
                <div class="content-text">
                  <h2>优质在线教育平台</h2>
                  <p>我们提供覆盖全学科的精品课程，由行业专家和资深教师团队精心打造。采用互动式教学模式，结合AI智能学习系统，帮助学员高效掌握知识要点。</p>
                  <p>特色服务包括：</p>
                  <ul>
                    <li>• 个性化学习路径规划</li>
                    <li>• 实时在线答疑系统</li>
                    <li>• 学习进度智能追踪</li>
                    <li>• 多终端同步学习</li>
                  </ul>
                </div>
              </div>
            </div>
            
        </el-main>
    </el-container>

    

</template>
  
<script setup>
import { onMounted,onUnmounted, ref } from 'vue'
import { animate,createAnimatable} from 'animejs';


const wordcolor = ref('rgba(0,0,0,1)')
const backcolor = ref('rgba(255,255,255,1)')
const titleOpacity = ref(0)
const headerBlur = ref(0)

const handleScroll = () => {
  const currentScroll = window.pageYOffset
  
  // 计算透明度
  const scrollProgress = Math.min(currentScroll / 500, 1)
  titleOpacity.value = Math.min(currentScroll / 200, 1)

  wordcolor.value = `rgba(${Math.min(255,scrollProgress*255)},${Math.min(255,scrollProgress*255)},${Math.min(255,scrollProgress*255)},1)`
    backcolor.value = `rgba(${Math.max(0,255-scrollProgress*255)},${Math.max(0,255-scrollProgress*255)},${Math.max(0,255-scrollProgress*255)},1)`
  
  // 背景模糊效果
  headerBlur.value = Math.min(currentScroll / 50, 10)
  
  
  lastScroll = currentScroll
}


//鼠标和登录按钮动画
const mouseenter = () => {
  animate('.loginbtn', {
    // translateY: [-5, 0],
    scale: [1, 1.2],
    width: ['100px', '120px'],
    boxShadow: ['0 2px 12px 0 rgba(64,158,255,.3)', '0 4px 16px 0 rgba(64,158,255,.4)'],
    backgroundColor: wordcolor.value,
    color: backcolor.value,
    duration: 300,
    elasticity: 400,
    loop: false,
    easing: 'easeOutElastic(1, .5)'
  });
}
const mouseleave = () => {
  animate('.loginbtn', {
    translateY: 0,
    scale: 1,
    width: ['120px', '100px'],
    boxShadow: '0 2px 12px 0 rgba(64,158,255,.1)',
    backgroundColor: backcolor.value,
    color: wordcolor.value,
    duration: 300,
    easing: 'easeOutExpo'
  })
}


//注册按钮移进出
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

//图片动画
const imgMouseEnter = () => {
  animate('.main-image', {
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    duration: 300,
    easing: 'easeOutExpo'
  });
};
const imgMouseLeave = () => {
  animate('.main-image', {
    scale: 1,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    duration: 300,
    easing: 'easeOutExpo'
  });
};
const onMouseMove = e => {
  animate('.followMouse', {
    left: e.clientX+'px',
    top:e.clientY+'px',
    duration: 500,
  });
}


onMounted(()=>{
    animate('.toanimate', {
    // Property keyframes
        y: [
            { to: '-2.75rem', ease: 'outExpo', duration: 600 },
            { to: '0px', ease: 'outBounce', duration: 800, delay: 100 }
        ],
        // Property specific parameters
        rotate: {
            // from: '-1turn',
            delay: 0
        },
        delay: (_, i) => i * 50, // Function based value
        ease: 'inOutCirc',
        loopDelay: 3000,
        loop: true
    });

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', onMouseMove)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('mousemove', onMouseMove)
})


</script>

<style scoped>
.el-container, .el-main {
  position: relative;
  padding: 0 !important;
  margin: 0 !important;
  min-height: 100vh;
  overflow: visible !important;
}
.main-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.background-layer {
  position: relative;
  height: 100vh;
  width:100%;
    background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), 
              url('../assets/backgroundimage_example.jpg');
  background-size: cover;
  margin-top: -70px;
  background-position: center;
}

.background-title {
  position: relative;
    top: 40%;
  z-index: 2;
  text-align: center;
  color: white;
  font-size: 4rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

.header-title {
  transition: opacity 0.3s ease;
  color: rgba(0,0,0,0.9);
  margin-left: 2rem;
}
.toanimate {
  display: inline-block; /* 关键修复！ */
  margin: 0 5px;        /* 添加间距 */
  position: relative;   /* 确保定位正常 */
}
.loginbtn {
    width: 100px !important;
  /* color: azure !important; */
  /* background-color: black !important; */
  height: 50px !important;
  margin-right: 2rem !important;
  /* transition: all 0.3s ease !important; */
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

/* 主要内容css */
.main-content {
  position: relative;
  z-index: 3; /* 确保内容在背景层上方 */
  padding: 100px 0 !important; /* 添加垂直间距 */
  margin-top: -50px;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -100px; /* 上移覆盖背景层 */
}

.main-image {
  width: 50%;
  max-width: 1200px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transform: translateZ(0); /* 优化动画性能 */
}

.content-text {
  width: 50%;
  max-width: 1200px;
  padding: 40px;
  background: rgba(255,255,255,0.95);
  border-radius: 0 0 20px 20px;
  /* box-shadow: 0 10px 30px rgba(0,0,0,0.1); */
  margin-top: 0px; /* 与图片重叠 */
  z-index: 2;
}

.content-text h2 {
  color: #2c3e50;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
}

.content-text p {
  color: #666;
  line-height: 1.8;
  margin: 1rem 0;
}

.content-text ul {
  padding-left: 2rem;
  margin: 1.5rem 0;
}

.content-text li {
  color: #409EFF;
  margin: 0.8rem 0;
  font-size: 1.1rem;
}

/* 有关鼠标移入图片时的动画效果 */
.followMouse {
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000; /* 确保在其他元素之上 */
  pointer-events: none;
  transform: translate(-50%, -50%);
  /* display: none; */
}

</style>
