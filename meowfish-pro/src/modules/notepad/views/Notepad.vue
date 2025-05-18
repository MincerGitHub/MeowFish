<template>
  <div class="editor-container" @click="focusEditor">
    <!-- 标题栏 -->
    <div class="title-bar">
      <div class="title-left">
        <div class="icon"></div>
        <span class="title-text">新建 文本文档.txt</span>
        <span class="dot">•</span>
      </div>
      <div class="title-right">
        <button class="window-btn">−</button>
        <button class="window-btn">□</button>
        <button class="window-btn">×</button>
      </div>
    </div>

    <!-- 菜单栏 -->
    <div class="menu-bar">
      <div class="menu-item">文件</div>
      <div class="menu-item">编辑</div>
      <div class="menu-item">查看</div>
      <div class="settings-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div 
      class="editor-area" 
      tabindex="0" 
      ref="editorRef"
      @keydown="handleKeyDown"
      @click="focusEditor"
    >
      <div v-if="gameState === 'input'" class="input-area">
        <span class="cursor">|</span>
        <input 
          ref="inputRef"
          v-model="userInput" 
          class="idiom-input" 
          placeholder="请输入一个成语..."
          @keydown.stop="handleInputKeyDown"
          :disabled="gameState !== 'input'"
          autofocus
        />
      </div>
      <div v-else class="display-area">
        <div v-for="(idiom, index) in displayedIdioms" :key="index" class="idiom-line">
          {{ idiom }}
        </div>
        <div class="game-status">
          按任意键继续...（每按两次键显示一个字）
          <div class="key-counter">已按键 {{ keyPressCount % 2 }} / 2</div>
        </div>
      </div>
    </div>

    <!-- 状态栏 -->
    <div class="status-bar">
      <div class="status-item">行 {{ lineCount }}, 列 {{ columnCount }}</div>
      <div class="status-item">{{ charCount }} 个字符</div>
      <div class="status-spacer"></div>
      <div class="status-item">100%</div>
      <div class="status-item">Windows (CRLF)</div>
      <div class="status-item">UTF-8</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import idiomsData from '@/assets/result.json' // 引入成语数据库

// 成语数据库
const idioms = ref([]) // 改为动态加载

// 加载成语数据库
onMounted(() => {
  idioms.value = idiomsData
})

// 游戏状态
const gameState = ref('input') // 'input' 或 'display'
const userInput = ref('')
const idiomChain = ref([])
const displayedIdioms = ref([])
const currentIdiomIndex = ref(0)
const displayedChars = ref(0)
const lineCount = ref(1)
const columnCount = ref(1)
const charCount = ref(0)
const maxLines = 20 // 最大显示行数
const editorRef = ref(null)
const inputRef = ref(null)
const keyPressCount = ref(0) // 新增：按键计数器

// 计算字符数
watch(userInput, (newVal) => {
  charCount.value = newVal.length
})

// 检查是否为有效成语
const isValidIdiom = (idiom) => {
  return idioms.value.includes(idiom)
}

// 查找下一个成语（相同首字）
const findNextIdiom = (currentIdiom) => {
  // 获取当前成语的首字
  const firstChar = currentIdiom.charAt(0)
  
  // 查找所有以相同字开头的成语，但排除已经使用过的
  const possibleIdioms = idioms.value.filter(idiom => 
    idiom.charAt(0) === firstChar && !idiomChain.value.includes(idiom)
  )
  
  if (possibleIdioms.length > 0) {
    // 随机选择一个成语
    const nextIdiom = possibleIdioms[Math.floor(Math.random() * possibleIdioms.length)]
    idiomChain.value.push(nextIdiom)
    return true
  }
  
  return false
}

// 确保编辑区域获得焦点
const focusEditor = () => {
  if (gameState.value === 'input') {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  } else if (editorRef.value) {
    editorRef.value.focus()
  }
}

// 开始成语接龙
const startChain = () => {
  if (isValidIdiom(userInput.value)) {
    gameState.value = 'display'
    idiomChain.value = [userInput.value]
    displayedIdioms.value = [userInput.value]
    currentIdiomIndex.value = 0
    displayedChars.value = 0
    lineCount.value = 1
    keyPressCount.value = 0 // 重置按键计数器
    
    // 查找下一个成语
    findNextIdiom(userInput.value)
    
    // 准备显示下一个成语的第一个字
    currentIdiomIndex.value = 1
    displayedChars.value = 1
    
    // 更新显示
    updateDisplay()
    
    // 确保编辑区域获得焦点
    nextTick(() => {
      focusEditor()
    })
  } else {
    alert('请输入有效的成语！')
  }
}

// 更新显示
const updateDisplay = () => {
  if (currentIdiomIndex.value >= idiomChain.value.length) {
    return
  }
  
  const currentIdiom = idiomChain.value[currentIdiomIndex.value]
  
  // 更新显示的成语
  displayedIdioms.value = [
    ...idiomChain.value.slice(0, currentIdiomIndex.value),
    currentIdiom.substring(0, displayedChars.value)
  ]
  
  // 更新行数和字符数
  lineCount.value = displayedIdioms.value.length
  charCount.value = displayedIdioms.value.join('\n').length
}

// 继续显示
const continueDisplay = () => {
  // 增加按键计数
  keyPressCount.value++
  
  // 每按两次键才显示一个新字符
  if (keyPressCount.value % 2 !== 0) {
    return // 如果不是第二次按键，直接返回
  }
  
  if (currentIdiomIndex.value >= idiomChain.value.length) {
    return
  }
  
  const currentIdiom = idiomChain.value[currentIdiomIndex.value]
  
  if (displayedChars.value < currentIdiom.length) {
    // 显示当前成语的下一个字
    displayedChars.value++
    updateDisplay()
  } else {
    // 当前成语已完全显示，准备显示下一个成语
    lineCount.value++
    
    if (lineCount.value >= maxLines) {
      // 达到最大行数，重置游戏
      resetGame()
      return
    }
    
    // 查找下一个成语
    if (currentIdiomIndex.value === idiomChain.value.length - 1) {
      const hasNext = findNextIdiom(currentIdiom)
      if (!hasNext) {
        // 没有可接龙的成语，重置游戏
        alert('没有更多相同首字的成语了！')
        resetGame()
        return
      }
    }
    
    // 准备显示下一个成语
    currentIdiomIndex.value++
    displayedChars.value = 1
    updateDisplay()
  }
}

// 重置游戏
const resetGame = () => {
  gameState.value = 'input'
  userInput.value = ''
  idiomChain.value = []
  displayedIdioms.value = []
  currentIdiomIndex.value = 0
  displayedChars.value = 0
  lineCount.value = 1
  columnCount.value = 1
  charCount.value = 0
  keyPressCount.value = 0 // 重置按键计数器
  
  // 聚焦输入框
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

// 处理键盘事件
const handleKeyDown = (e) => {
  if (gameState.value === 'display') {
    e.preventDefault()
    continueDisplay()
  }
}

// 处理输入框键盘事件
const handleInputKeyDown = (e) => {
  if (e.key === 'Enter' && userInput.value.length >= 2) {
    e.preventDefault()
    startChain()
  }
}

// 组件挂载时聚焦输入框
onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
  
  // 全局键盘事件处理函数
  const handleGlobalKeyDown = (e) => {
    if (gameState.value === 'display') {
      continueDisplay()
    }
  }

  // 添加全局键盘事件监听
  window.addEventListener('keydown', handleGlobalKeyDown)
  
  // 添加闪烁光标效果
  const cursorInterval = setInterval(() => {
    const cursor = document.querySelector('.cursor')
    if (cursor) {
      cursor.style.visibility = cursor.style.visibility === 'hidden' ? 'visible' : 'hidden'
    }
  }, 500)
  
  // 组件卸载时清除定时器和事件监听
  return () => {
    clearInterval(cursorInterval)
    window.removeEventListener('keydown', handleGlobalKeyDown)
  }
})
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  color: #fff;
  font-family: 'Consolas', 'Microsoft YaHei', monospace;
  overflow: hidden;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2d2d2d;
  padding: 4px 8px;
  border-bottom: 1px solid #444;
}

.title-left {
  display: flex;
  align-items: center;
}

.icon {
  width: 16px;
  height: 16px;
  background-color: #0078d7;
  margin-right: 8px;
}

.title-text {
  font-size: 12px;
}

.dot {
  margin: 0 8px;
}

.title-right {
  display: flex;
}

.window-btn {
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
}

.window-btn:hover {
  background-color: #444;
}

.menu-bar {
  display: flex;
  background-color: #2d2d2d;
  padding: 4px 8px;
  border-bottom: 1px solid #444;
  font-size: 12px;
}

.menu-item {
  margin-right: 24px;
  cursor: pointer;
}

.menu-item:hover {
  text-decoration: underline;
}

.settings-icon {
  margin-left: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.editor-area {
  flex: 1;
  padding: 8px;
  background-color: #1e1e1e;
  overflow-y: auto;
  outline: none;
  position: relative;
}

.input-area {
  display: flex;
  align-items: center;
}

.cursor {
  font-size: 16px;
  animation: blink 1s step-end infinite;
}

.idiom-input {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  font-family: 'Consolas', 'Microsoft YaHei', monospace;
  outline: none;
  padding: 0;
  margin-left: 4px;
  width: calc(100% - 20px);
}

.display-area {
  white-space: pre-wrap;
  line-height: 1.5;
}

.idiom-line {
  margin-bottom: 4px;
}

.game-status {
  margin-top: 8px;
  color: #888;
  font-style: italic;
}

.key-counter {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}

.status-bar {
  display: flex;
  background-color: #0078d7;
  padding: 2px 8px;
  font-size: 12px;
  color: #fff;
}

.status-item {
  margin-right: 16px;
}

.status-spacer {
  flex: 1;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>