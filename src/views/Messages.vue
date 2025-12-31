<template>
  <div class="messages-page">
    <div class="page-header">
      <h2>历史消息</h2>
      <p>查看设备发送的所有历史消息</p>
    </div>

    <div class="messages-section">
      <div class="section-header">
        <h3>消息列表</h3>
        <button @click="refreshMessages" class="refresh-btn" :disabled="loading">
          <span class="refresh-icon">🔄</span>
          刷新消息
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="error" class="error-card">
        <span class="error-icon">⚠️</span>
        <div class="error-content">
          <h3>加载失败</h3>
          <p>{{ error }}</p>
          <button @click="refreshMessages" class="retry-btn">重试</button>
        </div>
      </div>

      <div v-else-if="messages.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <h3>暂无消息</h3>
        <p>设备尚未发送任何消息</p>
      </div>

      <div v-else class="messages-list">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message-card', { 'warning-message': isWarningMessage(message) }]">
          <div class="message-header">
            <span class="message-time">{{ formatTime(message.event_time) }}</span>
            <span class="message-type" :class="{ 'warning-type': isWarningMessage(message) }">
              {{ isWarningMessage(message) ? '警告' : message.event }}
            </span>
          </div>
          <div class="message-content">
            <pre>{{ formatMessageContent(message.content) }}</pre>
          </div>
          <div class="message-footer">
            <div class="message-details">
              <span v-if="message.temp !== null">温度: {{ message.temp }}°C</span>
              <span v-if="message.lsens !== null">光照: {{ message.lsens }} Lux</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deviceAPI } from '../services/api'

const loading = ref(false)
const error = ref('')
const messages = ref<any[]>([])

const refreshMessages = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await deviceAPI.getHistoricalMessages()
    if (response.data.success) {
      // 检查数据是否为数组，如果不是，转换为数组
      const data = Array.isArray(response.data.data) 
        ? response.data.data 
        : [response.data.data]
      
      // 处理消息数据，提取msg_key和msg_values
      messages.value = data.map((item: any) => {
        // 尝试解析msg_values中的JSON内容
        let content = ''
        try {
          if (typeof item.msg_values === 'string') {
            const parsed = JSON.parse(item.msg_values)
            content = JSON.stringify(parsed, null, 2)
          } else {
            content = JSON.stringify(item.msg_values, null, 2)
          }
        } catch (e) {
          content = item.msg_values || ''
        }
        
        return {
          event_time: item.msg_key, // 使用msg_key作为事件时间
          event: 'message', // 设置事件类型
          content: content, // 使用解析后的内容
          temp: null, // 如果消息中没有温度数据，设为null
          lsens: null // 如果消息中没有光照数据，设为null
        }
      })
    }
  } catch (err: any) {
    error.value = '获取消息失败'
    console.error('获取历史消息失败:', err)
  } finally {
    loading.value = false
  }
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  
  try {
    // 处理格式如 '20251230T063705Z' 的时间字符串
    const datePart = timeStr.substring(0, 8) // '20251230'
    const timePart = timeStr.substring(9, 15) // '063705'
    
    // 转换为标准格式
    const year = datePart.substring(0, 4)
    const month = datePart.substring(4, 6)
    const day = datePart.substring(6, 8)
    
    const hours = timePart.substring(0, 2)
    const minutes = timePart.substring(2, 4)
    const seconds = timePart.substring(4, 6)
    
    // 创建Date对象并转换为北京时间
    const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`)
    const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000)
    
    // 格式化为可读字符串
    return `${beijingTime.getFullYear()}-${String(beijingTime.getMonth() + 1).padStart(2, '0')}-${String(beijingTime.getDate()).padStart(2, '0')} ${String(beijingTime.getHours()).padStart(2, '0')}:${String(beijingTime.getMinutes()).padStart(2, '0')}:${String(beijingTime.getSeconds()).padStart(2, '0')}`
  } catch (error) {
    console.error('时间转换错误:', error)
    return timeStr // 如果转换失败，返回原始字符串
  }
}

const formatMessageContent = (content: string) => {
  if (!content) return ''
  
  try {
    // 尝试解析JSON内容
    const parsed = JSON.parse(content)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    // 如果不是JSON，直接返回原始内容
    return content
  }
}

// 检查消息是否为警告消息
const isWarningMessage = (message: any) => {
  if (!message.content) return false
  
  try {
    const parsed = JSON.parse(message.content)
    return parsed.content && parsed.content.Messages === 'Warning'
  } catch (error) {
    return false
  }
}

onMounted(() => {
  refreshMessages()
})
</script>

<style scoped>
.messages-page {
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h2 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.messages-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h3 {
  color: #333;
  font-size: 1.5rem;
  margin: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

.refresh-btn:hover:not(:disabled) .refresh-icon {
  transform: rotate(180deg);
}

.loading-state {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  color: #c53030;
}

.error-icon {
  font-size: 2rem;
}

.error-content h3 {
  margin: 0 0 0.5rem 0;
  color: #c53030;
}

.error-content p {
  margin: 0 0 1rem 0;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background: #c53030;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.retry-btn:hover {
  background: #b91c1c;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.message-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

/* 警告消息样式 */
.message-card.warning-message {
  border: 1px solid #feb2b2;
  background: #fff5f5;
}

.message-card.warning-message:hover {
  box-shadow: 0 4px 12px rgba(254, 178, 178, 0.3);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.message-card.warning-message .message-header {
  background: #fed7d7;
  border-bottom: 1px solid #feb2b2;
}

.message-time {
  font-weight: 600;
  color: #4a5568;
}

.message-type {
  padding: 0.25rem 0.75rem;
  background: #667eea;
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* 警告类型样式 */
.message-type.warning-type {
  background: #c53030;
}

.message-content {
  padding: 1.5rem;
}

.message-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #2d3748;
}

.message-footer {
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
}

.message-card.warning-message .message-footer {
  background: #fed7d7;
  border-top: 1px solid #feb2b2;
}

.message-details {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .message-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .message-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
