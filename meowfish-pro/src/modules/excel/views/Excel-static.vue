<template>
  <div class="game-container">
    <div class="excel-background"></div>
    <div class="game-area" ref="gameAreaRef">
      <div 
        v-for="(segment, index) in snake"
        :key="'segment-' + index"
        class="segment"
        :style="segmentStyle(segment)"
      >
        {{ index === 0 ? '头' : '蛇' }}
      </div>
      <div
        class="food"
        :style="foodStyle"
      >
        食物
      </div>
    </div>

    <div class="instructions-box">
      <h3>游戏说明</h3>
      <p>使用键盘方向键控制蛇的移动</p>
      <p>↑ 上 | ↓ 下 | ← 左 | → 右</p>
      <p>蛇头碰到边缘或自身将结束游戏</p>
      <p>吃到食物可增加分数</p>
    </div>

    <div class="ui-container">
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
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const CELL_SIZE = 20
const BOUNDARY_BUFFER = 3

// 游戏状态数据
const snake = ref([])
const direction = ref('right')
const food = ref({ x: 0, y: 0 })
const gameStarted = ref(false)
const isGameOver = ref(false)
const score = ref(0)
const gameInterval = ref(null)
const gridWidth = ref(0)
const gridHeight = ref(0)
const gameAreaRef = ref(null)

// 样式计算
const segmentStyle = (segment) => ({
  left: `${segment.x * CELL_SIZE}px`,
  top: `${segment.y * CELL_SIZE}px`
})

const foodStyle = computed(() => ({
  left: `${food.value.x * CELL_SIZE}px`,
  top: `${food.value.y * CELL_SIZE}px`
}))

// 模块：生成食物位置
const generateFood = () => ({
  x: BOUNDARY_BUFFER + Math.floor(Math.random() * (gridWidth.value - 2 * BOUNDARY_BUFFER)),
  y: BOUNDARY_BUFFER + Math.floor(Math.random() * (gridHeight.value - 2 * BOUNDARY_BUFFER))
})

// 模块：检测碰撞
const checkCollision = (head) => {
  return (
    head.x < 0 ||
    head.x >= gridWidth.value ||
    head.y < 0 ||
    head.y >= gridHeight.value ||
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
}

// 模块：游戏结束逻辑
const gameOver = () => {
  clearInterval(gameInterval.value)
  gameStarted.value = false
  isGameOver.value = true
}

// 模块：重置游戏
const resetGame = () => {
  if (gridWidth.value === 0 || gridHeight.value === 0) {
    initializeGameArea()
  }
  
  snake.value = [
    { x: Math.floor(gridWidth.value / 4), y: Math.floor(gridHeight.value / 2) },
    { x: Math.floor(gridWidth.value / 4) - 1, y: Math.floor(gridHeight.value / 2) },
    { x: Math.floor(gridWidth.value / 4) - 2, y: Math.floor(gridHeight.value / 2) }
  ]
  direction.value = 'right'
  food.value = generateFood()
  score.value = 0
  isGameOver.value = false
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

// 模块：初始化游戏区域
const initializeGameArea = () => {
  if (!gameAreaRef.value) return
  
  const gameAreaWidth = gameAreaRef.value.clientWidth
  const gameAreaHeight = gameAreaRef.value.clientHeight
  
  gridWidth.value = Math.floor(gameAreaWidth / CELL_SIZE)
  gridHeight.value = Math.floor(gameAreaHeight / CELL_SIZE)
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
  initializeGameArea()
  window.addEventListener('keydown', handleKeydown)
  resetGame()
  window.addEventListener('resize', () => {
    initializeGameArea()
    if (gameStarted.value) {
      gameOver()
    }
    resetGame()
  })
})

onBeforeUnmount(() => {
  clearInterval(gameInterval.value)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', initializeGameArea)
})
</script>

<style scoped>
.game-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.excel-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../../assets/excel-bg.png'); /* 修改为正确的图片路径 */
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #000;
    z-index: 1;
}

.game-area {
    position: absolute;
    /* 这些值需要根据实际背景图片调整，以确保游戏区域只在白色表格内 */
    top: 242px;
    /* 表格区域的起始位置 */
    left: 25px;
    width: 1000px;
    /* 表格区域的宽度 */
    height: 570px;
    /* 表格区域的高度 */
    z-index: 2;
}

.segment {
    width: 20px;
    height: 20px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #fff;
    background-color: rgba(128, 128, 128, 0.8);
    /* 灰色 */
    border-radius: 4px;
    z-index: 3;
}

.food {
    width: 40px;
    height: 20px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #000;
    /* 黑色文字 */
    background-color: rgba(255, 255, 0, 0.8);
    /* 黄色 */
    border-radius: 4px;
    z-index: 3;
}

.ui-container {
    position: fixed;
    top: 10px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 4;
}

.score {
    font-size: 18px;
    color: #fff;
    margin-bottom: 10px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 5px 15px;
    border-radius: 20px;
    position: relative;
    left: 250px;
}

.controls {
    margin: 10px 0;
    text-align: center;
    position: relative;
    left: 370px; /* 向右移动7cm (1cm ≈ 37.8px) */
    top: -60px; /* 向上移动到与分数在同一水平面上 */
}

.button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.button:hover {
    background-color: #45a049;
}

.game-over {
    font-size: 24px;
    color: #f44336;
    margin-bottom: 10px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 5px 15px;
    border-radius: 20px;
}

.instructions-box {
    position: absolute;
    top: 369px;
    /* 原来的293px + 76px (2cm) */
    right: 96px;
    /* 原来的58px + 38px (1cm) */
    width: 250px;
    background-color: rgba(200, 200, 200, 0.9);
    padding: 10px;
    border-radius: 4px;
    z-index: 5;
    font-size: 14px;
    color: #333;
    border: 1px solid #999;
}

.instructions-box h3 {
    margin-bottom: 5px;
    font-size: 16px;
    border-bottom: 1px solid #999;
    padding-bottom: 5px;
}

.instructions-box p {
    margin: 5px 0;
}
</style>