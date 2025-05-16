import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Upload from '../views/Upload.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/upload',
        name: 'Upload',
        component: Upload,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 导航守卫 - 增强版
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            // 如果没有token，重定向到登录页
            next({ name: 'Login' })
        } else {
            // 有token，允许访问
            next()
        }
    } else {
        // 对于不需要认证的路由
        if (token && (to.name === 'Login' || to.name === 'Register')) {
            // 如果已经有token，且目标是登录或注册页，重定向到首页
            next({ name: 'Home' })
        } else {
            // 其他情况正常导航
            next()
        }
    }
})

export default router