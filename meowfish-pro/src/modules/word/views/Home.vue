<template>
  <div class="home-container">
    <!-- 顶部图片 -->
    <div class="topbar">
      <img src="../../../assets/word-top.png" alt="顶部图片" class="fixed-image top-image">
      
      <!-- 左上角刷新按钮 - 重新定位到图片中的复位按钮位置 -->
      <button class="circular-btn refresh-btn" @click="fetchDocContent">
        <span class="btn-icon">↻</span>
      </button>
      
      <!-- 右上角用户按钮 - 重新定位到图片中的头像位置 -->
      <div class="user-button-container" @mouseenter="showUserPanel = true" @mouseleave="showUserPanel = false">
        <button class="circular-btn user-btn">
          <span class="btn-icon">😎</span>
        </button>
        
        <!-- 悬浮框 -->
        <div class="user-panel" v-show="showUserPanel">
          <div class="user-info">
            <span>用户名：{{ username }}</span>
          </div>
          <button class="upload-btn" @click="goToUpload">上传文件</button>
          <button class="logout-btn" @click="logout">退出登录</button>
        </div>
      </div>
    </div>
    
    <!-- 中间内容区域 -->
    <div class="content-wrapper">
      <div class="content" id="content" ref="contentDiv">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>{{ displayedContent }}</div>
      </div>
    </div>
    
    <!-- 底部图片 -->
    <div class="bottombar">
      <img src="../../../assets/word-bottom.png" alt="底部图片" class="fixed-image bottom-image">
    </div>
    
    <!-- 提示信息 - 修改为只在文件加载成功后显示1秒，然后1秒内渐渐消失 -->
    <div class="keyboard-hint" v-if="showHint" :style="{ opacity: hintOpacity }">
      按任意键继续...
    </div>
    
    <!-- 扎小人功能 - 右下角小人图片 -->
    <div class="doll-container">
      <!-- 基础小人图片 -->
      <div class="doll" :class="{ 'doll-bounce': isBouncingDoll }">
        <img src="../../../assets/people.png" alt="小人图片" class="doll-image">
        <!-- 覆盖的红色小人图片 -->
        <img src="../../../assets/people-in-red.png" alt="红色小人图片" class="doll-image red-doll-image" :style="{ opacity: redDollOpacity }">
      </div>
      
      <!-- 粒子容器 -->
      <div class="particles-container">
        <!-- 动态生成的粒子 -->
        <div 
          v-for="particle in particles" 
          :key="particle.id" 
          class="particle"
          :style="{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `translate(${particle.translateX}px, ${particle.translateY}px)`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getDocContent } from '../api/document'

const router = useRouter()
const docContent = ref('')
const displayedContent = ref('')
const currentIndex = ref(0)
const loading = ref(true)
const error = ref('')
const username = ref(localStorage.getItem('username') || '未登录')
const showUserPanel = ref(false)
const contentDiv = ref(null)
const token = ref(localStorage.getItem('token'))
const hasToken = ref(!!localStorage.getItem('token'))
const isLoggedIn = ref(false);

// 提示信息相关变量
const showHint = ref(false)
const hintOpacity = ref(1)
let hintTimer = null
let fadeTimer = null

// 小人动画相关变量
const isBouncingDoll = ref(false)
const redDollOpacity = ref(1)
const particles = ref([])
let particleId = 0
let redDollTimer = null
let animationFrameId = null

// 获取文档内容
const fetchDocContent = async () => {
  try {
    loading.value = true
    error.value = ''
    displayedContent.value = ''
    currentIndex.value = 0
    
    const response = await getDocContent()
    docContent.value = response.content
    
    // 初始显示第一个字符
    if (docContent.value.length > 0) {
      displayedContent.value = docContent.value[0]
      currentIndex.value = 1
      
      // 显示提示信息
      showHintMessage()
    }
  } catch (err) {
    error.value = err.message || '获取文档内容失败'
  } finally {
    loading.value = false
  }
}

// 显示提示信息，1秒后开始淡出，再1秒后完全消失
const showHintMessage = () => {
  // 清除之前的定时器
  if (hintTimer) clearTimeout(hintTimer)
  if (fadeTimer) cancelAnimationFrame(fadeTimer)
  
  // 显示提示信息
  showHint.value = true
  hintOpacity.value = 1
  
  // 1秒后开始淡出
  hintTimer = setTimeout(() => {
    let startTime = null
    const duration = 1000 // 1秒内淡出
    
    const fadeOut = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      
      if (elapsed < duration) {
        // 计算不透明度，从1线性减少到0
        hintOpacity.value = 1 - (elapsed / duration)
        fadeTimer = requestAnimationFrame(fadeOut)
      } else {
        // 淡出完成，隐藏提示
        hintOpacity.value = 0
        showHint.value = false
        fadeTimer = null
      }
    }
    
    fadeTimer = requestAnimationFrame(fadeOut)
  }, 1000)
}

// 创建粒子效果 - 修复版本
const createParticles = () => {
  // 清除现有粒子
  // particles.value = []
  
  // 随机生成5-15个粒子
  const particleCount = Math.floor(Math.random() * 11) + 5
  
  // 小人中心位置（相对于容器）
  const centerX = 50 // 容器宽度的一半
  const centerY = 50 // 容器高度的一半
  
  for (let i = 0; i < particleCount; i++) {
    // 随机角度和速度
    const angle = Math.random() * Math.PI * 2 // 0-2π，覆盖所有方向
    const speed = Math.random() * 100 + 50 // 50-150的随机速度
    
    // 随机粒子大小
    const size = Math.random() * 5 + 3 // 3-8px
    
    // 创建粒子对象
    const particle = {
      id: particleId++,
      x: centerX, // 起始X位置（小人中心）
      y: centerY, // 起始Y位置（小人中心）
      size: size,
      angle: angle,
      speed: speed,
      translateX: 0,
      translateY: 0,
      opacity: 1,
      createdAt: Date.now()
    }
    
    // 添加到粒子数组
    particles.value.push(particle)
  }
  
  // 启动粒子动画
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  animateParticles()
}

// 粒子动画函数
const animateParticles = () => {
  const now = Date.now()
  const duration = 3000 // 3秒生命周期
  
  // 更新每个粒子的位置和不透明度
  particles.value.forEach((particle, index) => {
    const elapsed = now - particle.createdAt
    
    if (elapsed < duration) {
      // 计算进度 (0-1)
      const progress = elapsed / duration
      
      // 更新位置
      particle.translateX = Math.cos(particle.angle) * particle.speed * progress
      particle.translateY = Math.sin(particle.angle) * particle.speed * progress
      
      // 更新不透明度（从1线性减少到0）
      particle.opacity = 1 - progress
    } else {
      // 粒子生命周期结束，标记为删除
      particles.value.splice(index, 1)
    }
  })
  
  // 如果还有粒子，继续动画
  if (particles.value.length > 0) {
    animationFrameId = requestAnimationFrame(animateParticles)
  } else {
    animationFrameId = null
  }
}

// 触发小人动画效果
const animateDoll = () => {
  // 1. 小人缩小、放大效果
  isBouncingDoll.value = true
  setTimeout(() => {
    isBouncingDoll.value = false
  }, 300) // 动画持续时间
  
  // 2. 红色小人透明度变化
  redDollOpacity.value = 0.5
  if (redDollTimer) cancelAnimationFrame(redDollTimer)
  
  // 使用requestAnimationFrame实现平滑过渡
  let startTime = null
  const duration = 500 // 0.5秒
  
  const fadeIn = (timestamp) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    
    if (elapsed < duration) {
      // 计算不透明度，从0.5线性增加到1
      redDollOpacity.value = 0.5 - (0.5 * elapsed / duration)
      redDollTimer = requestAnimationFrame(fadeIn)
    } else {
      // 过渡完成
      redDollOpacity.value = 0
      redDollTimer = null
    }
  }
  
  redDollTimer = requestAnimationFrame(fadeIn)
  
  // 3. 创建粒子效果
  createParticles()
}

// 键盘事件处理函数
const handleKeyDown = (event) => {
  // 显示文件内容的下一个字符
  if (currentIndex.value < docContent.value.length) {
    displayedContent.value += docContent.value[currentIndex.value]
    currentIndex.value++
    
    // 滚动到底部 - 使用window滚动
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }, 0)
    
    // 触发小人动画效果
    animateDoll()
  }
}

// 跳转到上传页面
const goToUpload = () => {
  router.push('/word/upload')
}

// 退出登录
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  token.value = null
  router.push('/word/login')
}

// 组件挂载时获取文档内容并添加键盘事件监听
onMounted(() => {
  // 检查是否有token，如果没有则重定向到登录页
  isLoggedIn.value = !!localStorage.getItem('token');
  if (!isLoggedIn.value) {
    router.push('/word/login');
    return;
  }
  
  // 获取文档内容
  fetchDocContent()
  
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeyDown)
})

// 组件卸载时清理
onUnmounted(() => {
  // 移除键盘事件监听
  document.removeEventListener('keydown', handleKeyDown)
  
  // 清除定时器和动画帧
  if (hintTimer) clearTimeout(hintTimer)
  if (fadeTimer) cancelAnimationFrame(fadeTimer)
  if (redDollTimer) cancelAnimationFrame(redDollTimer)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
/* 确保整个页面可以滚动 */
html, body {
  height: auto;
  overflow-y: auto;
}

.home-container {
  margin: 0;
  font-family: Arial, sans-serif;
  position: relative;
  background-color: #e6e8ea;
  min-height: 100vh;
  width: 100%;
  /* 确保容器可以随内容增长 */
  height: auto;
}

.topbar {
  position: relative; /* 添加相对定位，作为按钮的定位参考 */
}

.fixed-image {
  position: fixed;
  width: 100%;
  object-fit: contain;
  z-index: 10;
}

.top-image {
  top: 0;
}

.bottom-image {
  bottom: 0;
}

/* 内容包装器 */
.content-wrapper {
  position: relative;
  padding-top: 250px; /* 为顶部图片留出空间 */
  padding-bottom: 60px; /* 为底部图片留出空间 */
  /* 确保内容区域可以延伸 */
  min-height: calc(100vh - 300px);
}

.content {
  background-color: #fff;
  white-space: pre-wrap;
  font-size: 16px;
  
  /* 调整内边距 */
  padding-top: 20px;
  padding-bottom: 60px;
  padding-left: 100px;
  padding-right: 100px;
  
  /* 调整外边距，使其居中 */
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 60px;
  max-width: 800px; /* 限制最大宽度 */
  
  /* 关键：允许内容增长，但不添加自己的滚动条 */
  min-height: 470px;
  height: auto;
  overflow-y: visible; /* 内容可以溢出，不显示滚动条 */
  
  /* 添加边框和阴影 */
  border: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  padding: 20px;
}

.error {
  color: #f44336;
}

.circular-btn {
  position: fixed;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: transparent; /* 透明背景 */
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
}

.circular-btn:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.2); /* 悬停时半透明白色背景 */
}


/* 重新定位刷新按钮到左上角复位按钮位置 */
.refresh-btn {
  top: 10px; /* 根据图片调整位置 */
  left: 210px; /* 根据图片调整位置 */
  font-size: 26px;
}

/* 重新定位用户按钮到右上角头像位置 */
.user-btn {
  top: 9px; /* 根据图片调整位置 */
  right: 150px; /* 根据图片调整位置 */
  font-size: 26px;
}

/* 用户按钮容器 */
.user-button-container {
  position: fixed;
  top: 23px; /* 根据图片调整位置 */
  right: 23px; /* 根据图片调整位置 */
  z-index: 100;
}

/* 用户悬浮面板 */
.user-panel {
  position: absolute;
  top: 30px;
  right: 110px;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  width: 200px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}

.user-panel::before {
  content: '';
  position: absolute;
  top: -10px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}

.user-info {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.upload-btn, .logout-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.upload-btn:hover, .logout-btn:hover {
  background-color: #1565c0;
}

.logout-btn {
  background-color: #f44336;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

/* 键盘提示 */
.keyboard-hint {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 100;
  transition: opacity 0.3s ease;
}

/* 小人容器样式 */
.doll-container {
  position: fixed;
  top: 70px;
  right: 0px;
  width: 100px;
  height: 100px;
  z-index: 100;
}

/* 小人样式 */
.doll {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 小人图片样式 */
.doll-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 红色小人图片样式 */
.red-doll-image {
  position: absolute;
  top: 0;
  left: 0;
}

/* 小人弹跳动画 */
@keyframes bounce {
  0% { transform: scale(1); }
  30% { transform: scale(0.8); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.doll-bounce {
  animation: bounce 0.3s ease;
}

/* 粒子容器 */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 不阻挡鼠标事件 */
}

/* 粒子样式 */
.particle {
  position: absolute;
  background-color: #ff0000; /* 红色粒子 */
  border-radius: 50%;
  pointer-events: none;
  z-index: 101; /* 确保粒子在小人上方 */
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .content {
    max-width: 700px;
    padding-left: 80px;
    padding-right: 80px;
  }
}

@media (max-width: 992px) {
  .content {
    max-width: 600px;
    padding-left: 60px;
    padding-right: 60px;
  }
}

@media (max-width: 768px) {
  .content {
    max-width: 500px;
    padding-left: 40px;
    padding-right: 40px;
  }
  
  .doll-container {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 576px) {
  .content {
    max-width: 90%;
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .doll-container {
    width: 60px;
    height: 60px;
    bottom: 20px;
    right: 20px;
  }
}
</style>