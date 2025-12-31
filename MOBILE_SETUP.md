# 手机应用配置说明

## 问题解决方案

手机应用连接不上的问题已经通过以下方式解决：

### 1. 环境配置
- 创建了 `.env` 和 `.env.production` 文件
- 支持通过环境变量配置API服务器地址

### 2. 配置步骤

#### 开发环境测试：
1. 找到您电脑的IP地址（在命令行运行 `ipconfig` 查看）
2. 修改 `.env` 文件中的 `VITE_API_BASE_URL`：
   ```
   VITE_API_BASE_URL=http://您的电脑IP:5000
   ```
   例如：`VITE_API_BASE_URL=http://192.168.1.100:5000`

#### 生产环境部署：
1. 修改 `.env.production` 文件中的 `VITE_API_BASE_URL`
2. 设置为您的服务器实际地址

### 3. 构建和部署

#### 构建应用：
```bash
pnpm build
```

#### 同步到移动端：
```bash
npx cap sync
```

#### 在Android Studio中运行：
```bash
npx cap open android
```

### 4. 重要注意事项

1. **确保后端服务器运行**：手机需要能够访问到您的API服务器
2. **网络连接**：确保手机和服务器在同一网络或服务器有公网IP
3. **防火墙设置**：确保服务器端口（如5000）没有被防火墙阻挡
4. **CORS配置**：确保后端API支持跨域请求

### 5. 调试技巧

- 使用Chrome DevTools连接手机调试
- 检查网络请求是否成功
- 查看控制台错误信息

## 常见问题

**Q: 手机仍然连接不上？**
A: 
1. 检查IP地址是否正确
2. 确认后端服务器正在运行
3. 尝试在手机浏览器直接访问API地址测试连通性

**Q: 如何获取电脑IP地址？**
A: 
- Windows: 运行 `ipconfig`
- Mac/Linux: 运行 `ifconfig` 或 `ip addr`