<template>
  <div class="game-container">
    <div
      class="background"
      :style="{ backgroundImage: `url(${backgroundImage})`, backgroundPositionX: `${backgroundX}px` }"
    ></div>
    <div
      class="dinosaur"
      :style="{ bottom: `${dinosaurY}px`, backgroundImage: `url(${dinosaurImage})` }"
    ></div>
    <div
      class="obstacle"
      :style="{ left: `${obstacleX}px`, backgroundImage: `url(${obstacleImage})` }"
    ></div>
    <div class="scoreboard">得分: {{ score }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 背景图路径
const backgroundImage = '/src/assets/dino-bg.png';
// 恐龙的图片路径
const dinosaurImage = '/src/assets/dino.png';
// 障碍物的图片路径
const obstacleImage = '/src/assets/dino-obstacle.png';
// 恐龙的垂直位置
const dinosaurY = ref(0);
// 障碍物的水平位置
const obstacleX = ref(800);
// 游戏是否结束
const gameOver = ref(false);
// 背景的水平位置
const backgroundX = ref(0);
// 计分板分数
const score = ref(0);

// 恐龙跳跃函数
const jump = () => {
  if (!gameOver.value) {
    let jumpHeight = 150;
    let jumpSpeed = 10;
    let jumpInterval = setInterval(() => {
      if (jumpHeight > 0) {
        dinosaurY.value += jumpSpeed;
        jumpHeight -= jumpSpeed;
      } else {
        clearInterval(jumpInterval);
        let fallInterval = setInterval(() => {
          if (dinosaurY.value > 0) {
            dinosaurY.value -= jumpSpeed;
          } else {
            clearInterval(fallInterval);
          }
        }, 20);
      }
    }, 20);
  }
};

// 游戏重置函数
const resetGame = () => {
  dinosaurY.value = 0;
  obstacleX.value = 800;
  backgroundX.value = 0;
  score.value = 0;
  gameOver.value = false;
  moveObstacle();
  moveBackground();
};

// 修改键盘事件监听函数，添加重置逻辑
const handleKeyDown = (event) => {
  if (event.key === ' ' || event.key === 'ArrowUp') {
    if (gameOver.value) {
      resetGame(); // 游戏结束时按空格重置游戏
    } else {
      jump();
    }
  }
};

// 移动障碍物
const moveObstacle = () => {
  let obstacleSpeed = 5;
  let obstacleInterval = setInterval(() => {
    if (!gameOver.value) {
      obstacleX.value -= obstacleSpeed;
      if (obstacleX.value < -50) {
        obstacleX.value = 800;
        score.value += 1; // 每跳过一个障碍物，分数加1
      }
      // 检测碰撞
      if (
        obstacleX.value < 100 &&
        obstacleX.value > 0 &&
        dinosaurY.value < 50
      ) {
        gameOver.value = true;
        clearInterval(obstacleInterval);
        alert('游戏结束！');
      }
    }
  }, 20);
};

// 背景滚动函数
const moveBackground = () => {
  let backgroundSpeed = 2;
  let backgroundInterval = setInterval(() => {
    if (!gameOver.value) {
      backgroundX.value -= backgroundSpeed;
      if (backgroundX.value <= -800) {
        backgroundX.value = 0; // 重置背景位置
      }
    } else {
      clearInterval(backgroundInterval);
    }
  }, 20);
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  moveObstacle();
  moveBackground(); // 启动背景滚动
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.game-container {
  position: relative;
  width: 800px;
  height: 300px;
  border: 1px solid #000;
  overflow: hidden;
}

.background {
  width: 1600px; /* 双倍宽度用于循环滚动 */
  height: 100%;
  background-size: cover;
  background-repeat: repeat-x;
}

.dinosaur {
  position: absolute;
  bottom: 0;
  left: 50px;
  width: 50px;
  height: 50px;
  background-size: cover;
  background-repeat: no-repeat;
}

.obstacle {
  position: absolute;
  bottom: 0;
  width: 50px;
  height: 50px;
  background-size: cover;
  background-repeat: no-repeat;
}

.scoreboard {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #000;
}
</style>