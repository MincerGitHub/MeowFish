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
</script>

<style scoped>
</style>