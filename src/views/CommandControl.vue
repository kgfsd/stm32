<template>
  <div class="control-section">
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">设备控制面板</h2>
        <p class="section-subtitle">设备状态监控与远程控制</p>
      </div>
      <button @click="refreshDeviceState" class="refresh-btn" :disabled="loading">
        <svg class="refresh-icon" :class="{ spinning: loading }" width="16" height="16" viewBox="0 0 24 24">
          <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        {{ loading ? '同步中...' : '同步状态' }}
      </button>
    </div>

    <div class="control-grid">
      <!-- LED 控制卡片 -->
      <div class="control-card">
        <div class="card-header">
          <div class="card-icon-container">
            <div class="card-icon led-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
            </div>
          </div>
          <div class="card-title-group">
            <h3 class="card-title">照明控制</h3>
            <p class="card-subtitle">设备照明系统</p>
          </div>
        </div>
        <div class="card-content">
          <button @click="toggleLED" :class="['control-toggle', { active: deviceState.led }]">
            <div class="toggle-indicator"></div>
            <span class="toggle-label">{{ deviceState.led ? '运行状态：开启' : '运行状态：关闭' }}</span>
            <span class="toggle-action">{{ deviceState.led ? '关闭' : '开启' }}</span>
          </button>
          <div class="status-indicator" :class="{ active: deviceState.led }">
            <div class="status-dot"></div>
            <span class="status-text">{{ deviceState.led ? '设备运行中' : '设备待机中' }}</span>
          </div>
        </div>
      </div>

      <!-- 电机控制卡片 -->
      <div class="control-card">
        <div class="card-header">
          <div class="card-icon-container">
            <div class="card-icon motor-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          <div class="card-title-group">
            <h3 class="card-title">电机控制</h3>
            <p class="card-subtitle">设备动力单元</p>
          </div>
        </div>
        <div class="card-content">
          <button @click="toggleMotor" :class="['control-toggle', { active: deviceState.motor }]">
            <div class="toggle-indicator"></div>
            <span class="toggle-label">{{ deviceState.motor ? '运行状态：运转' : '运行状态：停止' }}</span>
            <span class="toggle-action">{{ deviceState.motor ? '停止' : '启动' }}</span>
          </button>
          <div class="status-indicator" :class="{ active: deviceState.motor }">
            <div class="status-dot"></div>
            <span class="status-text">{{ deviceState.motor ? '电机工作中' : '电机待机中' }}</span>
          </div>
        </div>
      </div>

      <!-- 温度控制卡片 -->
      <div class="control-card">
        <div class="card-header">
          <div class="card-icon-container">
            <div class="card-icon temp-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1v1h-2V5z"/>
              </svg>
            </div>
          </div>
          <div class="card-title-group">
            <h3 class="card-title">温度调节</h3>
            <p class="card-subtitle">环境温度控制</p>
          </div>
        </div>
        <div class="card-content">
          <div class="temperature-input-group">
            <div class="input-wrapper">
              <input
                type="number"
                v-model="deviceState.temperature"
                @change="setTemperature"
                @keyup.enter="setTemperature"
                placeholder="输入温度值"
                min="0"
                max="100"
                class="temperature-input"
              >
              <span class="input-unit">°C</span>
            </div>
            <button
              @click="setTemperature"
              class="set-btn"
              :disabled="!deviceState.temperature"
            >
              应用
            </button>
          </div>
          <div v-if="deviceState.temperature" class="current-temperature">
            <div class="temp-indicator">
              <div class="temp-bar" :style="{ width: temperaturePercentage + '%' }"></div>
            </div>
            <span class="temp-value">设定温度: {{ deviceState.temperature }}°C</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <svg class="error-icon" width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <div class="error-content">
        <p class="error-title">操作异常</p>
        <p class="error-description">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { deviceAPI } from '../services/api'

const loading = ref(false)
const error = ref('')

const deviceState = ref({
  led: false,
  motor: false,
  temperature: 0
})

// 计算温度百分比
const temperaturePercentage = computed(() => {
  return Math.min(deviceState.value.temperature, 100)
})

const refreshDeviceState = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await deviceAPI.showDeviceShadow()
    if (response.data.success) {
      const data = response.data.data
      deviceState.value = {
        led: data.led || false,
        motor: data.motor || false,
        temperature: parseFloat(data.temperature) || 0
      }
    }
  } catch (err: any) {
    error.value = '设备状态同步失败'
    console.error('刷新设备状态失败:', err)
  } finally {
    loading.value = false
  }
}

const toggleLED = async () => {
  error.value = ''
  try {
    const command = deviceState.value.led ?
      JSON.parse('{"cmd":"led_off"}') :
      JSON.parse('{"cmd":"led_on"}')
    await deviceAPI.createMessage(command)
    deviceState.value.led = !deviceState.value.led
  } catch (err: any) {
    error.value = '照明控制指令发送失败'
    console.error('LED控制失败:', err)
  }
}

const toggleMotor = async () => {
  error.value = ''
  try {
    const command = deviceState.value.motor ?
      JSON.parse('{"cmd":"motor_off"}') :
      JSON.parse('{"cmd":"motor_on"}')
    await deviceAPI.createMessage(command)
    deviceState.value.motor = !deviceState.value.motor
  } catch (err: any) {
    error.value = '电机控制指令发送失败'
    console.error('电机控制失败:', err)
  }
}

const setTemperature = async () => {
  if (!deviceState.value.temperature) return

  error.value = ''
  try {
    const temp = deviceState.value.temperature
    const command = JSON.parse(`{"temp":"${temp}"}`)
    await deviceAPI.createMessage(command)
  } catch (err: any) {
    error.value = '温度设置指令发送失败'
    console.error('温度设置失败:', err)
  }
}

onMounted(() => {
  refreshDeviceState()
})
</script>

<style scoped>
.control-section {
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e1e4e8;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e1e4e8;
}

.header-content {
  flex: 1;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
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

.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.control-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.75rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.control-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.control-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
}

.control-card:nth-child(2)::before {
  background: linear-gradient(90deg, #059669 0%, #047857 100%);
}

.control-card:nth-child(3)::before {
  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon-container {
  flex-shrink: 0;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.led-icon {
  background: linear-gradient(135deg, #2563eb15 0%, #1e40af15 100%);
  color: #2563eb;
  border: 1px solid #2563eb20;
}

.motor-icon {
  background: linear-gradient(135deg, #05966915 0%, #04785715 100%);
  color: #059669;
  border: 1px solid #05966920;
}

.temp-icon {
  background: linear-gradient(135deg, #dc262615 0%, #b91c1c15 100%);
  color: #dc2626;
  border: 1px solid #dc262620;
}

.card-title-group {
  flex: 1;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
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

.control-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: left;
}

.control-toggle:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.control-toggle.active {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border-color: #2563eb;
  color: white;
}

.control-toggle.active:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
}

.toggle-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

.control-toggle.active .toggle-indicator {
  border-color: white;
}

.toggle-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: transparent;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.control-toggle.active .toggle-indicator::after {
  background: white;
}

.toggle-label {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.control-toggle.active .toggle-label {
  font-weight: 600;
}

.toggle-action {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.9;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.status-indicator.active {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.active .status-dot {
  background: #059669;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.status-indicator.active .status-text {
  color: #059669;
}

.temperature-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.temperature-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #ffffff;
  transition: all 0.2s ease;
  font-family: 'SF Mono', 'Courier New', monospace;
}

.temperature-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-unit {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  pointer-events: none;
}

.set-btn {
  padding: 0.875rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.set-btn:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
}

.set-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.current-temperature {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.temp-indicator {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.temp-bar {
  height: 100%;
  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.temp-value {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
}

.error-message {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1.25rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  margin-top: 2rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon {
  flex-shrink: 0;
  color: #dc2626;
  margin-top: 2px;
}

.error-content {
  flex: 1;
}

.error-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 0.25rem 0;
}

.error-description {
  color: #991b1b;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .control-section {
    padding: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1.25rem;
  }

  .refresh-btn {
    width: 100%;
  }

  .control-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .temperature-input-group {
    flex-direction: column;
  }

  .set-btn {
    width: 100%;
  }
}
</style>
