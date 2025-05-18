<template>
  <div class="home-container">
    <!-- 顶部图片 -->
    <div class="topbar">
      <img src="../../../assets/ppt-top.png" alt="顶部图片" class="fixed-image top-image">
    </div>
    
    <!-- 中间内容区域 - 扫雷游戏 -->
    <div class="content-wrapper">
      <div class="content" id="content" ref="contentDiv">
        <!-- 游戏控制和信息区容器 -->
        <div class="game-header">
          <!-- 游戏控制区 -->
          <div class="controls">
            <div class="difficulty">
              <button 
                v-for="level in difficultyLevels" 
                :key="level.name" 
                class="difficulty-btn" 
                :class="{ 
                  'active': currentDifficulty === level.value,
                  'challenge': level.value === 'challenge' 
                }"
                @click="changeDifficulty(level.value)"
              >
                {{ level.name }}
              </button>
            </div>
          </div>
          
          <!-- 游戏信息区 -->
          <div class="game-info">
            <div class="info-item">
              <i>🚩</i>
              <span id="mine-count">{{ minesLeft }}</span>
            </div>
            <div class="info-item">
              <i>⏱️</i>
              <span id="timer">{{ timeElapsed }}</span>
            </div>
          </div>
        </div>
        
        <!-- 游戏板 -->
        <div 
          class="game-board" 
          :class="{ 'challenge-mode': currentDifficulty === 'challenge' }" 
          ref="boardElement"
          :style="boardGridStyle"
        >
          <template v-for="(row, rowIndex) in gameBoard" :key="rowIndex">
            <div 
              v-for="(cell, colIndex) in row" 
              :key="`${rowIndex}-${colIndex}`"
              class="cell"
              :style="{ backgroundColor: cell.color }"
              :class="{ 
                'revealed': cell.isRevealed, 
                'mine': cell.isRevealed && cell.isMine,
                'flagged': cell.isFlagged 
              }"
              :data-row="rowIndex"
              :data-col="colIndex"
              @click="handleCellClick(rowIndex, colIndex)"
              @contextmenu.prevent="handleCellRightClick(rowIndex, colIndex)"
            >
              <span v-if="cell.isRevealed && cell.neighborMines > 0" :class="`number-${cell.neighborMines}`">
                {{ cell.neighborMines }}
              </span>
              <span v-if="cell.isRevealed && cell.isMine">💣</span>
              <span class="cell-number">{{ rowIndex * getDifficulty().cols + colIndex + 1 }}</span>
            </div>
          </template>
        </div>
        
        <!-- 游戏状态 -->
        <div class="game-status" :class="{ 'win': gameStatus === 'win', 'lose': gameStatus === 'lose' }" v-if="gameStatus">
          {{ gameStatus === 'win' ? '恭喜你赢了！' : '游戏结束！' }}
        </div>
        
        <!-- 重置按钮 -->
        <button class="reset-btn" @click="initGame">重新开始</button>
        
        <!-- 游戏说明 -->
        <div class="instructions">
          <h2>游戏说明</h2>
          <p><strong>目标：</strong>找出所有非地雷的格子，同时避免踩到地雷。</p>
          <p><strong>操作：</strong></p>
          <p>- 左键点击：揭开格子</p>
          <p>- 右键点击：标记/取消标记可能的地雷</p>
          <p><strong>难度级别：</strong></p>
          <p>- 简单：6×6 网格，6 个地雷</p>
          <p>- 中等：15×15 网格，35 个地雷</p>
          <p>- 困难：30×20 网格，100 个地雷</p>
          <p>- 挑战：50×40 网格，350 个地雷</p>
        </div>
      </div>
    </div>
    
    <!-- 底部图片 -->
    <div class="bottombar">
      <img src="../../../assets/ppt-bottom.png" alt="底部图片" class="fixed-image bottom-image">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// 游戏配置
const DIFFICULTY = {
  easy: { rows: 6, cols: 6, mines: 6 },
  medium: { rows: 15, cols: 15, mines: 35 },
  hard: { rows: 30, cols: 20, mines: 100 },
  challenge: { rows: 50, cols: 40, mines: 350 }
};

const difficultyLevels = [
  { name: '简单', value: 'easy' },
  { name: '中等', value: 'medium' },
  { name: '困难', value: 'hard' },
  { name: '挑战', value: 'challenge' }
];

// 游戏状态
const gameBoard = ref([]);
const currentDifficulty = ref('easy');
const minesLeft = ref(DIFFICULTY.easy.mines);
const timeElapsed = ref(0);
const timerInterval = ref(null);
const gameStarted = ref(false);
const gameOver = ref(false);
const gameStatus = ref('');
const boardElement = ref(null);

// 获取当前难度配置
const getDifficulty = () => DIFFICULTY[currentDifficulty.value];

// 计算游戏板网格样式
const boardGridStyle = computed(() => {
  if (currentDifficulty.value === 'challenge') {
    return {}; // 挑战模式已经在CSS中定义了固定的网格列数
  } else {
    const cols = getDifficulty().cols;
    return {
      gridTemplateColumns: `repeat(${cols}, 1fr)`
    };
  }
});

// 生成随机颜色
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 30); // 70-100%
  const lightness = 60 + Math.floor(Math.random() * 20); // 60-80%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// 初始化游戏
const initGame = () => {
  // 重置游戏状态
  gameBoard.value = [];
  minesLeft.value = getDifficulty().mines;
  timeElapsed.value = 0;
  gameStarted.value = false;
  gameOver.value = false;
  gameStatus.value = '';
  
  // 清除计时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  
  // 创建游戏板
  createBoard();
};

// 创建游戏板
const createBoard = () => {
  const { rows, cols } = getDifficulty();
  
  // 初始化游戏板数组
  const newBoard = [];
  for (let i = 0; i < rows; i++) {
    newBoard[i] = [];
    for (let j = 0; j < cols; j++) {
      newBoard[i][j] = {
        row: i,
        col: j,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
        color: getRandomColor() // 为每个格子分配随机颜色
      };
    }
  }
  gameBoard.value = newBoard;
};

// 放置地雷
const placeMines = (firstClickRow, firstClickCol) => {
  const { rows, cols, mines } = getDifficulty();
  let minesPlaced = 0;
  
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    // 确保第一次点击的位置及其周围没有地雷
    const isTooCloseToFirstClick = 
      Math.abs(row - firstClickRow) <= 1 && 
      Math.abs(col - firstClickCol) <= 1;
    
    if (!gameBoard.value[row][col].isMine && !isTooCloseToFirstClick) {
      gameBoard.value[row][col].isMine = true;
      minesPlaced++;
    }
  }
  
  // 计算每个单元格周围的地雷数量
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!gameBoard.value[i][j].isMine) {
        gameBoard.value[i][j].neighborMines = countNeighborMines(i, j);
      }
    }
  }
};

// 计算周围地雷数量
const countNeighborMines = (row, col) => {
  let count = 0;
  const { rows, cols } = getDifficulty();
  
  for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
    for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
      if (i === row && j === col) continue;
      if (gameBoard.value[i][j].isMine) count++;
    }
  }
  
  return count;
};

// 处理单元格点击
const handleCellClick = (row, col) => {
  if (gameOver.value) return;
  
  const cell = gameBoard.value[row][col];
  
  // 如果已标记或已揭开，则不做任何操作
  if (cell.isFlagged || cell.isRevealed) return;
  
  // 第一次点击时开始游戏
  if (!gameStarted.value) {
    gameStarted.value = true;
    placeMines(row, col);
    startTimer();
  }
  
  // 如果点击到地雷，游戏结束
  if (cell.isMine) {
    revealAllMines();
    endGame(false);
    return;
  }
  
  // 揭开单元格
  revealCell(row, col);
  
  // 检查是否获胜
  checkWin();
};

// 处理单元格右键点击（标记）
const handleCellRightClick = (row, col) => {
  if (gameOver.value || !gameStarted.value) return;
  
  const cell = gameBoard.value[row][col];
  
  // 如果已揭开，则不做任何操作
  if (cell.isRevealed) return;
  
  // 切换标记状态
  cell.isFlagged = !cell.isFlagged;
  
  // 更新剩余地雷数量
  minesLeft.value += cell.isFlagged ? -1 : 1;
};

// 揭开单元格
const revealCell = (row, col) => {
  const { rows, cols } = getDifficulty();
  const cell = gameBoard.value[row][col];
  
  // 如果已揭开或已标记，则不做任何操作
  if (cell.isRevealed || cell.isFlagged) return;
  
  // 标记为已揭开
  cell.isRevealed = true;
  
  // 如果周围没有地雷，则自动揭开周围的单元格
  if (cell.neighborMines === 0) {
    for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
      for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
        if (i === row && j === col) continue;
        revealCell(i, j);
      }
    }
  }
};

// 揭开所有地雷
const revealAllMines = () => {
  const { rows, cols } = getDifficulty();
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (gameBoard.value[i][j].isMine) {
        gameBoard.value[i][j].isRevealed = true;
      }
    }
  }
};

// 检查是否获胜
const checkWin = () => {
  const { rows, cols, mines } = getDifficulty();
  let revealedCount = 0;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (gameBoard.value[i][j].isRevealed) revealedCount++;
    }
  }
  
  // 如果揭开的单元格数量等于总单元格数量减去地雷数量，则获胜
  if (revealedCount === rows * cols - mines) {
    endGame(true);
  }
};

// 开始计时器
const startTimer = () => {
  timerInterval.value = setInterval(() => {
    timeElapsed.value++;
  }, 1000);
};

// 结束游戏
const endGame = (isWin) => {
  gameOver.value = true;
  
  // 停止计时器
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  
  // 更新游戏状态
  gameStatus.value = isWin ? 'win' : 'lose';
  
  // 如果获胜，标记所有地雷
  if (isWin) {
    const { rows, cols } = getDifficulty();
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (gameBoard.value[i][j].isMine && !gameBoard.value[i][j].isFlagged) {
          gameBoard.value[i][j].isFlagged = true;
        }
      }
    }
    
    minesLeft.value = 0;
  }
};

// 切换难度
const changeDifficulty = (difficulty) => {
  currentDifficulty.value = difficulty;
  initGame();
};

// 组件挂载时初始化游戏
onMounted(() => {
  initGame();
});

// 组件卸载时清除计时器
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<style scoped>
.home-container {
  margin: 0;
  font-family: Arial, sans-serif;
  position: relative;
  background-color: #e6e8ea;
  min-height: 100vh;
  width: 100%;
  height: auto;
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

/* 内容区域样式 - 增加顶部间距 */
.content-wrapper {
  /* 增加顶部间距，确保内容不被顶部栏遮挡 */
  padding-top: 140px; /* 调整这个值以适应顶部栏的高度 */
  padding-bottom: 20px; /* 为底部栏留出空间 */
  padding-left: 0.5cm;
  padding-right: 0.5cm;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  width: 100%;
  max-width: calc(100vw - 1cm);
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  margin: 20px 0;
  /* 确保内容在顶部和底部栏之间 */
  position: relative;
  z-index: 1;
}

/* 游戏控制和信息区容器 */
.game-header {
  display: flex;
  justify-content: center; /* 改为居中对齐 */
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  gap: 30px; /* 控制两个区域之间的距离 */
}

/* 游戏控制区样式 */
.controls {
  display: flex;
  justify-content: flex-end; /* 向右对齐，靠近中间 */
}

.difficulty {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.difficulty-btn {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.difficulty-btn:hover {
  background-color: #45a049;
}

.difficulty-btn.active {
  background-color: #2E7D32;
  font-weight: bold;
}

.difficulty-btn.challenge {
  background-color: #F44336;
}

.difficulty-btn.challenge:hover {
  background-color: #D32F2F;
}

.difficulty-btn.challenge.active {
  background-color: #B71C1C;
}

/* 游戏信息区样式 */
.game-info {
  display: flex;
  gap: 20px;
  font-size: 18px;
  justify-content: flex-start; /* 向左对齐，靠近中间 */
}

.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.info-item i {
  font-size: 20px;
}

/* 游戏板样式 */
.game-board {
  display: grid;
  gap: 15px;
  background-color: #e0e0e0;
  padding: 15px;
  width: 100%;
  overflow: auto;
  max-height: 60vh; /* 减小最大高度，确保在小屏幕上也能看到底部内容 */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* 挑战模式的网格列数 */
.challenge-mode {
  grid-template-columns: repeat(40, 1fr);
}

/* 单元格样式 */
.cell {
  aspect-ratio: 2/1; /* 2:1的长方形 */
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: relative;
}

.cell:hover {
  filter: brightness(1.1);
}

.cell.revealed {
  background-color: #ffffff !important; /* 扫过的格子为白色 */
}

.cell.mine {
  background-color: #ffcdd2 !important;
}

.cell.flagged::after {
  content: "🚩";
  font-size: 24px;
  position: absolute;
}

/* 单元格编号 */
.cell-number {
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 12px;
  color: #333;
}

/* 数字颜色 */
.number-1 { color: blue; }
.number-2 { color: green; }
.number-3 { color: red; }
.number-4 { color: darkblue; }
.number-5 { color: brown; }
.number-6 { color: teal; }
.number-7 { color: black; }
.number-8 { color: gray; }

/* 游戏状态样式 */
.game-status {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 4px;
  width: 100%;
  text-align: center;
}

.game-status.win {
  background-color: #4CAF50;
  color: white;
}

.game-status.lose {
  background-color: #f44336;
  color: white;
}

/* 重置按钮样式 */
.reset-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.reset-btn:hover {
  background-color: #0b7dda;
}

/* 游戏说明样式 */
.instructions {
  margin-top: 30px;
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  width: 100%;
}

.instructions h2 {
  margin-bottom: 10px;
  color: #333;
}

.instructions p {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 挑战模式的小格子 */
.challenge-mode .cell {
  font-size: 12px;
}

.challenge-mode .cell-number {
  font-size: 8px;
}

.challenge-mode .cell.flagged::after {
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .controls, .game-info {
    width: 100%;
    justify-content: center;
  }
  
  /* 增加顶部间距，适应移动设备 */
  .content-wrapper {
    padding-top: 100px;
    padding-bottom: 100px;
  }
  
  .cell {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  /* 进一步调整小屏幕设备的间距 */
  .content-wrapper {
    padding-top: 80px;
    padding-bottom: 80px;
  }
  
  .cell {
    font-size: 16px;
  }
  
  .cell.flagged::after {
    font-size: 18px;
  }
}
</style>
