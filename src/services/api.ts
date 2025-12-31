import axios from 'axios'

// 获取API基础URL，支持环境变量配置
const getApiBaseUrl = () => {
  // 优先使用环境变量，如果没有则使用默认值
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
}

// 创建axios实例
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// API接口定义
export const deviceAPI = {
  // 设备控制
  showDevice: () => api.get('/ShowDevice'),
  
  // 命令控制
  createMessage: (message: string) => api.post('/CreateMessage', { message }),
  listDeviceMessages: () => api.get('/ListDeviceMessages'),
  createCommand: (command: string) => api.post('/CreateCommand', { command }),
  
  // 属性控制
  listProperties: () => api.get('/ListProperties'),
  updateProperties: (properties: string) => api.post('/UpdateProperties', { properties }),
  showDeviceShadow: () => api.get('/ShowDeviceShadow'),
  //获取历史温度数据
  getHistoricalTemperatureData: () => api.get('/GetHistoricalTemperatureData'),
  getHistoricalLsensData: () => api.get('/GetHistoricalLsensData'),

  // 获取历史消息
  getHistoricalMessages: () => api.get('/GetHistoricalMessages'),

  // 系统
  healthCheck: () => api.get('/health'),
  apiDocs: () => api.get('/api/docs')

}

export default api