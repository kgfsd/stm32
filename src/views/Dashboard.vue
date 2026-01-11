<template>
  <div class="dashboard">
    <!-- 顶部欢迎区域 -->
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1 class="welcome-title">系统控制台</h1>
        <p class="welcome-subtitle">设备监控与管理系统</p>
      </div>
      <div class="time-display">
        <span class="current-date">{{ currentDate }}</span>
        <span class="current-time">{{ currentTime }}</span>
      </div>
    </div>

    <!-- 状态概览 -->
    <div class="overview-section">
      <h2 class="section-title">系统概览</h2>
      <p class="section-description">核心系统状态与运行指标</p>

      <div class="status-grid">
        <div class="status-card">
          <div class="status-header">
            <div class="status-icon system-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div class="status-badge" :class="{ healthy: systemStatus.healthy, error: !systemStatus.healthy }">
              {{ systemStatus.healthy ? '正常' : '异常' }}
            </div>
          </div>
          <div class="status-content">
            <h3 class="status-title">系统运行状态</h3>
            <p class="status-value">{{ systemStatus.message }}</p>
          </div>
        </div>

        <div class="status-card">
          <div class="status-header">
            <div class="status-icon device-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm16 14H5V5h14v14zM7 10h10v2H7z"/>
              </svg>
            </div>
            <div class="status-badge online">
              在线
            </div>
          </div>
          <div class="status-content">
            <h3 class="status-title">设备连接</h3>
            <p class="status-value">{{ deviceCount }} 台</p>
          </div>
        </div>

        <div class="status-card">
          <div class="status-header">
            <div class="status-icon message-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
              </svg>
            </div>
            <div class="status-badge active">
              活跃
            </div>
          </div>
          <div class="status-content">
            <h3 class="status-title">消息统计</h3>
            <p class="status-value">{{ messageCount }} 条</p>
          </div>
        </div>

        <!-- 新增摄像头状态卡片 -->
        <div class="status-card">
          <div class="status-header">
            <div class="status-icon camera-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
            <div class="status-badge" :class="{ online: cameraStatus.online, offline: !cameraStatus.online }">
              {{ cameraStatus.online ? '在线' : '离线' }}
            </div>
          </div>
          <div class="status-content">
            <h3 class="status-title">视频监控</h3>
            <p class="status-value">{{ cameraStatus.streaming ? '运行中' : '待机中' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="operations-section">
      <h2 class="section-title">快速操作</h2>
      <p class="section-description">常用功能快捷入口</p>

      <div class="operations-grid">
        <router-link to="/device" class="operation-card">
          <div class="operation-icon device-icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div class="operation-content">
            <h3 class="operation-title">设备管理</h3>
            <p class="operation-description">查看设备信息与配置</p>
          </div>
        </router-link>

        <router-link to="/command" class="operation-card">
          <div class="operation-icon command-icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
          <div class="operation-content">
            <h3 class="operation-title">设备控制</h3>
            <p class="operation-description">发送控制指令与设置</p>
          </div>
        </router-link>

        <router-link to="/camera" class="operation-card">
          <div class="operation-icon camera-icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </div>
          <div class="operation-content">
            <h3 class="operation-title">视频监控</h3>
            <p class="operation-description">实时视频监控与录像</p>
          </div>
        </router-link>

        <router-link to="/message" class="operation-card">
          <div class="operation-icon message-icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
            </svg>
          </div>
          <div class="operation-content">
            <h3 class="operation-title">通信日志</h3>
            <p class="operation-description">查看历史通信记录</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 数据监控 -->
    <div class="monitoring-section">
      <div class="monitoring-header">
        <div class="header-content">
          <h2 class="section-title">数据监控</h2>
          <p class="section-description">设备运行数据趋势分析</p>
        </div>
        <button @click="refreshAllCharts" class="monitoring-btn" :disabled="loading">
          <svg class="btn-icon" :class="{ spinning: loading }" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          更新数据
        </button>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">温度趋势图</h3>
              <p class="chart-subtitle">设备环境温度变化</p>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color temp-color"></div>
                <span class="legend-label">温度 (°C)</span>
              </div>
            </div>
          </div>
          <div class="chart-container" ref="chartRef"></div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-group">
              <h3 class="chart-title">光照强度图</h3>
              <p class="chart-subtitle">设备环境光照变化</p>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color light-color"></div>
                <span class="legend-label">光照 (Lux)</span>
              </div>
            </div>
          </div>
          <div class="chart-container" ref="lightChartRef"></div>
        </div>
      </div>
    </div>

    <!-- 新增：摄像头实时监控预览 -->
    <div class="camera-preview-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">实时监控预览</h2>
          <p class="section-description">摄像头实时画面监控</p>
        </div>
        <router-link to="/camera" class="view-all-btn">
          <span>查看更多</span>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </router-link>
      </div>

      <div class="camera-preview-grid">
        <div class="camera-preview-card">
          <div class="camera-header">
            <div class="camera-info">
              <div class="camera-name">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
                <span>摄像头 01</span>
              </div>
              <div class="camera-status" :class="{ online: cameraStatus.online, offline: !cameraStatus.online }">
                {{ cameraStatus.online ? '在线' : '离线' }}
              </div>
            </div>
            <div class="camera-time">{{ currentTime }}</div>
          </div>

          <div class="camera-content">
            <div class="camera-placeholder" v-if="!cameraStatus.streaming">
              <div class="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03A3.003 3.003 0 0 1 11 18c-1.66 0-3-1.34-3-3z"/>
                </svg>
              </div>
              <p class="placeholder-text">视频流未启动</p>
            </div>

            <div class="camera-frame" v-else>
              <div class="frame-overlay">
                <div class="overlay-grid">
                  <div class="grid-line"></div>
                  <div class="grid-line"></div>
                  <div class="grid-line"></div>
                  <div class="grid-line"></div>
                </div>
                <div class="overlay-indicators">
                  <div class="indicator recording" v-if="cameraStatus.recording">
                    <div class="indicator-dot"></div>
                    <span class="indicator-text">录制中</span>
                  </div>
                  <div class="indicator streaming">
                    <div class="indicator-dot"></div>
                    <span class="indicator-text">直播中</span>
                  </div>
                </div>
                <div class="overlay-time">{{ currentTimestamp }}</div>
              </div>
            </div>
          </div>

          <div class="camera-controls">
            <button @click="toggleCameraStream" :class="['control-btn', cameraStatus.streaming ? 'stop' : 'start']" :disabled="!cameraStatus.online">
              <svg :width="cameraStatus.streaming ? '12' : '14'" :height="cameraStatus.streaming ? '12' : '14'" viewBox="0 0 24 24">
                <path v-if="!cameraStatus.streaming" fill="currentColor" d="M8 5v14l11-7z"/>
                <path v-else fill="currentColor" d="M6 6h12v12H6z"/>
              </svg>
              {{ cameraStatus.streaming ? '停止' : '启动' }}
            </button>

            <button @click="toggleRecording" :class="['control-btn', cameraStatus.recording ? 'recording' : 'record']" :disabled="!cameraStatus.online || !cameraStatus.streaming">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <circle v-if="cameraStatus.recording" cx="12" cy="12" r="6" fill="currentColor"/>
                <circle v-else cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              {{ cameraStatus.recording ? '录制中' : '录制' }}
            </button>

            <button @click="captureSnapshot" class="control-btn snapshot" :disabled="!cameraStatus.online || !cameraStatus.streaming">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z"/>
              </svg>
              截图
            </button>

            <div class="camera-stats">
              <div class="stat-item">
                <span class="stat-label">延迟</span>
                <span class="stat-value">{{ cameraStatus.latency || '--' }}ms</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">帧率</span>
                <span class="stat-value">30fps</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 可以添加更多摄像头预览卡片 -->
        <div class="camera-preview-card add-camera">
          <div class="add-camera-content">
            <svg width="48" height="48" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <p class="add-camera-text">添加摄像头</p>
            <button class="add-camera-btn">配置</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { deviceAPI } from '../services/api'
import * as echarts from 'echarts'

const router = useRouter()
const chartRef = ref<HTMLDivElement>()
const lightChartRef = ref<HTMLDivElement>()
const loading = ref(false)
const temperatureData = ref<any[]>([])
const lightData = ref<any[]>([])

const systemStatus = ref({ healthy: false, message: '状态检测中...' })
const deviceCount = ref(0)
const messageCount = ref(0)
const currentTime = ref('')
const currentDate = ref('')
const currentTimestamp = ref('')

// 摄像头状态
const cameraStatus = ref({
  online: true,
  streaming: false,
  recording: false,
  latency: 120
})

// 时间更新定时器引用
let timeInterval: ReturnType<typeof setInterval> | null = null

const checkSystemHealth = async () => {
  try {
    const response = await deviceAPI.healthCheck()
    systemStatus.value = {
      healthy: response.data.success,
      message: response.data.message
    }
  } catch (error) {
    systemStatus.value = {
      healthy: false,
      message: '系统连接失败'
    }
  }
}

const loadDashboardData = async () => {
  try {
    const deviceResponse = await deviceAPI.showDevice()
    if (deviceResponse.data.success) {
      deviceCount.value = 1
    }

    const messagesResponse = await deviceAPI.getHistoricalMessages()
    if (messagesResponse.data.success && messagesResponse.data.data) {
      messageCount.value = Array.isArray(messagesResponse.data.data) ?
        messagesResponse.data.data.length : 0
    }
  } catch (error) {
    console.error('加载仪表板数据失败:', error)
  }
}

const initChart = () => {
  if (!chartRef.value) return

  const chart = echarts.init(chartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#d1d5db',
      borderWidth: 1,
      textStyle: {
        color: '#1f2937',
        fontSize: 12
      },
      formatter: (params: any) => {
        const data = params[0]
        return `
          <div style="font-weight: 600; margin-bottom: 8px; color: #111827;">${data.name}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; background: #dc2626; border-radius: 50%;"></div>
            <span style="color: #4b5563;">温度: <b style="color: #111827;">${data.value}°C</b></span>
          </div>
        `
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      top: '12%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: temperatureData.value.map(item => convertToBeijingTime(item.event_time)),
      axisLine: {
        lineStyle: {
          color: '#d1d5db'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 11,
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '温度 (°C)',
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 11,
        padding: [0, 0, 0, 10]
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 11,
        formatter: '{value}°C'
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          type: 'solid'
        }
      }
    },
    series: [{
      name: '温度',
      type: 'line',
      data: temperatureData.value.map(item => item.temp),
      smooth: false,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: {
        width: 2,
        color: '#dc2626'
      },
      itemStyle: {
        color: '#dc2626',
        borderWidth: 1,
        borderColor: '#ffffff'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(220, 38, 38, 0.1)' },
          { offset: 1, color: 'rgba(220, 38, 38, 0)' }
        ])
      }
    }]
  }

  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

const initLightChart = () => {
  if (!lightChartRef.value) return

  const chart = echarts.init(lightChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#d1d5db',
      borderWidth: 1,
      textStyle: {
        color: '#1f2937',
        fontSize: 12
      },
      formatter: (params: any) => {
        const data = params[0]
        return `
          <div style="font-weight: 600; margin-bottom: 8px; color: #111827;">${data.name}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; background: #2563eb; border-radius: 50%;"></div>
            <span style="color: #4b5563;">光照: <b style="color: #111827;">${data.value} Lux</b></span>
          </div>
        `
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      top: '12%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: lightData.value.map(item => convertToBeijingTime(item.event_time)),
      axisLine: {
        lineStyle: {
          color: '#d1d5db'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 11,
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '光照 (Lux)',
      nameTextStyle: {
        color: '#6b7280',
        fontSize: 11,
        padding: [0, 0, 0, 10]
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 11,
        formatter: '{value}'
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          type: 'solid'
        }
      }
    },
    series: [{
      name: '光照',
      type: 'line',
      data: lightData.value.map(item => item.light),
      smooth: false,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: {
        width: 2,
        color: '#2563eb'
      },
      itemStyle: {
        color: '#2563eb',
        borderWidth: 1,
        borderColor: '#ffffff'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(37, 99, 235, 0.1)' },
          { offset: 1, color: 'rgba(37, 99, 235, 0)' }
        ])
      }
    }]
  }

  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

const refreshAllCharts = async () => {
  loading.value = true
  try {
    await refreshTemperatureData()
    await refreshLightData()
  } finally {
    loading.value = false
  }
}

const refreshTemperatureData = async () => {
  try {
    const response = await deviceAPI.getHistoricalTemperatureData()
    if (response.data.success) {
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data]

      temperatureData.value = data.map((item: any) => ({
        temp: parseFloat(item.temp),
        time: item.time,
        event_time: item.event_time
      }))
      initChart()
    }
  } catch (error) {
    console.error('获取历史温度数据失败:', error)
  }
}

const refreshLightData = async () => {
  try {
    const response = await deviceAPI.getHistoricalLsensData()
    if (response.data.success) {
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data]

      lightData.value = data.map((item: any) => ({
        light: parseFloat(item.lsens),
        time: item.time,
        event_time: item.event_time
      }))
      initLightChart()
    }
  } catch (error) {
    console.error('获取历史光照数据失败:', error)
  }
}

const convertToBeijingTime = (utcTime: string) => {
  if (!utcTime) return ''

  const dateStr = utcTime.replace('T', ' ').replace('Z', '')
  const year = parseInt(dateStr.substring(0, 4))
  const month = parseInt(dateStr.substring(4, 6)) - 1
  const day = parseInt(dateStr.substring(6, 8))
  const hour = parseInt(dateStr.substring(8, 10))
  const minute = parseInt(dateStr.substring(10, 12))
  const second = parseInt(dateStr.substring(12, 14))

  const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second))
  const beijingTime = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000)

  return beijingTime.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

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
  currentTimestamp.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

// 摄像头控制方法
const toggleCameraStream = async () => {
  try {
    if (!cameraStatus.value.online) return

    if (cameraStatus.value.streaming) {
      // 停止视频流
      cameraStatus.value = {
        ...cameraStatus.value,
        streaming: false,
        recording: false
      }
    } else {
      // 启动视频流
      cameraStatus.value = {
        ...cameraStatus.value,
        streaming: true,
        latency: Math.floor(Math.random() * 100) + 50
      }
    }
  } catch (err: any) {
    console.error('摄像头控制失败:', err)
  }
}

const toggleRecording = async () => {
  try {
    if (!cameraStatus.value.online || !cameraStatus.value.streaming) return

    if (cameraStatus.value.recording) {
      // 停止录像
      cameraStatus.value = {
        ...cameraStatus.value,
        recording: false
      }
    } else {
      // 开始录像
      cameraStatus.value = {
        ...cameraStatus.value,
        recording: true
      }
    }
  } catch (err: any) {
    console.error('录像控制失败:', err)
  }
}

const captureSnapshot = () => {
  if (!cameraStatus.value.online || !cameraStatus.value.streaming) return

  // 这里可以添加截图逻辑
  console.log('截图保存')
  alert('截图已保存')
}

const refreshCameraStatus = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    cameraStatus.value = {
      ...cameraStatus.value,
      online: true,
      latency: Math.floor(Math.random() * 100) + 50
    }
  } catch (err: any) {
    console.error('刷新摄像头状态失败:', err)
  }
}

// 生命周期
onMounted(() => {
  updateCurrentTime()
  timeInterval = setInterval(updateCurrentTime, 1000)
  checkSystemHealth()
  loadDashboardData()
  refreshAllCharts()
  refreshCameraStatus()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
})
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
}

/* 页面标题 */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e1e4e8;
}

.welcome-section {
  flex: 1;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.welcome-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

.time-display {
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

/* 概览区域 */
.overview-section {
  margin-bottom: 2.5rem;
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
  margin: 0 0 1.5rem 0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.status-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.status-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.system-icon {
  background: linear-gradient(135deg, #05966915 0%, #04785715 100%);
  color: #059669;
  border: 1px solid #05966920;
}

.device-icon {
  background: linear-gradient(135deg, #2563eb15 0%, #1e40af15 100%);
  color: #2563eb;
  border: 1px solid #2563eb20;
}

.message-icon {
  background: linear-gradient(135deg, #dc262615 0%, #b91c1c15 100%);
  color: #dc2626;
  border: 1px solid #dc262620;
}

.camera-icon {
  background: linear-gradient(135deg, #7c3aed15 0%, #5b21b615 100%);
  color: #7c3aed;
  border: 1px solid #7c3aed20;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-badge.healthy {
  background: linear-gradient(135deg, #05966915 0%, #04785715 100%);
  color: #059669;
  border: 1px solid #05966930;
}

.status-badge.error {
  background: linear-gradient(135deg, #dc262615 0%, #b91c1c15 100%);
  color: #dc2626;
  border: 1px solid #dc262630;
}

.status-badge.online {
  background: linear-gradient(135deg, #2563eb15 0%, #1e40af15 100%);
  color: #2563eb;
  border: 1px solid #2563eb30;
}

.status-badge.active {
  background: linear-gradient(135deg, #7c3aed15 0%, #5b21b615 100%);
  color: #7c3aed;
  border: 1px solid #7c3aed30;
}

.status-badge.offline {
  background: linear-gradient(135deg, #6b728015 0%, #4b556315 100%);
  color: #6b7280;
  border: 1px solid #6b728030;
}

.status-content {
  flex: 1;
}

.status-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

/* 操作区域 */
.operations-section {
  margin-bottom: 2.5rem;
}

.operations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
}

.operation-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  transform: translateY(-2px);
}

.operation-card:nth-child(1) .operation-icon {
  background: linear-gradient(135deg, #05966915 0%, #04785715 100%);
  color: #059669;
  border: 1px solid #05966920;
}

.operation-card:nth-child(2) .operation-icon {
  background: linear-gradient(135deg, #2563eb15 0%, #1e40af15 100%);
  color: #2563eb;
  border: 1px solid #2563eb20;
}

.operation-card:nth-child(3) .operation-icon {
  background: linear-gradient(135deg, #7c3aed15 0%, #5b21b615 100%);
  color: #7c3aed;
  border: 1px solid #7c3aed20;
}

.operation-card:nth-child(4) .operation-icon {
  background: linear-gradient(135deg, #dc262615 0%, #b91c1c15 100%);
  color: #dc2626;
  border: 1px solid #dc262620;
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

.operation-content {
  flex: 1;
}

.operation-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.operation-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* 监控区域 */
.monitoring-section {
  margin-bottom: 2.5rem;
}

.monitoring-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  flex: 1;
}

.monitoring-btn {
  display: flex;
  align-items: center;
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
}

.monitoring-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.monitoring-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: #f9fafb;
  border-radius: 6px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-title-group {
  flex: 1;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.temp-color {
  background: #dc2626;
}

.light-color {
  background: #2563eb;
}

.legend-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.chart-container {
  width: 100%;
  height: 280px;
}

/* 摄像头预览区域 */
.camera-preview-section {
  margin-bottom: 2.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.camera-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.camera-preview-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.camera-preview-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.camera-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.camera-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.camera-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.camera-status.online {
  background: linear-gradient(135deg, #05966915 0%, #04785715 100%);
  color: #059669;
  border: 1px solid #05966930;
}

.camera-status.offline {
  background: linear-gradient(135deg, #6b728015 0%, #4b556315 100%);
  color: #6b7280;
  border: 1px solid #6b728030;
}

.camera-time {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: 'SF Mono', 'Courier New', monospace;
}

.camera-content {
  aspect-ratio: 16/9;
  background: #111827;
  position: relative;
  overflow: hidden;
}

.camera-placeholder {
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

.placeholder-text {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

.camera-frame {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.frame-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.overlay-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.grid-line {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.overlay-indicators {
  position: absolute;
  top: 1rem;
  left: 1rem;
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

.overlay-time {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  font-size: 0.75rem;
  color: white;
  font-family: 'SF Mono', 'Courier New', monospace;
}

.camera-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.control-btn.start {
  background: #2563eb;
  color: white;
}

.control-btn.start:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.control-btn.stop {
  background: #dc2626;
  color: white;
}

.control-btn.stop:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-1px);
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

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.camera-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  font-family: 'SF Mono', 'Courier New', monospace;
}

/* 添加摄像头卡片 */
.camera-preview-card.add-camera {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  background: #f9fafb;
}

.add-camera-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.add-camera-content svg {
  color: #9ca3af;
}

.add-camera-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.add-camera-btn {
  padding: 0.5rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.add-camera-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }

  .time-display {
    text-align: left;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .operations-grid {
    grid-template-columns: 1fr;
  }

  .monitoring-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .monitoring-btn {
    width: 100%;
    justify-content: center;
  }

  .camera-preview-grid {
    grid-template-columns: 1fr;
  }

  .camera-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .control-btn {
    width: 100%;
    justify-content: center;
  }

  .camera-stats {
    justify-content: center;
  }
}
</style>
