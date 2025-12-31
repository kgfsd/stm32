<template>
  <div class="device-control">
    <div class="page-header">
      <h2>设备控制</h2>
      <p>查看和管理IoT设备信息</p>
    </div>

    <div class="control-section">
      <div class="section-header">
        <h3>设备信息</h3>
        <button @click="refreshDeviceInfo" class="refresh-btn" :disabled="loading">
          <span class="btn-icon">🔄</span>
          {{ loading ? '刷新中...' : '刷新' }}
        </button>
      </div>

      <div class="device-info-card" v-if="deviceInfo">
        <div class="info-grid">
          <div class="info-item" v-for="(value, key) in displayDeviceInfo" :key="key">
            <label>{{ formatLabel(key) }}</label>
            <div class="info-value">{{ formatValue(value) }}</div>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else-if="!loading">
        <div class="empty-icon">📱</div>
        <h3>暂无设备信息</h3>
        <p>点击刷新按钮获取设备信息</p>
      </div>

      <div class="loading-state" v-if="loading">
        <div class="spinner"></div>
        <p>正在加载设备信息...</p>
      </div>
    </div>

    <div class="control-section" v-if="error">
      <div class="error-card">
        <div class="error-icon">⚠️</div>
        <div class="error-content">
          <h3>连接错误</h3>
          <p>{{ error }}</p>
          <button @click="refreshDeviceInfo" class="retry-btn">重试</button>
        </div>
      </div>
    </div>

    <div class="control-section">
      <h3>设备操作</h3>
      <div class="operation-buttons">
        <button @click="showDeviceShadow" class="operation-btn shadow-btn">
          <span class="btn-icon">👤</span>
          查看设备影子
        </button>
        <router-link to="/command" class="operation-btn command-btn">
          <span class="btn-icon">⚡</span>
          发送命令
        </router-link>
      </div>
    </div>

    <!-- 设备影子模态框 -->
    <div v-if="showShadowModal" class="modal-overlay" @click="closeShadowModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>设备影子信息</h3>
          <button @click="closeShadowModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div v-if="shadowLoading" class="loading-state">
            <div class="spinner"></div>
            <p>正在加载设备影子...</p>
          </div>
          <div v-else-if="shadowInfo" class="shadow-content">
            <pre>{{ JSON.stringify(shadowInfo, null, 2) }}</pre>
          </div>
          <div v-else class="empty-state">
            <p>暂无设备影子信息</p>
          </div>
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
  'create_time': '创建时间',
  'product_name': '产品名称',
  'device_id': '设备ID',
  'device_name': '设备名称',
  'status': '设备状态',
  'description': '描述',
  'connection_status_update_time': '最后在线时间',
  'app_name': '应用名称',
}

const displayDeviceInfo = computed(() => {
  if (!deviceInfo.value) return {}
  
  // 按照 labelMap 的顺序获取属性
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
  if (value === null || value === undefined) return '未知'
  if (typeof value === 'boolean') return value ? '是' : '否'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
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

.control-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

.device-info-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  color: #2d3748;
  word-break: break-all;
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

.operation-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.operation-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.shadow-btn {
  background: #48bb78;
  color: white;
}

.shadow-btn:hover {
  background: #38a169;
  transform: translateY(-2px);
}

.property-btn {
  background: #ed8936;
  color: white;
}

.property-btn:hover {
  background: #dd6b20;
  transform: translateY(-2px);
}

.command-btn {
  background: #667eea;
  color: white;
}

.command-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 模态框样式 */
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.shadow-content pre {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .operation-buttons {
    flex-direction: column;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}
</style>