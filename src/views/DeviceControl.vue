<template>
  <div class="device-control">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">设备管理控制台</h1>
        <p class="page-subtitle">设备状态监控与配置管理</p>
      </div>
    </div>

    <!-- 设备信息卡片 -->
    <div class="device-info-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">设备基本信息</h2>
          <p class="section-description">查看设备详细配置与运行状态</p>
        </div>
        <button @click="refreshDeviceInfo" class="refresh-btn" :disabled="loading">
          <svg class="refresh-icon" :class="{ spinning: loading }" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          {{ loading ? '同步中...' : '同步信息' }}
        </button>
      </div>

      <!-- 设备信息展示 -->
      <div v-if="deviceInfo" class="device-card">
        <div class="card-header">
          <div class="device-icon">
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
            </svg>
          </div>
          <div class="device-header-content">
            <h3 class="device-name">{{ deviceInfo.device_name || '未命名设备' }}</h3>
            <div class="device-status" :class="{ online: deviceInfo.status === 'active', offline: deviceInfo.status !== 'active' }">
              <div class="status-indicator"></div>
              <span class="status-text">{{ deviceInfo.status === 'active' ? '在线运行' : '离线' }}</span>
            </div>
          </div>
        </div>

        <div class="info-divider"></div>

        <div class="device-info-grid">
          <div v-for="(value, key) in displayDeviceInfo" :key="key" class="info-item">
            <div class="info-label">
              <span class="label-text">{{ formatLabel(key) }}</span>
            </div>
            <div class="info-value">{{ formatValue(value) }}</div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">正在获取设备信息...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!deviceInfo && !error" class="empty-state">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 12c0-2.54-1.19-4.81-3.04-6.27L16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"/>
          </svg>
        </div>
        <h3 class="empty-title">未检测到设备信息</h3>
        <p class="empty-description">点击同步按钮获取设备配置信息</p>
        <button @click="refreshDeviceInfo" class="empty-action-btn">
          同步设备信息
        </button>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-section">
      <div class="error-card">
        <div class="error-icon">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <div class="error-content">
          <h3 class="error-title">设备连接异常</h3>
          <p class="error-description">{{ error }}</p>
          <div class="error-actions">
            <button @click="refreshDeviceInfo" class="retry-btn">重新连接</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 设备操作区域 -->
    <div class="operations-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">设备操作</h2>
          <p class="section-description">设备管理与监控功能</p>
        </div>
      </div>

      <div class="operations-grid">
        <button @click="showDeviceShadow" class="operation-card">
          <div class="operation-icon shadow-icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div class="operation-content">
            <h3 class="operation-title">设备影子</h3>
            <p class="operation-description">查看设备最新状态信息</p>
          </div>
          <div class="operation-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </button>

        <router-link to="/command" class="operation-card">
          <div class="operation-icon command-icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
          <div class="operation-content">
            <h3 class="operation-title">设备控制</h3>
            <p class="operation-description">发送控制指令与参数设置</p>
          </div>
          <div class="operation-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </router-link>

        <router-link to="/message" class="operation-card">
          <div class="operation-icon message-icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
            </svg>
          </div>
          <div class="operation-content">
            <h3 class="operation-title">通信日志</h3>
            <p class="operation-description">查看设备通信历史记录</p>
          </div>
          <div class="operation-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 设备影子模态框 -->
    <div v-if="showShadowModal" class="modal-overlay" @click.self="closeShadowModal">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title-group">
            <h2 class="modal-title">设备影子信息</h2>
            <p class="modal-subtitle">设备最新运行状态与配置</p>
          </div>
          <button @click="closeShadowModal" class="modal-close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div class="modal-content">
          <div v-if="shadowLoading" class="modal-loading">
            <div class="loading-spinner">
              <div class="spinner-ring"></div>
            </div>
            <p>正在获取设备影子信息...</p>
          </div>

          <div v-else-if="shadowInfo" class="shadow-content">
            <div class="code-container">
              <pre class="code-content">{{ JSON.stringify(shadowInfo, null, 2) }}</pre>
            </div>
          </div>

          <div v-else class="modal-empty">
            <div class="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <h3>未获取到影子信息</h3>
            <p>设备暂未报告状态信息</p>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeShadowModal" class="modal-action-btn secondary">
            关闭
          </button>
          <button @click="refreshDeviceInfo" class="modal-action-btn primary">
            刷新数据
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { deviceAPI } from '../services/api'

const deviceInfo = ref<Record<string, any> | null>(null)
const shadowInfo = ref(null)
const loading = ref(false)
const shadowLoading = ref(false)
const error = ref('')
const showShadowModal = ref(false)

const labelMap: { [key: string]: string } = {
  'device_name': '设备名称',
  'device_id': '设备标识',
  'product_name': '产品型号',
  'status': '连接状态',
  'create_time': '创建时间',
  'connection_status_update_time': '最后在线时间',
  'description': '设备描述',
  'app_name': '所属应用'
}

const displayDeviceInfo = computed(() => {
  if (!deviceInfo.value) return {}

  const orderedInfo: any = {}
  for (const key in labelMap) {
    if (key in deviceInfo.value) {
      orderedInfo[key] = deviceInfo.value[key]
    }
  }

  return orderedInfo
})

const formatLabel = (key: string | number) => {
  const keyStr = String(key)
  return labelMap[keyStr] || keyStr.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatValue = (value: any) => {
  if (value === null || value === undefined) return '未设置'
  if (typeof value === 'boolean') return value ? '是' : '否'
  if (typeof value === 'object') return JSON.stringify(value)

  // 格式化时间
  if (keyIsTime(String(value))) {
    return formatDateTime(value)
  }

  return String(value)
}

const keyIsTime = (key: string) => {
  return key.includes('time') || key.includes('Time') || key.includes('date') || key.includes('Date')
}

const formatDateTime = (value: string) => {
  try {
    const date = new Date(value)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  } catch (error) {
    return value
  }
}

const refreshDeviceInfo = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await deviceAPI.showDevice()
    if (response.data.success) {
      deviceInfo.value = response.data.data
    } else {
      error.value = response.data.message || '获取设备信息失败'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || '网络连接失败，请检查后端服务是否启动'
    console.error('获取设备信息失败:', err)
  } finally {
    loading.value = false
  }
}

const showDeviceShadow = async () => {
  showShadowModal.value = true
  shadowLoading.value = true

  try {
    const response = await deviceAPI.showDeviceShadow()
    if (response.data.success) {
      shadowInfo.value = response.data.data
    }
  } catch (err: any) {
    console.error('获取设备影子失败:', err)
    shadowInfo.value = null
  } finally {
    shadowLoading.value = false
  }
}

const closeShadowModal = () => {
  showShadowModal.value = false
  shadowInfo.value = null
}

onMounted(() => {
  refreshDeviceInfo()
})
</script>

<style scoped>
.device-control {
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

/* 设备信息区域 */
.device-info-section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title-group {
  flex: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.section-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
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

/* 设备卡片 */
.device-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.device-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2563eb15 0%, #1e40af15 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  border: 1px solid #2563eb20;
  flex-shrink: 0;
}

.device-header-content {
  flex: 1;
}

.device-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
}

.device-status.online .status-indicator {
  background: #059669;
  animation: pulse 2s infinite;
}

.device-status.offline .status-indicator {
  background: #dc2626;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.device-status.online .status-text {
  color: #059669;
}

.device-status.offline .status-text {
  color: #dc2626;
}

.info-divider {
  height: 1px;
  background: linear-gradient(90deg, #e5e7eb 0%, transparent 100%);
  margin: 1.5rem 0 2rem;
}

/* 设备信息网格 */
.device-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.label-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 6px;
  font-family: 'SF Mono', 'Courier New', monospace;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5;
  word-break: break-all;
  border: 1px solid #e5e7eb;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
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

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  background: #ffffff;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0 0.5rem 0;
}

.empty-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.empty-action-btn {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.empty-action-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

/* 错误状态 */
.error-section {
  margin-bottom: 2.5rem;
}

.error-card {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.error-icon {
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 2px;
}

.error-content {
  flex: 1;
}

.error-title {
  font-size: 1rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 0.5rem 0;
}

.error-description {
  color: #991b1b;
  margin: 0 0 1.25rem 0;
  line-height: 1.5;
  font-size: 0.875rem;
}

.error-actions {
  display: flex;
  gap: 0.75rem;
}

.retry-btn {
  padding: 0.625rem 1.25rem;
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

/* 操作区域 */
.operations-section {
  margin-bottom: 3rem;
}

.operations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.operation-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: left;
}

.operation-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  transform: translateY(-2px);
}

.operation-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.shadow-icon {
  background: linear-gradient(135deg, #2563eb15 0%, #1e40af15 100%);
  color: #2563eb;
  border: 1px solid #2563eb20;
}

.command-icon {
  background: linear-gradient(135deg, #05966915 0%, #04785715 100%);
  color: #059669;
  border: 1px solid #05966920;
}

.message-icon {
  background: linear-gradient(135deg, #dc262615 0%, #b91c1c15 100%);
  color: #dc2626;
  border: 1px solid #dc262620;
}

.operation-content {
  flex: 1;
}

.operation-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.operation-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.operation-arrow {
  color: #9ca3af;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.operation-card:hover .operation-arrow {
  color: #2563eb;
  transform: translateX(4px);
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: #ffffff;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.2s ease;
  border: 1px solid #e1e4e8;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e1e4e8;
  background: #f9fafb;
  border-radius: 8px 8px 0 0;
}

.modal-title-group {
  flex: 1;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-content {
  flex: 1;
  overflow: auto;
  padding: 2rem;
}

.modal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
}

.modal-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
}

.modal-empty .empty-icon {
  color: #d1d5db;
  margin-bottom: 1.5rem;
}

.modal-empty h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0 0.5rem 0;
}

.modal-empty p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.shadow-content {
  height: 100%;
}

.code-container {
  background: #111827;
  border-radius: 6px;
  padding: 1.5rem;
  overflow: auto;
  border: 1px solid #374151;
}

.code-content {
  color: #f3f4f6;
  font-family: 'SF Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.code-content .key { color: #60a5fa; }
.code-content .string { color: #f87171; }
.code-content .number { color: #34d399; }
.code-content .boolean { color: #60a5fa; }
.code-content .null { color: #60a5fa; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  border-top: 1px solid #e1e4e8;
  background: #f9fafb;
  border-radius: 0 0 8px 8px;
}

.modal-action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.modal-action-btn.secondary {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.modal-action-btn.secondary:hover {
  background: #e5e7eb;
}

.modal-action-btn.primary {
  background: #2563eb;
  color: white;
  border: 1px solid #2563eb;
}

.modal-action-btn.primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .refresh-btn {
    width: 100%;
  }

  .device-info-grid {
    grid-template-columns: 1fr;
  }

  .error-actions {
    flex-direction: column;
  }

  .retry-btn {
    width: 100%;
  }

  .operations-grid {
    grid-template-columns: 1fr;
  }

  .modal-container {
    width: 95%;
    margin: 1rem;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 1.25rem;
  }
}
</style>
