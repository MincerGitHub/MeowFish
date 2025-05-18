<template>
  <div class="excel-container">
    <!-- 顶部 Excel 工具栏 -->
    <div class="topbar">
      <img src="../../../assets/excel-top.png" alt="顶部图片" class="top-image">
    </div>
    
    <!-- 中间游戏区域 -->
    <div class="game-area">
      <div class="excel-grid" ref="gameAreaRef">
        <!-- Excel-like grid of cells -->
        <div class="excel-row" v-for="(row, y) in grid" :key="`row-${y}`">
          <div 
            class="excel-cell" 
            v-for="(cell, x) in row" 
            :key="`cell-${x}-${y}`"
            :class="{ 
              'snake-head': cell === 'head', 
              'snake-body': cell === 'body',
              'food-cell': cell === 'food'
            }"
          >
            {{ getCellContent(cell) }}
          </div>
        </div>
      </div>

      <div class="game-controls">
        <div class="score">分数: <span>{{ score }}</span></div>
        <div class="controls">
          <button 
            class="button" 
            @click="startGame"
            v-if="!gameStarted && !isGameOver"
          >
            开始游戏
          </button>
          <div class="game-over" v-if="isGameOver">游戏结束!</div>
          <button 
            class="button" 
            @click="restartGame"
            v-if="isGameOver"
          >
            重新开始
          </button>
        </div>
      </div>
    </div>
    
    <!-- 底部区域 -->
    <div class="bottom-section">
      <!-- 游戏说明 - 放在右下角 -->
      <div class="instructions-box">
        <h3>游戏说明</h3>
        <p>使用键盘方向键控制蛇的移动</p>
        <p>↑ 上 | ↓ 下 | ← 左 | → 右</p>
        <p>蛇头碰到边缘或自身将结束游戏</p>
        <p>吃到小零食可增加分数</p>
      </div>
      
      <!-- 底部状态栏 -->
      <div class="bottombar">
        <img src="../../../assets/excel-bottom.png" alt="底部图片" class="bottom-image">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

// 游戏配置
const GRID_WIDTH = 20  // 减少列数以适应更宽的单元格
const GRID_HEIGHT = 20
const BOUNDARY_BUFFER = 3

// 游戏状态数据
const snake = ref([])
const direction = ref('right')
const food = ref({ x: 0, y: 0 })
const gameStarted = ref(false)
const isGameOver = ref(false)
const score = ref(0)
const gameInterval = ref(null)
const gameAreaRef = ref(null)
const grid = ref([])

// 初始化网格
const initializeGrid = () => {
  const newGrid = []
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row = []
    for (let x = 0; x < GRID_WIDTH; x++) {
      row.push(null)
    }
    newGrid.push(row)
  }
  grid.value = newGrid
}

// 更新网格显示
const updateGrid = () => {
  // 清空网格
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid.value[y][x] = null
    }
  }
  
  // 放置食物
  grid.value[food.value.y][food.value.x] = 'food'
  
  // 放置蛇身
  snake.value.forEach((segment, index) => {
    if (segment.y >= 0 && segment.y < GRID_HEIGHT && segment.x >= 0 && segment.x < GRID_WIDTH) {
      grid.value[segment.y][segment.x] = index === 0 ? 'head' : 'body'
    }
  })
}

// 获取单元格内容
const getCellContent = (cellType) => {
  if (cellType === 'head') return '头'
  if (cellType === 'body') return '蛇'
  if (cellType === 'food') return '小零食'
  return ''
}

// 模块：生成食物位置
const generateFood = () => {
  let newFood
  let isOnSnake
  
  do {
    newFood = {
      x: BOUNDARY_BUFFER + Math.floor(Math.random() * (GRID_WIDTH - 2 * BOUNDARY_BUFFER)),
      y: BOUNDARY_BUFFER + Math.floor(Math.random() * (GRID_HEIGHT - 2 * BOUNDARY_BUFFER))
    }
    
    isOnSnake = snake.value.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    )
  } while (isOnSnake)
  
  return newFood
}

// 模块：检测碰撞
const checkCollision = (head) => {
  return (
    head.x < 0 ||
    head.x >= GRID_WIDTH ||
    head.y < 0 ||
    head.y >= GRID_HEIGHT ||
    snake.value.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  )
}

// 模块：蛇的移动逻辑
const move = () => {
  const head = { ...snake.value[0] }

  switch (direction.value) {
    case 'right': head.x += 1; break
    case 'left': head.x -= 1; break
    case 'up': head.y -= 1; break
    case 'down': head.y += 1; break
  }

  if (checkCollision(head)) {
    gameOver()
    return
  }

  snake.value.unshift(head)

  if (head.x === food.value.x && head.y === food.value.y) {
    food.value = generateFood()
    score.value += 10
  } else {
    snake.value.pop()
  }
  
  updateGrid()
}

// 模块：游戏结束逻辑
const gameOver = () => {
  clearInterval(gameInterval.value)
  gameStarted.value = false
  isGameOver.value = true
}

// 模块：重置游戏
const resetGame = () => {
  initializeGrid()
  
  snake.value = [
    { x: Math.floor(GRID_WIDTH / 4), y: Math.floor(GRID_HEIGHT / 2) },
    { x: Math.floor(GRID_WIDTH / 4) - 1, y: Math.floor(GRID_HEIGHT / 2) },
    { x: Math.floor(GRID_WIDTH / 4) - 2, y: Math.floor(GRID_HEIGHT / 2) }
  ]
  direction.value = 'right'
  food.value = generateFood()
  score.value = 0
  isGameOver.value = false
  
  updateGrid()
}

// 模块：开始游戏
const startGame = () => {
  if (gameStarted.value) return
  gameStarted.value = true
  isGameOver.value = false
  
  if (gameInterval.value) {
    clearInterval(gameInterval.value)
  }
  
  gameInterval.value = setInterval(move, 200)
}

// 模块：重新开始游戏
const restartGame = () => {
  resetGame()
  startGame()
}

// 模块：键盘事件处理
const handleKeydown = (e) => {
  if (!gameStarted.value) return

  switch (e.key) {
    case 'ArrowUp':
      if (direction.value !== 'down') direction.value = 'up'
      break
    case 'ArrowDown':
      if (direction.value !== 'up') direction.value = 'down'
      break
    case 'ArrowLeft':
      if (direction.value !== 'right') direction.value = 'left'
      break
    case 'ArrowRight':
      if (direction.value !== 'left') direction.value = 'right'
      break
  }
}

// 生命周期
onMounted(async () => {
  await nextTick()
  window.addEventListener('keydown', handleKeydown)
  resetGame()
  window.addEventListener('resize', () => {
    if (gameStarted.value) {
      gameOver()
    }
    resetGame()
  })
})

onBeforeUnmount(() => {
  clearInterval(gameInterval.value)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.excel-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

/* 顶部工具栏 */
.topbar {
  width: 100%;
  height: auto;
  background-color: #217346; /* Excel 绿色 */
}

.top-image {
  width: 100%;
  display: block;
}

/* 中间游戏区域 */
.game-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
  overflow: hidden;
}

.excel-grid {
  display: inline-block;
  border: 1px solid #ccc;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.excel-row {
  display: flex;
  height: 20px; /* 设置行高 */
}

.excel-cell {
  width: 80px; /* 更宽的单元格，类似Excel */
  height: 20px; /* 更矮的单元格，类似Excel */
  border: 1px solid #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  transition: all 0.1s ease;
  box-sizing: border-box;
}

.snake-head {
  background-color: #d4edda;
  color: #155724;
  border: 2px solid #28a745;
  font-weight: bold;
}

.snake-body {
  background-color: #e2e3e5;
  color: #383d41;
}

.food-cell {
  background-color: #fff3cd;
  color: #856404;
}

/* 游戏控制区 */
.game-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.score {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.controls {
  margin: 10px 0;
  text-align: center;
}

.button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #217346; /* Excel 绿色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #1a5c38;
}

.game-over {
  font-size: 24px;
  color: #f44336;
  margin-bottom: 10px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 底部区域 */
.bottom-section {
  position: relative;
  width: 100%;
}

/* 游戏说明框 - 修改为绝对定位在右下角 */
.instructions-box {
  position: absolute;
  bottom: 30px; /* 距离底部的距离 */
  right: 20px; /* 距离右侧的距离 */
  width: 200px; /* 减小宽度 */
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px; /* 减小内边距 */
  border-radius: 8px;
  font-size: 12px; /* 减小字体大小 */
  color: #333;
  border: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 确保在底部图片上方 */
}

.instructions-box h3 {
  margin-bottom: 5px; /* 减小间距 */
  font-size: 14px; /* 减小标题字体 */
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.instructions-box p {
  margin: 3px 0; /* 减小段落间距 */
  line-height: 1.3; /* 减小行高 */
}

/* 底部状态栏 */
.bottombar {
  width: 100%;
  height: auto;
  background-color: #f3f3f3;
}

.bottom-image {
  width: 100%;
  display: block;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .excel-cell {
    width: 60px;
  }
  
  .instructions-box {
    width: 150px; /* 在小屏幕上进一步减小宽度 */
    font-size: 11px; /* 在小屏幕上进一步减小字体 */
    bottom: 40px; /* 调整位置 */
    right: 10px;
  }
  
  .instructions-box h3 {
    font-size: 13px;
  }
}
</style>