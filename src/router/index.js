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
    }
]

const router = createRouter({
    routes,
    history:createWebHistory(),
});


// 逻辑：
// 若localStorage没有找到userId的信息，即还处于没有登录的状态，那么直接访问其他页面会跳转到主页面。


// router.beforeEach((to,from,next) => {
//     const userId = localStorage.getItem('userId');
//     if(!userId && to.path !== '/login'&& to.path !== '/'&& to.path !== '/test43906'){
//         next({path:'/'})
//     }else{
//         next();
//     }
// });

export default router;