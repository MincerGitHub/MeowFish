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
/* 主容器样式 */
.main-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
}

/* 内容容器样式 */
.content-wrapper {
  max-width: 80rem;
  margin: 0 auto;
}

/* 标题样式 */
.title {
  margin-bottom: 3rem;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 500;
  color: #374151;
}

/* 网格容器样式 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
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
}

/* 卡片样式 */
.software-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 8rem;
  width: 8rem;
  border-radius: 1rem;
  background-color: #ffffff;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
}

.software-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
}

/* 图标容器样式 */
.icon-wrapper {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

/* 图标样式 */
.icon {
  height: 4rem;
  width: 4rem;
  object-fit: contain;
}

/* 软件名称样式 */
.software-name {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

/* 颜色样式 */
.bg-blue {
  background-color: rgba(59, 130, 246, 0.1);
}

.bg-blue:hover {
  background-color: rgba(59, 130, 246, 0.2);
}

.bg-orange {
  background-color: rgba(249, 115, 22, 0.1);
}

.bg-orange:hover {
  background-color: rgba(249, 115, 22, 0.2);
}

.bg-purple {
  background-color: rgba(139, 92, 246, 0.1);
}

.bg-purple:hover {
  background-color: rgba(139, 92, 246, 0.2);
}

.bg-green {
  background-color: rgba(34, 197, 94, 0.1);
}

.bg-green:hover {
  background-color: rgba(34, 197, 94, 0.2);
}

.bg-sky {
  background-color: rgba(56, 189, 248, 0.1);
}

.bg-sky:hover {
  background-color: rgba(56, 189, 248, 0.2);
}

.bg-gray {
  background-color: rgba(107, 114, 128, 0.1);
}

.bg-gray:hover {
  background-color: rgba(107, 114, 128, 0.2);
}
</style>