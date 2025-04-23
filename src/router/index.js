import { createRouter, createWebHistory } from 'vue-router'
import login from "../views/login.vue";

const routes = [
    {
        path:'/',
        redirect:'/login',
    },
    {
        path:'/login',
        name:'loginPage',
        component:login,
    }
]

const router = createRouter({
    routes,
    history:createWebHistory(),
  });

export default router;