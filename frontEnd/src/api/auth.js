import axios from 'axios'

// const API_URL = 'https://jfeejjlgtyra.sealosbja.site' // 根据实际情况修改API地址
// const API_URL = 'http://devbox.ns-9mcqpenu.svc.cluster.local:3000' // 根据实际情况修改API地址
const API_URL = '/api' // 根据实际情况修改API地址

// 登录
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || '登录失败')
        }
        throw new Error('网络错误，请稍后再试')
    }
}

// 注册
export const register = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username,
            password
        })
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || '注册失败')
        }
        throw new Error('网络错误，请稍后再试')
    }
}