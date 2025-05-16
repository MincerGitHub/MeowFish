<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<script setup>
// App.vue 是应用的根组件
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: 'Arial', sans-serif;
  /* 关键：确保整个页面可以滚动 */
  height: auto;
  min-height: 100%;
  overflow-y: auto;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  /* 确保容器可以随内容增长 */
  height: auto;
}

/* 全局背景渐变 - 移到各个组件中使用 */
.gradient-bg {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d8);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* 全局模态框样式 */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #1976d2;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover {
  background-color: #1565c0;
}

.btn-outline {
  background-color: white;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.btn-outline:hover {
  background-color: #f0f7ff;
}

/* 输入框样式 */
.input-field {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.input-field:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

/* 标签样式 */
.label {
  display: block;
  margin-bottom: 5px;
  font-size: 16px;
  color: #333;
}
</style>