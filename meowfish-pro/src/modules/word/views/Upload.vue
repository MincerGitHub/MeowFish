<template>
  <div class="upload-container gradient-bg">
    <div class="upload-modal">
      <h2 class="modal-header">上传</h2>
      
      <div 
        class="drop-area" 
        :class="{ 'active': isDragging }"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        @click="triggerFileInput"
      >
        <input 
          type="file" 
          ref="fileInput" 
          @change="onFileSelected" 
          accept=".docx" 
          style="display: none"
        />
        <div class="drop-content">
          <div v-if="selectedFile">
            <p>已选择文件: {{ selectedFile.name }}</p>
          </div>
          <div v-else>
            <p>选择文件并上传</p>
            <p class="small-text">点击或拖拽文件到此处</p>
          </div>
        </div>
      </div>
      
      <div class="button-group">
        <button 
          class="btn btn-primary" 
          @click="uploadFile" 
          :disabled="!selectedFile || uploading"
        >
          {{ uploading ? '上传中...' : '完成' }}
        </button>
        <button class="btn btn-outline" @click="goBack">返回</button>
      </div>
      
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadDocument } from '../api/document'

const router = useRouter()
const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const error = ref('')
const success = ref('')
const uploading = ref(false)

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
}

// 文件选择处理
const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.name.endsWith('.docx')) {
      selectedFile.value = file
      error.value = ''
    } else {
      error.value = '请上传.docx格式的文件'
      selectedFile.value = null
    }
  }
}

// 拖拽相关处理
const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  
  if (file) {
    if (file.name.endsWith('.docx')) {
      selectedFile.value = file
      error.value = ''
    } else {
      error.value = '请上传.docx格式的文件'
      selectedFile.value = null
    }
  }
}

// 上传文件
const uploadFile = async () => {
  if (!selectedFile.value) return
  
  try {
    uploading.value = true
    error.value = ''
    success.value = ''
    
    await uploadDocument(selectedFile.value)
    
    success.value = '文件上传成功！'
    selectedFile.value = null
    
    // 3秒后返回首页
    setTimeout(() => {
      router.push('/word')
    }, 3000)
  } catch (err) {
    error.value = err.message || '文件上传失败'
  } finally {
    uploading.value = false
  }
}

// 返回首页
const goBack = () => {
  router.push('/word')
}
</script>

<style scoped>
.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.upload-modal {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.drop-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 40px 20px;
  text-align: center;
  margin: 20px 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.drop-area:hover, .drop-area.active {
  border-color: #1976d2;
  background-color: #f0f7ff;
}

.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.small-text {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.error-message {
  color: #f44336;
  margin-top: 15px;
  text-align: center;
}

.success-message {
  color: #4caf50;
  margin-top: 15px;
  text-align: center;
}
</style>