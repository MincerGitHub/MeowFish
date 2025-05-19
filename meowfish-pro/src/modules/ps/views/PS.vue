<template>
  <div class="home-container">
    <!-- 背景图 -->
    <div class="background-image"></div>
    
    <!-- 游戏容器 -->
    <div class="game-container">
      <ChromeDino />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ChromeDino from '../components/dino.vue';

// 响应式处理游戏容器尺寸
const gameContainer = ref(null);
const containerWidth = ref(800); 
const containerHeight = ref(150); 

onMounted(() => {
  // 根据窗口尺寸调整游戏容器大小
  adjustGameContainer();
  window.addEventListener('resize', adjustGameContainer);
});

const adjustGameContainer = () => {
  // 保持游戏容器的宽高比为4:1
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // 最大宽度为窗口宽度的80%，最大高度为窗口高度的30%
  const maxWidth = windowWidth * 0.8;
  const maxHeight = windowHeight * 0.3;
  
  // 根据宽高比计算合适的尺寸
  const heightBasedOnWidth = maxWidth / 4;
  const widthBasedOnHeight = maxHeight * 4;
  
  // 调整后的高度计算，使用3/4的比例
  const adjustedHeightBasedOnWidth = heightBasedOnWidth * 0.75;
  const adjustedMaxHeight = maxHeight * 0.75;
  
  if (adjustedHeightBasedOnWidth <= adjustedMaxHeight) {
    containerWidth.value = maxWidth;
    containerHeight.value = adjustedHeightBasedOnWidth;
  } else {
    containerWidth.value = widthBasedOnHeight;
    containerHeight.value = adjustedMaxHeight;
  }
};
</script>

<style scoped>
.home-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../../../assets/ps-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.game-container {
  position: absolute;
  top: 54%;
  left: 40%;
  transform: translate(-40%, -60%);
  width: 800px;
  height: 150px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  
  /* 使用计算出的响应式尺寸 */
  width: v-bind(containerWidth + 'px');
  height: v-bind(containerHeight + 'px');
}
</style>