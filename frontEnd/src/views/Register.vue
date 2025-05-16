<template>
  <div class="register-container gradient-bg">
    <div class="register-modal">
      <h2 class="modal-header">注册</h2>
      <form @submit.prevent="handleRegister">
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
          <button type="submit" class="btn btn-primary">注册</button>
          <button type="button" class="btn btn-outline" @click="goToLogin">返回登录</button>
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="success" class="success-message">{{ success }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api/auth'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  try {
    error.value = ''
    success.value = ''
    
    await register(username.value, password.value)
    
    // 注册成功
    success.value = '注册成功！即将跳转到登录页面...'
    
    // 3秒后跳转到登录页面
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (err) {
    error.value = err.message || '注册失败，请稍后再试'
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.register-modal {
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

.success-message {
  color: #4caf50;
  margin-top: 15px;
  text-align: center;
}
</style>