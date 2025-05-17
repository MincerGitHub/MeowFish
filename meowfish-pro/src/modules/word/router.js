import Word from './views/Word.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Upload from './views/Upload.vue'

const wordRoutes = [
    {
        path: '/word',
        name: 'wordHome',
        component: Word,
        meta: { requiresAuth: true }
    },
    {
        path: '/word/login',
        name: 'wordLogin',
        component: Login
    },
    {
        path: '/word/register',
        name: 'wordRegister',
        component: Register
    },
    {
        path: '/word/upload',
        name: 'wordUpload',
        component: Upload,
        meta: { requiresAuth: true }
    }
]


export default wordRoutes