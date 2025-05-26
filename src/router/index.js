import { createRouter, createWebHistory } from 'vue-router'
import test from "../views/test.vue";
import homepage from '../views/homepage.vue';
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';

const routes = [
    {
        path:'/',
        name:'homepage',
        component:homepage,
    },
    {
        path:'/profile/:id',
        name:'profile',
        component:() => import('../views/profile.vue'),
    },
    {
        path:'/login',
        name:'login',
        component:() => import('../views/login.vue'),
    },
    {
        path:'/register',
        name:'register',
        component:() => import('../views/register.vue'),
    },
    {
        path:'/test43906',
        name:'test43906',
        component:test,
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/home.vue')
    },
    {
        path: '/courses',
        name: 'Courses',
        component: () => import('../views/courses.vue')
    },
    {
        path: '/tasks',
        name: 'Tasks',
        component: () => import('../views/tasks.vue')
    },
    {
        path: '/questions',
        name: 'Questions',
        component: () => import('../views/questions.vue')
    },
    {
        path:'/course/:id',
        name:'courseInfo',
        component: () => import('../views/courseInfo.vue')
    },
    {
        path:'/class/:id',
        name:'classInfo',
        component: () => import('../views/classInfo.vue')
    },
    {
        path:'/question/:id',
        name:'QuestionInfo',
        component: () => import('../views/questionInfo.vue')
    },
    {
        path:'/doTask/:id',
        name:'DoTask',
        component: () => import('../views/doTask.vue')
    },
    {
        path:'/checkTask/:id',
        name:'CheckTask',
        component: () => import('../views/checkTask.vue')
    },
    {
        path:'/createCourse',
        name:'CreateCourse',
        component: () => import('../views/createCourse.vue')
    },
    {
        path:'/createQuestion',
        name:'CreateQuestion',
        component: () => import('../views/createQuestion.vue')
    },
    {
        path:'/createTask',
        name:'CreateTask',
        component: () => import('../views/createTask.vue')
    }
]

const router = createRouter({
    routes,
    history:createWebHistory(),
});

// 白名单路由
const whiteList = ['/', '/login', '/register', '/test43906']

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    
    // 无论是否有token，都允许访问白名单页面
    if (whiteList.includes(to.path)) {
        next();
    } else {
        // 如果没有token且访问的不是白名单页面，则重定向到登录页
        if (!token) {
            next('/login');
        } else {
            // 如果有token且访问的不是白名单页面，则正常跳转
            next();
        }
    }
})

export default router;