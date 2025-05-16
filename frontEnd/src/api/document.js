import axios from 'axios'

// const API_URL = 'https://jfeejjlgtyra.sealosbja.site'
// const API_URL = 'http://devbox.ns-9mcqpenu.svc.cluster.local:3000'
const API_URL = '/api' // 根据实际情况修改API地址

// 创建带有认证的axios实例
const authAxios = axios.create({
    baseURL: API_URL
})

// 请求拦截器添加token
authAxios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器处理token过期
authAxios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            // 处理401错误（未授权）
            if (error.response.status === 401) {
                // 清除本地存储的token和用户信息
                localStorage.removeItem('token')
                localStorage.removeItem('username')

                // 如果不是已经在登录页，则重定向到登录页
                if (router.currentRoute.value.name !== 'Login') {
                    router.push('/login')
                }
            }
        }
        return Promise.reject(error)
    }
)

// 获取文档内容
export const getDocContent = async () => {
    try {
        const response = await authAxios.get('/docx-content')
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || '获取文档内容失败')
        }
        throw new Error('网络错误，请稍后再试')
    }
}

// 上传文档
export const uploadDocument = async (file) => {
    try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await authAxios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || '上传文档失败')
        }
        throw new Error('网络错误，请稍后再试')
    }
}