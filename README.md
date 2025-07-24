# Coze Express API 服务

这是一个基于 Express 框架的 API 服务，用于接入 Coze 工作流。

## 功能特点

- 使用 Express 框架构建 RESTful API
- 集成 Coze API 工作流
- 提供非流式的 getStartDetail 接口

## 安装

```bash
# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env
# 请修改 .env 文件中的 API 凭证
```

## 配置

在 `.env` 文件中配置以下环境变量：

```
COZE_API_TOKEN=your_coze_api_token
COZE_API_BASE_URL=https://api.coze.cn
COZE_WORKFLOW_ID=your_workflow_id
PORT=3000
```

## 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## API 接口

### getStartDetail

- **URL**: `/api/getStartDetail`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "birth": "2001-08-09 12:23:12",
    "sex": "man"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      // Coze API 响应内容
    }
  }
  ```

## 示例

参见 `examples/request.js` 文件查看请求示例。

```javascript
const axios = require('axios');

const testGetStartDetail = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/getStartDetail', {
      birth: "2001-08-09 12:23:12",
      sex: "man"
    });
    
    console.log('响应结果:', response.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

testGetStartDetail();
``` 