const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const os = require('os');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../env.development') });

// 导入路由
const apiRoutes = require('./routes/api');

// 初始化 Express 应用
const app = express();
const PORT = process.env.PORT || 3000;

// 获取本机IP地址
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (const item of iface) {
      if (item.family === 'IPv4' && !item.internal) {
        return item.address;
      }
    }
  }
  return '0.0.0.0'; // 默认值
}

// 获取所有可用的IPv4地址
function getAllIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (const item of iface) {
      // 只获取IPv4的地址，且不是内部地址
      if (item.family === 'IPv4' && !item.internal) {
        addresses.push({
          name: devName,
          address: item.address
        });
      }
    }
  }
  
  return addresses;
}

const HOST = process.env.HOST || getLocalIp();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', apiRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ 
    message: '欢迎使用 Coze API 服务'
  });
});

// 启动服务器
app.listen(PORT, HOST, () => {
  console.log(`服务器运行在 http://${HOST}:${PORT}`);
  
  // 如果绑定在所有接口上，显示所有可访问的地址
  if (HOST === '0.0.0.0') {
    console.log('可通过以下地址访问服务:');
    console.log(`- http://localhost:${PORT}`);
    
    const ipAddresses = getAllIpAddresses();
    ipAddresses.forEach(ip => {
      console.log(`- http://${ip.address}:${PORT} (${ip.name})`);
    });
  }
}); 