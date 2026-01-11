<template>
  <div class="camera-monitor">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">视频监控系统</h1>
        <p class="page-subtitle">实时视频流监控与录像管理</p>
      </div>
      <div class="system-time">
        <span class="current-date">{{ currentDate }}</span>
        <span class="current-time">{{ currentTime }}</span>
      </div>
    </div>

    <!-- 摄像头控制 -->
    <div class="control-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">监控控制面板</h2>
          <p class="section-description">摄像头状态管理与参数设置</p>
        </div>
        <div class="control-actions">
          <button @click="refreshStatus" class="refresh-btn" :disabled="loading">
            <svg class="refresh-icon" :class="{ spinning: loading }" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            {{ loading ? '同步中...' : '同步状态' }}
          </button>
        </div>
      </div>

      <div class="camera-controls">
        <!-- 摄像头状态卡片 -->
        <div class="control-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
            <div class="card-title-group">
              <h3 class="card-title">摄像头01</h3>
              <p class="card-subtitle">主监控摄像头</p>
            </div>
          </div>
          <div class="card-content">
            <div class="status-indicator" :class="{ online: cameraStatus.online }">
              <div class="status-dot"></div>
              <span class="status-text">{{ cameraStatus.online ? '在线运行' : '离线' }}</span>
            </div>
            <div class="status-grid">
              <div class="status-item">
                <span class="status-label">IP地址</span>
                <span class="status-value">192.168.1.101</span>
              </div>
              <div class="status-item">
                <span class="status-label">端口</span>
                <span class="status-value">554</span>
              </div>
              <div class="status-item">
                <span class="status-label">分辨率</span>
                <span class="status-value">1920×1080</span>
              </div>
              <div class="status-item">
                <span class="status-label">帧率</span>
                <span class="status-value">30 FPS</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 控制按钮卡片 -->
        <div class="control-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            </div>
            <div class="card-title-group">
              <h3 class="card-title">系统控制</h3>
              <p class="card-subtitle">设备操作与参数调节</p>
            </div>
          </div>
          <div class="card-content">
            <div class="control-buttons">
              <button @click="startCamera" :class="['control-btn', 'start']" :disabled="cameraStatus.active">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8 5v14l11-7z"/>
                </svg>
                启动监控
              </button>

              <button @click="pauseCamera" :class="['control-btn', 'pause']" :disabled="!cameraStatus.active">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                暂停监控
              </button>

              <button @click="toggleRecording" :class="['control-btn', cameraStatus.recording ? 'recording' : 'record']" :disabled="!cameraStatus.active">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <circle v-if="cameraStatus.recording" cx="12" cy="12" r="6" fill="currentColor"/>
                  <circle v-else cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                {{ cameraStatus.recording ? '停止录像' : '开始录像' }}
              </button>

              <button @click="captureSnapshot" class="control-btn snapshot" :disabled="!cameraStatus.active || !showVideoImage">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z"/>
                </svg>
                拍照截图
              </button>
            </div>
          </div>
        </div>

        <!-- 参数设置卡片 -->
        <div class="control-card">
          <div class="card-header">
            <div class="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </div>
            <div class="card-title-group">
              <h3 class="card-title">参数设置</h3>
              <p class="card-subtitle">图像质量与监控参数</p>
            </div>
          </div>
          <div class="card-content">
            <div class="settings-grid">
              <div class="setting-item">
                <label class="setting-label">图像质量</label>
                <select v-model="settings.quality" class="setting-select">
                  <option value="low">低 (720p)</option>
                  <option value="medium">中 (1080p)</option>
                  <option value="high">高 (2K)</option>
                </select>
              </div>
              <div class="setting-item">
                <label class="setting-label">亮度调节</label>
                <div class="setting-slider">
                  <input type="range" min="0" max="100" v-model="settings.brightness" class="slider" />
                  <span class="slider-value">{{ settings.brightness }}%</span>
                </div>
              </div>
              <div class="setting-item">
                <label class="setting-label">对比度</label>
                <div class="setting-slider">
                  <input type="range" min="0" max="100" v-model="settings.contrast" class="slider" />
                  <span class="slider-value">{{ settings.contrast }}%</span>
                </div>
              </div>
            </div>
            <button @click="applySettings" class="apply-btn">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              应用设置
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频监控区域 -->
    <div class="monitor-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">实时监控画面</h2>
          <p class="section-description">摄像头实时视频流预览</p>
        </div>
      </div>

      <div class="video-container">
        <!-- 视频显示区域 -->
        <div class="video-display">
          <div class="video-header">
            <div class="video-info">
              <span class="camera-name">摄像头01 - 主入口</span>
              <span class="video-time">{{ currentTime }}</span>
              <span class="video-status" :class="{ active: cameraStatus.active }">
                {{ cameraStatus.active ? '直播中' : '已停止' }}
              </span>
            </div>
          </div>

          <!-- 视频画面 -->
          <div class="video-frame">
            <!-- 加载状态 -->
            <div v-if="loadingVideo" class="loading-state">
              <div class="loading-spinner">
                <div class="spinner-ring"></div>
              </div>
              <p class="loading-text">正在连接视频流...</p>
              <div class="loading-progress">
                <div class="progress-bar" :style="{ width: loadingProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ loadingProgress }}%</span>
            </div>

            <!-- 延迟后显示图片 -->
            <img
              v-else-if="showVideoImage"
              :src="currentImageUrl"
              alt="监控画面"
              class="video-image"
              :style="{
                filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`
              }"
            />

            <!-- 占位符 -->
            <div v-else class="video-placeholder">
              <div class="placeholder-icon">
                <svg width="64" height="64" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03A3.003 3.003 0 0 1 11 18c-1.66 0-3-1.34-3-3z"/>
                </svg>
              </div>
              <h3 class="placeholder-title" v-if="cameraStatus.active">视频流准备中...</h3>
              <h3 class="placeholder-title" v-else>视频流已停止</h3>
              <p class="placeholder-description" v-if="cameraStatus.active">正在连接摄像头，请稍候...</p>
              <p class="placeholder-description" v-else>点击"启动监控"按钮开始监控</p>
            </div>

            <!-- 视频叠加信息 -->
            <div class="video-overlay">
              <div class="overlay-time">{{ currentTime }}</div>

              <div class="overlay-indicators">
                <div v-if="cameraStatus.recording" class="indicator recording">
                  <div class="indicator-dot"></div>
                  <span class="indicator-text">REC</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 视频控制条 -->
          <div class="video-controls">
            <button @click="startCamera" class="control-btn video" :disabled="cameraStatus.active">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8 5v14l11-7z"/>
              </svg>
              启动监控
            </button>

            <button @click="pauseCamera" class="control-btn pause" :disabled="!cameraStatus.active">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
              暂停监控
            </button>

            <button @click="toggleRecording" :class="['control-btn', cameraStatus.recording ? 'recording' : 'record']" :disabled="!cameraStatus.active || !showVideoImage">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <circle v-if="cameraStatus.recording" cx="12" cy="12" r="6" fill="currentColor"/>
                <circle v-else cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              {{ cameraStatus.recording ? '停止录制' : '开始录制' }}
            </button>

            <button @click="captureSnapshot" class="control-btn snapshot" :disabled="!cameraStatus.active || !showVideoImage">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z"/>
              </svg>
              截图
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 状态变量
const loading = ref(false)
const loadingVideo = ref(false)
const loadingProgress = ref(0)
const showVideoImage = ref(false)
const currentImageIndex = ref(0) // 0: camera1.jpg, 1: camera2.jpg

// 摄像头状态
const cameraStatus = ref({
  online: true,
  active: false,
  recording: false
})

// 系统时间
const currentTime = ref('')
const currentDate = ref('')
let timeInterval: ReturnType<typeof setInterval> | null = null
let videoTimer: ReturnType<typeof setTimeout> | null = null

// 设置参数
const settings = ref({
  quality: 'medium',
  brightness: 50,
  contrast: 50,
  recordMode: 'continuous'
})

// 计算当前图片URL和名称
const currentImageUrl = computed(() => {
  return currentImageIndex.value === 0 ? '/camera1.jpg' : '/camera2.jpg'
})

const currentImageName = computed(() => {
  return currentImageIndex.value === 0 ? 'camera1.jpg' : 'camera2.jpg'
})

// 更新时间
const updateCurrentTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

// 刷新状态
const refreshStatus = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('状态同步完成')
  } finally {
    loading.value = false
  }
}

// 启动摄像头
const startCamera = () => {
  if (!cameraStatus.value.online) return

  console.log('启动摄像头...')
  cameraStatus.value.active = true
  loadingVideo.value = true
  loadingProgress.value = 0
  showVideoImage.value = false

  // 每次启动时切换图片
  currentImageIndex.value = currentImageIndex.value === 0 ? 1 : 0
  console.log('将显示图片:', currentImageName.value)

  // 模拟加载进度
  const progressInterval = setInterval(() => {
    loadingProgress.value += 10
    console.log('加载进度:', loadingProgress.value + '%')

    if (loadingProgress.value >= 100) {
      clearInterval(progressInterval)

      // 延迟3秒后显示图片
      console.log('开始3秒延迟...')
      videoTimer = setTimeout(() => {
        loadingVideo.value = false
        showVideoImage.value = true
        console.log('3秒延迟结束，显示图片:', currentImageName.value)
      }, 3000)
    }
  }, 200)
}

// 暂停摄像头
const pauseCamera = () => {
  console.log('暂停摄像头')
  cameraStatus.value.active = false
  cameraStatus.value.recording = false
  showVideoImage.value = false
  loadingVideo.value = false

  // 清除定时器
  if (videoTimer) {
    clearTimeout(videoTimer)
    videoTimer = null
  }

  // 重置加载状态
  loadingProgress.value = 0
}

// 切换录制状态
const toggleRecording = () => {
  if (!cameraStatus.value.active || !showVideoImage.value) return

  cameraStatus.value.recording = !cameraStatus.value.recording
  console.log(cameraStatus.value.recording ? '开始录像' : '停止录像')
}

// 截图功能
const captureSnapshot = () => {
  if (!cameraStatus.value.active || !showVideoImage.value) return

  console.log('截图保存:', currentImageName.value)
  alert(`截图已保存到本地 (${currentImageName.value})`)
}

// 设置应用
const applySettings = () => {
  console.log('应用设置:', settings.value)
  alert('设置已应用成功')
}

// 初始化
onMounted(() => {
  updateCurrentTime()
  timeInterval = setInterval(updateCurrentTime, 1000)

  console.log('页面初始化完成')
  console.log('请确保 public 目录下有 camera1.jpg 和 camera2.jpg 图片')
})

// 清理
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  if (videoTimer) {
    clearTimeout(videoTimer)
  }
})
</script>

<style scoped>
/* 全局样式 */
.camera-monitor {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 1.75rem;
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

.system-time {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.current-date {
  font-size: 0.875rem;
  color: #2563eb;
  font-weight: 500;
}

.current-time {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  font-family: 'SF Mono', 'Courier New', monospace;
}

/* 控制区域 */
.control-section {
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

.control-actions {
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

/* 摄像头控制卡片 */
.camera-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.control-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.control-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.control-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.control-card:nth-child(1)::before {
  background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
}

.control-card:nth-child(2)::before {
  background: linear-gradient(90deg, #059669 0%, #047857 100%);
}

.control-card:nth-child(3)::before {
  background: linear-gradient(90deg, #7c3aed 0%, #5b21b6 100%);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.control-card:nth-child(1) .card-icon {
  background: linear-gradient(135deg, #2563eb15 0%, #1e40af15 100%);
  color: #2563eb;
  border: 1px solid #2563eb20;
}

.control-card:nth-child(2) .card-icon {
  background: linear-gradient(135deg, #05966915 0%, #04785715 100%);
  color: #059669;
  border: 1px solid #05966920;
}

.control-card:nth-child(3) .card-icon {
  background: linear-gradient(135deg, #7c3aed15 0%, #5b21b615 100%);
  color: #7c3aed;
  border: 1px solid #7c3aed20;
}

.card-title-group {
  flex: 1;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.status-indicator.online {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
}

.status-indicator.online .status-dot {
  background: #059669;
  animation: pulse 2s infinite;
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

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.status-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  font-family: 'SF Mono', 'Courier New', monospace;
}

.control-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  text-align: center;
}

.control-btn.start {
  background: #2563eb;
  color: white;
}

.control-btn.start:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.control-btn.start:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.control-btn.pause {
  background: #f59e0b;
  color: white;
}

.control-btn.pause:hover:not(:disabled) {
  background: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
}

.control-btn.pause:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.control-btn.record {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.control-btn.record:hover:not(:disabled) {
  background: #e5e7eb;
  color: #dc2626;
  border-color: #dc2626;
}

.control-btn.record:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.control-btn.recording {
  background: #dc2626;
  color: white;
}

.control-btn.recording:hover:not(:disabled) {
  background: #b91c1c;
}

.control-btn.snapshot {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.control-btn.snapshot:hover:not(:disabled) {
  background: #e5e7eb;
  color: #2563eb;
  border-color: #2563eb;
}

.control-btn.snapshot:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.current-image-info {
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #4b5563;
  text-align: center;
  font-weight: 500;
}

.settings-grid {
  display: grid;
  gap: 1rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.setting-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  color: #111827;
  cursor: pointer;
}

.setting-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.setting-slider {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #e5e7eb;
  border-radius: 2px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
}

.slider-value {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

.apply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  margin-top: 1rem;
  width: 100%;
}

.apply-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

/* 视频监控区域 */
.monitor-section {
  margin-bottom: 2.5rem;
}

.video-container {
  background: #111827;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #374151;
  min-height: 500px;
}

.video-display {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #374151;
}

.video-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.camera-name {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.video-time {
  color: #9ca3af;
  font-size: 0.75rem;
  font-family: 'SF Mono', 'Courier New', monospace;
}

.video-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.video-status.active {
  background: linear-gradient(135deg, #05966920 0%, #04785720 100%);
  color: #059669;
  border: 1px solid #05966930;
}

.video-status:not(.active) {
  background: linear-gradient(135deg, #6b728020 0%, #4b556320 100%);
  color: #9ca3af;
  border: 1px solid #6b728030;
}

.video-frame {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #1f2937;
}

/* 加载状态 - 现在在视频框内 */
.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(31, 41, 55, 0.9);
  color: #9ca3af;
  text-align: center;
  z-index: 10;
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

.loading-text {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: #374151;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: 'SF Mono', 'Courier New', monospace;
}

.video-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.placeholder-icon {
  color: #374151;
  margin-bottom: 1rem;
}

.placeholder-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #9ca3af;
  margin: 0 0 0.5rem 0;
}

.placeholder-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 5;
}

.overlay-time {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  padding: 0.375rem 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  font-size: 0.75rem;
  color: white;
  font-family: 'SF Mono', 'Courier New', monospace;
}

.overlay-indicators {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  font-size: 0.75rem;
  color: white;
}

.indicator.recording {
  background: rgba(220, 38, 38, 0.7);
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.indicator.recording .indicator-dot {
  animation: pulse 1s infinite;
}

.video-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid #374151;
  gap: 1rem;
}

.control-btn.video {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn.video:hover:not(:disabled) {
  background: #1d4ed8;
}

.control-btn.video:disabled {
  background: #6b7280;
  cursor: not-allowed;
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .system-time {
    text-align: left;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .refresh-btn {
    width: 100%;
  }

  .camera-controls {
    grid-template-columns: 1fr;
  }

  .video-controls {
    flex-wrap: wrap;
  }

  .control-btn {
    flex: 1;
    min-width: 120px;
  }
}
</style>
