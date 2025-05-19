<template>
  <main class="main-container">
    <div class="content-wrapper">
      <h1 class="title">请选择想使用的办公软件😋</h1>

      <div class="grid-container">
        <router-link 
          v-for="software in softwareOptions" 
          :key="software.name" 
          :to="software.href"
          class="software-link"
        >
          <div
            :class="`software-card ${software.color}`"
          >
            <div class="icon-wrapper">
              <img :src="software.icon" alt="software.name" class="icon" />
            </div>
          </div>
          <span class="software-name">{{ software.name }}</span>
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
// 引入自定义图标
import WordIcon from '../assets/word.svg';
import PowerPointIcon from '../assets/ppt.svg';
import VisualStudioIcon from '../assets/vscode.svg';
import ExcelIcon from '../assets/excel.svg';
import PhotoshopIcon from '../assets/ps.svg';
import NotepadIcon from '../assets/notepad.svg';

const softwareOptions = [
  { name: "Word", icon: WordIcon, color: "bg-blue", href: "/word" },
  { name: "PowerPoint", icon: PowerPointIcon, color: "bg-orange", href: "/ppt" },
  { name: "Visual Studio Code", icon: VisualStudioIcon, color: "bg-purple", href: "/vscode" },
  { name: "Excel", icon: ExcelIcon, color: "bg-green", href: "/excel" },
  { name: "Photoshop", icon: PhotoshopIcon, color: "bg-sky", href: "/ps" },
  { name: "记事本", icon: NotepadIcon, color: "bg-gray", href: "/notepad" },
];
</script>

<style>
/* 苹果风格字体 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

/* 主容器样式 */
.main-container {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 内容容器样式 */
.content-wrapper {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem;
}

/* 标题样式 */
.title {
  margin-bottom: 3rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 500;
  color: #1d1d1f;
  letter-spacing: -0.025em;
}

/* 网格容器样式 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 链接样式 */
.software-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.software-link:hover {
  transform: scale(1.03);
}

.software-link:active {
  transform: scale(0.98);
}

/* 卡片样式 */
.software-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 9rem;
  width: 9rem;
  border-radius: 1.5rem;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.software-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

/* 图标容器样式 */
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

/* 图标样式 */
.icon {
  height: 4.5rem;
  width: 4.5rem;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.software-card:hover .icon {
  transform: scale(1.1);
}

/* 软件名称样式 */
.software-name {
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1d1d1f;
  text-align: center;
}

/* 颜色样式 - 苹果风格渐变 */
.bg-blue {
  background: linear-gradient(145deg, rgba(0, 122, 255, 0.1), rgba(10, 132, 255, 0.2));
  border: 1px solid rgba(0, 122, 255, 0.1);
}

.bg-orange {
  background: linear-gradient(145deg, rgba(255, 149, 0, 0.1), rgba(255, 159, 10, 0.2));
  border: 1px solid rgba(255, 149, 0, 0.1);
}

.bg-purple {
  background: linear-gradient(145deg, rgba(175, 82, 222, 0.1), rgba(191, 90, 242, 0.2));
  border: 1px solid rgba(175, 82, 222, 0.1);
}

.bg-green {
  background: linear-gradient(145deg, rgba(52, 199, 89, 0.1), rgba(48, 209, 88, 0.2));
  border: 1px solid rgba(52, 199, 89, 0.1);
}

.bg-sky {
  background: linear-gradient(145deg, rgba(0, 199, 190, 0.1), rgba(10, 212, 218, 0.2));
  border: 1px solid rgba(0, 199, 190, 0.1);
}

.bg-gray {
  background: linear-gradient(145deg, rgba(142, 142, 147, 0.1), rgba(174, 174, 178, 0.2));
  border: 1px solid rgba(142, 142, 147, 0.1);
}

/* 添加苹果风格的动画效果 */
@keyframes appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.grid-container {
  animation: appear 0.5s ease-out;
}

/* 媒体查询优化 */
@media (prefers-color-scheme: dark) {
  .main-container {
    background-color: #1d1d1f;
  }
  
  .title {
    color: #f5f5f7;
  }
  
  .software-card {
    background-color: rgba(44, 44, 46, 0.8);
  }
  
  .software-name {
    color: #f5f5f7;
  }
}

@media (max-width: 640px) {
  .software-card {
    height: 8rem;
    width: 8rem;
  }
  
  .icon {
    height: 3.5rem;
    width: 3.5rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
}
</style>