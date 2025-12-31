<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>系统仪表板</h2>
      <p>IoT设备管理系统概览</p>
    </div>

    <div class="status-cards">
      <div class="status-card">
        <div class="card-icon">🔧</div>
        <div class="card-content">
          <h3>系统状态</h3>
          <p :class="{ 'status-healthy': systemStatus.healthy, 'status-error': !systemStatus.healthy }">
            {{ systemStatus.message }}
          </p>
        </div>
      </div>

      <div class="status-card">
        <div class="card-icon">📱</div>
        <div class="card-content">
          <h3>设备连接</h3>
          <p>{{ deviceCount }} 台设备在线</p>
        </div>
      </div>

      <div class="status-card">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <h3>消息统计</h3>
          <p>{{ messageCount }} 条消息</p>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h3>快速操作</h3>
      <div class="action-buttons">
        <router-link to="/device" class="action-btn">
          <span class="btn-icon">🔍</span>
          查看设备
        </router-link>
        <router-link to="/command" class="action-btn">
          <span class="btn-icon">⚡</span>
          发送命令
        </router-link>
        <router-link to="/message" class="action-btn">
          <span class="btn-icon">📨</span>
          历史消息
        </router-link>
      </div>
    </div>
    <!-- 添加温度历史数据图表 -->
    <div class="chart-section">
      <div class="section-header">
        <h3>历史温度数据</h3>
        <button @click="refreshTemperatureData" class="refresh-btn" :disabled="loading">
          <span class="refresh-icon">🔄</span>
          刷新数据
        </button>
      </div>
      <div class="chart-container" ref="chartRef"></div>
    </div>
    <div class="chart-section">
      <div class="section-header">
        <h3>历史光照数据</h3>
        <button @click="refreshLightData" class="refresh-btn" :disabled="lightLoading">
          <span class="refresh-icon">🔄</span>
          刷新数据
        </button>
      </div>
      <div class="chart-container" ref="lightChartRef"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deviceAPI } from '../services/api'
import * as echarts from 'echarts'
import { log } from 'echarts/types/src/util/log.js'

const chartRef = ref<HTMLDivElement>()
const loading = ref(false)
const temperatureData = ref<any[]>([])

const lightChartRef = ref<HTMLDivElement>()
const lightLoading = ref(false)
const lightData = ref<any[]>([])


const systemStatus = ref({ healthy: false, message: '检查中...' })
const deviceCount = ref(0)
const messageCount = ref(0)
interface ApiDocs {
  title: string
  version: string
  endpoints: {
    [group: string]: {
      [endpoint: string]: string
    }
  }
}

const apiDocs = ref<ApiDocs | null>(null)

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

const loadApiDocs = async () => {
  try {
    const response = await deviceAPI.apiDocs()
    if (response.data.success) {
      apiDocs.value = response.data.data
    }
  } catch (error) {
    console.error('加载API文档失败:', error)
  }
}

const loadDashboardData = async () => {
  try {
    // 获取设备信息
    const deviceResponse = await deviceAPI.showDevice()
    
    if (deviceResponse.data.success) {
      deviceCount.value = 1 // 假设有一台设备
    }

    // 获取消息统计
    const messagesResponse = await deviceAPI.getHistoricalMessages()
    if (messagesResponse.data.success && messagesResponse.data.data) {
      messageCount.value = Array.isArray(messagesResponse.data.data) ? messagesResponse.data.data.length : 0
    }
  } catch (error) {
    console.error('加载仪表板数据失败:', error)
  }
}
// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  const chart = echarts.init(chartRef.value)
  const option = {
    title: {
      text: '温度趋势图',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `北京时间: ${data.name}<br/>温度: ${data.value}°C`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        minSpan: 10
      },
      {
        start: 0,
        end: 100,
        minSpan: 10,
        handleStyle: {
          color: '#667eea'
        },
        textStyle: {
          color: '#333'
        }
      }
    ],
    xAxis: {
      type: 'category',
      data: temperatureData.value.map(item => convertToBeijingTime(item.event_time)),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '温度 (°C)',
      nameLocation: 'middle',
      nameGap: 40,
      axisLabel: {
        formatter: '{value}°C'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '温度',
      type: 'line',
      data: temperatureData.value.map(item => item.temp),
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: '#667eea'
      },
      itemStyle: {
        color: '#667eea'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(102, 126, 234, 0.3)'
          },
          {
            offset: 1,
            color: 'rgba(102, 126, 234, 0.1)'
          }
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
    title: {
      text: '光照趋势图',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `北京时间: ${data.name}<br/>光照: ${data.value} Lux`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        minSpan: 10
      },
      {
        start: 0,
        end: 100,
        minSpan: 10,
        handleStyle: {
          color: '#f6ad55'
        },
        textStyle: {
          color: '#333'
        }
      }
    ],
    xAxis: {
      type: 'category',
      data: lightData.value.map(item => convertToBeijingTime(item.event_time)),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '光照 (Lux)',
      nameLocation: 'middle',
      nameGap: 40,
      axisLabel: {
        formatter: '{value} Lux'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '光照',
      type: 'line',
      data: lightData.value.map(item => item.light),
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: '#f6ad55'
      },
      itemStyle: {
        color: '#f6ad55'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(246, 173, 85, 0.3)'
          },
          {
            offset: 1,
            color: 'rgba(246, 173, 85, 0.1)'
          }
        ])
      }
    }]
  }

  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}


// 获取历史温度数据
const refreshTemperatureData = async () => {
  loading.value = true
  try {
    const response = await deviceAPI.getHistoricalTemperatureData()
    console.log(response); // 打印响应数据
    if (response.data.success) {
      // 检查数据是否为数组，如果不是，转换为数组
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
  } finally {
    loading.value = false
  }
}
const refreshLightData = async () => {
  lightLoading.value = true
  try {
    const response = await deviceAPI.getHistoricalLsensData()
    console.log(response); // 打印响应数据
    if (response.data.success) {
      // 检查数据是否为数组，如果不是，转换为数组
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
  } finally {
    lightLoading.value = false
  }
}

// UTC时间转北京时间
const convertToBeijingTime = (utcTime: string) => {
  // 解析UTC时间字符串
  const dateStr = utcTime.replace('T', ' ').replace('Z', '')
  const year = parseInt(dateStr.substring(0, 4))
  const month = parseInt(dateStr.substring(4, 6)) - 1 // 月份从0开始
  const day = parseInt(dateStr.substring(6, 8))
  const hour = parseInt(dateStr.substring(8, 10))
  const minute = parseInt(dateStr.substring(10, 12))
  const second = parseInt(dateStr.substring(12, 14))
  
  // 创建Date对象
  const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second))
  
  // 转换为北京时间（UTC+8）
  const beijingTime = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000)
  
  // 格式化时间字符串
  return beijingTime.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}
onMounted(() => {
  checkSystemHealth()
  loadApiDocs()
  loadDashboardData()
  refreshTemperatureData() // 初始化图表
  refreshLightData() // 初始化光照图表
})
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h2 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: #666;
  font-size: 1.1rem;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease;
}

.status-card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.card-content p {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.status-healthy {
  color: #10b981 !important;
  font-weight: 600;
}

.status-error {
  color: #ef4444 !important;
  font-weight: 600;
}

.quick-actions {
  margin-bottom: 3rem;
}

.quick-actions h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-icon {
  font-size: 1.2rem;
}

.api-docs {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.api-docs h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.endpoint-groups {
  display: grid;
  gap: 1.5rem;
}

.endpoint-group h4 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.endpoint-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.endpoint-group li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.endpoint-group li:last-child {
  border-bottom: none;
}

.endpoint-group code {
  background: #f8f9fa;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #e83e8c;
  font-weight: 600;
}
.chart-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-container {
  width: 100%;
  height: 400px;
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

@media (max-width: 768px) {
  .status-cards {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
}
</style>