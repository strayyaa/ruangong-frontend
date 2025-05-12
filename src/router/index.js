import { createRouter, createWebHistory } from 'vue-router'
import login from "../views/login.vue";
import test from "../views/test.vue";

const routes = [
    {
        path:'/',
        
    },
    {
        path:'/login',
        name:'loginPage',
        component:login,
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