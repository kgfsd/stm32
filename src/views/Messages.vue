<template>
  <div class="messages-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">设备通信日志</h1>
        <p class="page-subtitle">设备通信历史记录与消息监控</p>
      </div>
    </div>

    <!-- 消息控制栏 -->
    <div class="messages-controls">
      <div class="controls-header">
        <div class="controls-title-group">
          <h2 class="controls-title">消息记录</h2>
          <p class="controls-description">实时显示设备通信消息</p>
        </div>
        <div class="controls-actions">
          <button @click="refreshMessages" class="refresh-btn" :disabled="loading">
            <svg class="refresh-icon" :class="{ spinning: loading }" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            {{ loading ? '加载中...' : '刷新记录' }}
          </button>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total-icon">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ messages.length }}</div>
            <div class="stat-label">消息总数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning-icon">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ warningCount }}</div>
            <div class="stat-label">警告消息</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon recent-icon">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ recentCount }}</div>
            <div class="stat-label">24小时内</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="messages-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">正在加载通信记录...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg width="40" height="40" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <div class="error-content">
          <h3 class="error-title">数据加载失败</h3>
          <p class="error-description">{{ error }}</p>
          <button @click="refreshMessages" class="retry-btn">
            重新加载
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="56" height="56" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
          </svg>
        </div>
        <h3 class="empty-title">暂无通信记录</h3>
        <p class="empty-description">设备尚未发送任何通信消息</p>
      </div>

      <!-- 消息列表 -->
      <div v-else class="messages-list">
        <div v-for="(message, index) in messages" :key="index"
             :class="['message-item', { 'warning-item': isWarningMessage(message) }]">
          <div class="message-header">
            <div class="message-time">
              <div class="time-icon">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <span class="time-text">{{ formatTime(message.event_time) }}</span>
            </div>
            <div class="message-type" :class="{ 'warning-type': isWarningMessage(message) }">
              <div class="type-indicator"></div>
              <span class="type-text">{{ getMessageType(message) }}</span>
            </div>
          </div>

          <div class="message-content">
            <div class="content-header">
              <h4 class="content-title">消息内容</h4>
              <button @click="copyMessage(message)" class="copy-btn" title="复制消息">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
            <div class="content-body">
              <pre class="message-data">{{ formatMessageContent(message.content) }}</pre>
            </div>
          </div>

          <!-- 数据指标 -->
          <div v-if="hasDataMetrics(message)" class="message-metrics">
            <div class="metrics-grid">
              <div v-if="getTemperature(message)" class="metric-item temp-metric">
                <div class="metric-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1v1h-2V5z"/>
                  </svg>
                </div>
                <div class="metric-content">
                  <div class="metric-value">{{ getTemperature(message) }}°C</div>
                  <div class="metric-label">温度</div>
                </div>
              </div>

              <div v-if="getLightSensor(message)" class="metric-item light-metric">
                <div class="metric-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                  </svg>
                </div>
                <div class="metric-content">
                  <div class="metric-value">{{ getLightSensor(message) }} Lux</div>
                  <div class="metric-label">光照强度</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 复制成功提示 -->
    <div v-if="showCopySuccess" class="copy-notification">
      <div class="notification-content">
        <svg class="success-icon" width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <span>消息内容已复制</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { deviceAPI } from '../services/api'

const loading = ref(false)
const error = ref('')
const messages = ref<any[]>([])
const showCopySuccess = ref(false)

// 计算统计信息
const warningCount = computed(() => {
  return messages.value.filter(msg => isWarningMessage(msg)).length
})

const recentCount = computed(() => {
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  return messages.value.filter(msg => {
    const messageTime = parseMessageTime(msg.event_time)
    return messageTime > twentyFourHoursAgo
  }).length
})

const parseMessageTime = (timeStr: string) => {
  try {
    const dateStr = timeStr.substring(0, 8)
    const timePart = timeStr.substring(9, 15)

    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    const hours = timePart.substring(0, 2)
    const minutes = timePart.substring(2, 4)
    const seconds = timePart.substring(4, 6)

    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`)
  } catch (error) {
    return new Date()
  }
}

const refreshMessages = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await deviceAPI.getHistoricalMessages()
    if (response.data.success) {
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data]

      messages.value = data.map((item: any) => {
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
          event_time: item.msg_key,
          event: 'message',
          content: content,
          temp: null,
          lsens: null
        }
      })
    }
  } catch (err: any) {
    error.value = '获取消息记录失败'
    console.error('获取历史消息失败:', err)
  } finally {
    loading.value = false
  }
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''

  try {
    const dateStr = timeStr.substring(0, 8)
    const timePart = timeStr.substring(9, 15)

    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    const hours = timePart.substring(0, 2)
    const minutes = timePart.substring(2, 4)
    const seconds = timePart.substring(4, 6)

    const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`)
    const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000)

    return `${beijingTime.getFullYear()}-${String(beijingTime.getMonth() + 1).padStart(2, '0')}-${String(beijingTime.getDate()).padStart(2, '0')} ${String(beijingTime.getHours()).padStart(2, '0')}:${String(beijingTime.getMinutes()).padStart(2, '0')}:${String(beijingTime.getSeconds()).padStart(2, '0')}`
  } catch (error) {
    console.error('时间转换错误:', error)
    return timeStr
  }
}

const formatMessageContent = (content: string) => {
  if (!content) return ''

  try {
    const parsed = JSON.parse(content)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    return content
  }
}

const isWarningMessage = (message: any) => {
  if (!message.content) return false

  try {
    const parsed = JSON.parse(message.content)
    return parsed.content && parsed.content.Messages === 'Warning'
  } catch (error) {
    return false
  }
}

const getMessageType = (message: any) => {
  return isWarningMessage(message) ? '警告消息' : '普通消息'
}

const hasDataMetrics = (message: any) => {
  return getTemperature(message) || getLightSensor(message)
}

const getTemperature = (message: any) => {
  try {
    const parsed = JSON.parse(message.content)
    return parsed.temp || parsed.temperature || null
  } catch (error) {
    return null
  }
}

const getLightSensor = (message: any) => {
  try {
    const parsed = JSON.parse(message.content)
    return parsed.lsens || parsed.light || parsed.light_sensor || null
  } catch (error) {
    return null
  }
}

const copyMessage = async (message: any) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify({
      time: formatTime(message.event_time),
      content: formatMessageContent(message.content)
    }, null, 2))

    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
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

/* 页面标题 */
.page-header {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e1e4e8;
}

.header-content {
  max-width: 800px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

/* 消息控制栏 */
.messages-controls {
  margin-bottom: 2.5rem;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.controls-title-group {
  flex: 1;
}

.controls-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.controls-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.controls-actions {
  flex-shrink: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
}

.refresh-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.refresh-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.refresh-icon {
  transition: transform 0.3s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.total-icon {
  background: linear-gradient(135deg, #2563eb15 0%, #1e40af15 100%);
  color: #2563eb;
  border: 1px solid #2563eb20;
}

.warning-icon {
  background: linear-gradient(135deg, #dc262615 0%, #b91c1c15 100%);
  color: #dc2626;
  border: 1px solid #dc262620;
}

.recent-icon {
  background: linear-gradient(135deg, #05966915 0%, #04785715 100%);
  color: #059669;
  border: 1px solid #05966920;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.125rem 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 消息容器 */
.messages-container {
  min-height: 400px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  text-align: center;
}

.loading-spinner {
  position: relative;
  width: 48px;
  height: 48px;
  margin-bottom: 1.5rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* 错误状态 */
.error-state {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 3rem;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #fecaca;
  text-align: center;
}

.error-icon {
  color: #dc2626;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
  text-align: left;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 1rem 0;
}

.error-description {
  color: #991b1b;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  font-size: 0.875rem;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  text-align: center;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* 消息列表 */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.message-item {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.message-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.message-item.warning-item {
  border: 1px solid #fecaca;
  background: #fef2f2;
}

.message-item.warning-item:hover {
  border-color: #fca5a5;
  box-shadow: 0 4px 12px rgba(254, 202, 202, 0.15);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.message-item.warning-item .message-header {
  background: #fee2e2;
  border-bottom: 1px solid #fecaca;
}

.message-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-icon {
  color: #6b7280;
  opacity: 0.7;
}

.time-text {
  font-weight: 500;
  color: #4b5563;
  font-size: 0.75rem;
  font-family: 'SF Mono', 'Courier New', monospace;
}

.message-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #2563eb15 0%, #1e40af15 100%);
  color: #2563eb;
  border: 1px solid #2563eb30;
}

.message-type.warning-type {
  background: linear-gradient(135deg, #dc262615 0%, #b91c1c15 100%);
  color: #dc2626;
  border: 1px solid #dc262630;
}

.type-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.type-text {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.message-content {
  padding: 1.5rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.content-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.copy-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.content-body {
  background: #111827;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #374151;
}

.message-data {
  margin: 0;
  padding: 1rem;
  color: #f3f4f6;
  font-family: 'SF Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-data .key { color: #60a5fa; }
.message-data .string { color: #f87171; }
.message-data .number { color: #34d399; }
.message-data .boolean { color: #60a5fa; }
.message-data .null { color: #60a5fa; }

/* 数据指标 */
.message-metrics {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.message-item.warning-item .message-metrics {
  background: #fee2e2;
  border-top: 1px solid #fecaca;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.temp-metric {
  border-color: #fca5a5;
  background: #fef2f2;
}

.light-metric {
  border-color: #93c5fd;
  background: #eff6ff;
}

.metric-icon {
  color: #6b7280;
  flex-shrink: 0;
}

.temp-metric .metric-icon {
  color: #dc2626;
}

.light-metric .metric-icon {
  color: #2563eb;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.125rem 0;
  font-size: 0.875rem;
}

.metric-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

/* 复制成功提示 */
.copy-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #059669;
  color: white;
  padding: 0.875rem 1.25rem;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(5, 150, 105, 0.25);
  animation: slideIn 0.2s ease, fadeOut 0.2s ease 1.8s forwards;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.success-icon {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .controls-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .refresh-btn {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .error-state {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }

  .error-content {
    text-align: center;
  }

  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .copy-notification {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
}
</style>
