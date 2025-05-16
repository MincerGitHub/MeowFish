<template>
  <div class="login-container gradient-bg">
    <div class="login-modal">
      <h2 class="modal-header">登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username" class="label">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            class="input-field" 
            required
          />
        </div>
        <div class="form-group">
          <label for="password" class="label">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="input-field" 
            required
          />
        </div>
        <div class="button-group">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
          <button type="button" class="btn btn-outline" @click="goToRegister">注册</button>
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await login(username.value, password.value)
    
    // 保存token到localStorage
    localStorage.setItem('token', response.token)
    localStorage.setItem('username', username.value)
    
    // 登录成功，跳转到首页
    router.push('/')
  } catch (err) {
    error.value = err.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.login-modal {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.error-message {
  color: #f44336;
  margin-top: 15px;
  text-align: center;
}
</style>