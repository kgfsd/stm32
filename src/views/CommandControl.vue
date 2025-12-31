<template>
  <div class="control-section">
    <div class="section-header">
      <h3>设备控制</h3>
      <button @click="refreshDeviceState" class="refresh-btn" :disabled="loading">
        <span class="btn-icon">🔄</span>
        {{ loading ? '刷新中...' : '刷新' }}
      </button>
    </div>

    <div class="control-grid">
      <div class="control-card">
        <div class="card-header">
          <span class="card-icon">💡</span>
          <h4>LED 控制</h4>
        </div>
        <button @click="toggleLED" :class="['control-btn', { active: deviceState.led }]">
          <span class="btn-icon">{{ deviceState.led ? '🔆' : '🔅' }}</span>
          {{ deviceState.led ? '关闭 LED' : '开启 LED' }}
        </button>
      </div>

      <div class="control-card">
        <div class="card-header">
          <span class="card-icon">⚙️</span>
          <h4>电机控制</h4>
        </div>
        <button @click="toggleMotor" :class="['control-btn', { active: deviceState.motor }]">
          <span class="btn-icon">{{ deviceState.motor ? '🔄' : '⏸️' }}</span>
          {{ deviceState.motor ? '停止电机' : '启动电机' }}
        </button>
      </div>

      <div class="control-card">
        <div class="card-header">
          <span class="card-icon">🌡️</span>
          <h4>温度设置</h4>
        </div>
        <div class="temperature-control">
          <div class="input-group">
            <input 
              type="number" 
              v-model="deviceState.temperature"
              @change="setTemperature"
              placeholder="输入温度值"
              min="0"
              max="100"
            >
            <button @click="setTemperature" class="set-btn" :disabled="!deviceState.temperature">
              设置
            </button>
          </div>
          <div class="current-temp" v-if="deviceState.temperature">
            当前设置: {{ deviceState.temperature }}°C
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deviceAPI } from '../services/api'

const loading = ref(false)
const error = ref('')

// 添加设备状态控制
const deviceState = ref({
  led: false,
  motor: false,
  temperature: ''
})

// 刷新设备状态
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
        temperature: data.temperature || ''
      }
    }
  } catch (err: any) {
    error.value = '刷新设备状态失败'
    console.error('刷新设备状态失败:', err)
  } finally {
    loading.value = false
  }
}

// LED控制
const toggleLED = async () => {
  error.value = ''
  try {
    const command = deviceState.value.led ? 
      JSON.parse('{"cmd":"led_off"}') : 
      JSON.parse('{"cmd":"led_on"}')
    await deviceAPI.createMessage(command)
    deviceState.value.led = !deviceState.value.led
  } catch (err: any) {
    error.value = 'LED控制失败'
    console.error('LED控制失败:', err)
  }
}

// 电机控制
const toggleMotor = async () => {
  error.value = ''
  try {
    const command = deviceState.value.motor ? 
      JSON.parse('{"cmd":"motor_off"}') : 
      JSON.parse('{"cmd":"motor_on"}')
    await deviceAPI.createMessage(command)
    deviceState.value.motor = !deviceState.value.motor
  } catch (err: any) {
    error.value = '电机控制失败'
    console.error('电机控制失败:', err)
  }
}

// 温度设置
const setTemperature = async () => {
  if (!deviceState.value.temperature) return
  
  error.value = ''
  try {
    const command = JSON.parse(`{"temp":"${deviceState.value.temperature}"}`)
    await deviceAPI.createMessage(command)
  } catch (err: any) {
    error.value = '温度设置失败'
    console.error('温度设置失败:', err)
  }
}



onMounted(() => {
  refreshDeviceState()
})
</script>

<style scoped>
.control-section {
  padding: 2rem;
  background: white;
  border-radius: 12px;
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

.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.control-card {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-icon {
  font-size: 1.5rem;
}

.card-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.control-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #e2e8f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: #cbd5e0;
  transform: translateY(-1px);
}

.control-btn.active {
  background: #48bb78;
  color: white;
}

.control-btn.active:hover {
  background: #38a169;
}

.btn-icon {
  font-size: 1.2rem;
}

.temperature-control {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.set-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.set-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.set-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.current-temp {
  padding: 0.5rem;
  background: #edf2f7;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #4a5568;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  color: #c53030;
  margin-top: 1rem;
}

.error-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .control-section {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .control-grid {
    grid-template-columns: 1fr;
  }
}
</style>
