import { createRouter, createWebHistory } from 'vue-router'

// 引入各模块的路由
import wordRoutes from '../modules/word/router.js'


const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    ...wordRoutes, // 摸鱼网站的路由
    {
        path: '/excel',
        name: 'excel',
        component: () => import('../modules/excel/views/Excel.vue')
    }, {
        path: '/notepad',
        name: 'notepad',
        component: () => import('../modules/notepad/views/Notepad.vue')
    }, {
        path: '/ppt',
        name: 'ppt',
        component: () => import('../modules/ppt/views/PPT.vue')
    }, {
        path: '/ps',
        name: 'ps',
        component: () => import('../modules/ps/views/PS.vue')
    }, {
        path: '/vscode',
        name: 'vscode',
        component: () => import('../modules/vscode/views/VScode.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})



router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            // 如果没有token，重定向到登录页
            next({ name: 'wordLogin' })
        } else {
            // 有token，允许访问
            next()
        }
    } else {
        // 对于不需要认证的路由
        if (token && (to.name === 'wordLogin' || to.name === 'wordRegister')) {
            // 如果已经有token，且目标是登录或注册页，重定向到首页
            next({ name: 'wordHome' })
        } else {
            // 其他情况正常导航
            next()
        }
    }
})


export default router