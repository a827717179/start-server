# Coze API 接口文档

## 基本信息

- **基础URL**：`http://您的IP地址:3000`
- **内容类型**：`application/json`

## 访问方式

服务器启动后，会在控制台显示可用的访问地址：

```
可通过以下地址访问服务:
- http://localhost:3000
- http://192.168.220.58:3000 (en0)
- http://192.168.50.10:3000 (en3)
```

您可以使用任一地址访问API服务。

## 通用响应格式

所有API接口均返回以下格式的数据：

```json
{
  "code": 200,         // 状态码：200成功，400参数错误，500服务器错误
  "data": {},          // 数据主体，成功时包含结果数据，失败时为null
  "message": "成功"    // 消息说明
}
```

## 通用参数说明

### birth 字段

- **格式**: `YYYY-MM-DD HH:mm:ss`，例如 `2001-08-09 12:23:12`
- **说明**: 用于生日或时间相关的参数，必须符合标准日期时间格式
- **验证**: 服务端会验证日期格式是否有效，无效格式将返回400错误

## 接口列表

### 1. 工作流调用接口（非流式）

- **接口URL**：`/api/getStartDetail`
- **请求方法**：`POST`
- **功能描述**：调用Coze工作流并获取完整结果（非流式）

#### 请求参数

```json
{
  "birth": "2001-08-09 12:23:12",  // 标准日期时间格式
  "sex": "man"
  // 可添加其他工作流所需参数
}
```

#### 响应格式

**成功响应**：

```json
{
  "code": 200,
  "data": {
    // Coze工作流返回的完整数据
  },
  "message": "成功"
}
```

**错误响应**：

```json
{
  "code": 400,
  "data": null,
  "message": "请求参数不能为空"
}
```

或

```json
{
  "code": 400,
  "data": null,
  "message": "birth 字段格式无效，请使用 YYYY-MM-DD HH:mm:ss 格式"
}
```

或

```json
{
  "code": 500,
  "data": null,
  "message": "错误详情"
}
```

#### 请求示例

```javascript
// 使用axios
const response = await axios.post('http://您的IP地址:3000/api/getStartDetail', {
  birth: "2001-08-09 12:23:12",
  sex: "man"
});

console.log(response.data);
```

### 2. 工作流调用接口（流式）

- **接口URL**：`/api/getStartDetailStream`
- **请求方法**：`POST`
- **功能描述**：调用Coze工作流并获取流式响应

#### 请求参数

```json
{
  "birth": "2001-08-09 12:23:12",  // 标准日期时间格式
  "sex": "man"
  // 可添加其他工作流所需参数
}
```

#### 响应格式

Server-Sent Events (SSE) 格式的流式响应：

```
data: {"流式数据片段1"}

data: {"流式数据片段2"}

...

data: [DONE]
```

#### 请求示例

```javascript
// 使用axios
const response = await axios.post('http://您的IP地址:3000/api/getStartDetailStream', {
  birth: "2001-08-09 12:23:12",
  sex: "man"
}, {
  responseType: 'stream'
});

// 处理流式响应
response.data.on('data', (chunk) => {
  const text = chunk.toString();
  
  if (text.startsWith('data: ')) {
    const data = text.substring(6);
    
    if (data.trim() === '[DONE]') {
      console.log('流式响应结束');
      return;
    }
    
    try {
      const jsonData = JSON.parse(data);
      console.log('收到流式数据:', jsonData);
    } catch (e) {
      console.log('原始数据:', data);
    }
  }
});
```

### 3. 聊天接口（流式）

- **接口URL**：`/api/chat/stream`
- **请求方法**：`POST`
- **功能描述**：与Coze机器人进行流式聊天交互

#### 请求参数

```json
{
  "content": "用户输入的聊天内容",
  "userId": "用户ID（可选，默认为123456789）",
  "birth": "2001-08-09 12:23:12"  // 可选参数，标准日期时间格式
}
```

#### 响应格式

Server-Sent Events (SSE) 格式的流式响应：

```
data: {"assistant":"聊天回复内容片段1"}

data: {"assistant":"聊天回复内容片段2"}

...

data: [DONE]
```

#### 请求示例

```javascript
// 使用axios
const response = await axios.post('http://您的IP地址:3000/api/chat/stream', {
  content: "你好，请介绍一下你自己",
  userId: "user123"
}, {
  responseType: 'stream'
});

// 处理流式响应
response.data.on('data', (chunk) => {
  const text = chunk.toString();
  
  if (text.startsWith('data: ')) {
    const data = text.substring(6);
    
    if (data.trim() === '[DONE]') {
      console.log('聊天流式响应结束');
      return;
    }
    
    try {
      const jsonData = JSON.parse(data);
      console.log('收到聊天数据:', jsonData);
    } catch (e) {
      console.log('原始数据:', data);
    }
  }
});
```

### 4. 图片生成接口（非流式）

- **接口URL**：`/api/getImg`
- **请求方法**：`POST`
- **功能描述**：调用Coze工作流生成图片并获取完整结果（非流式）

#### 请求参数

```json
{
  "birth": "2001-08-09 12:23:12",  // 必需参数，标准日期时间格式
  "sex": "man",
  "companion_sex": "woman",
  "area": "Beijing"
}
```

#### 响应格式

**成功响应**：

```json
{
  "code": 200,
  "data": {
    // 包含图片URL的工作流返回数据
    "image_urls": [
      "https://图片URL1.jpg",
      "https://图片URL2.jpg"
    ]
  },
  "message": "成功"
}
```

**错误响应**：

```json
{
  "code": 400,
  "data": null,
  "message": "请求参数不能为空"
}
```

或

```json
{
  "code": 500,
  "data": null,
  "message": "错误详情"
}
```

#### 请求示例

```javascript
// 使用axios
const response = await axios.post('http://您的IP地址:3000/api/getImg', {
  birth: "2001-08-09 12:23:12",
  sex: "man",
  companion_sex: "woman",
  area: "Beijing"
});

console.log(response.data);

// 提取图片 URL
const imageUrls = response.data.data.image_urls;
console.log('生成的图片URL列表:', imageUrls);
```

### 5. 图片生成接口（流式）

- **接口URL**：`/api/getImg/stream`
- **请求方法**：`POST`
- **功能描述**：调用Coze工作流生成图片并获取流式响应

#### 请求参数

```json
{
  "birth": "2001-08-09 12:23:12",  // 必需参数，标准日期时间格式
  "sex": "man",
  "companion_sex": "woman",
  "area": "Beijing"
}
```

#### 响应格式

Server-Sent Events (SSE) 格式的流式响应，包含图片URL：

```
data: {"image_urls":["https://图片URL1.jpg"]}

data: {"image_urls":["https://图片URL2.jpg"]}

...

data: [DONE]
```

#### 请求示例

```javascript
// 使用axios
const response = await axios.post('http://您的IP地址:3000/api/getImg/stream', {
  birth: "2001-08-09 12:23:12",
  sex: "man",
  companion_sex: "woman",
  area: "Beijing"
}, {
  responseType: 'stream'
});

// 处理流式响应
let imageUrls = [];

response.data.on('data', (chunk) => {
  const text = chunk.toString();
  
  if (text.startsWith('data: ')) {
    const data = text.substring(6);
    
    if (data.trim() === '[DONE]') {
      console.log('图片生成流式响应结束');
      return;
    }
    
    try {
      const jsonData = JSON.parse(data);
      console.log('收到图片数据:', jsonData);
      
      // 提取图片 URL
      if (jsonData && jsonData.image_urls && jsonData.image_urls.length > 0) {
        imageUrls = imageUrls.concat(jsonData.image_urls);
        console.log('当前图片 URL 列表:', imageUrls);
      }
    } catch (e) {
      console.log('原始数据:', data);
    }
  }
});

response.data.on('end', () => {
  console.log('连接已关闭');
  console.log('最终图片 URL 列表:', imageUrls);
});
```

## 错误码说明

| 错误码 | 说明 |
|-------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误，如参数为空或格式不正确 |
| 500 | 服务器内部错误，包含Coze API调用失败 |

## 配置说明

服务器使用以下环境变量进行配置：

| 变量名 | 描述 | 默认值 |
|-------|------|-------|
| COZE_API_KEY | Coze API密钥 | - |
| COZE_BASE_URL | Coze API基础URL | https://api.coze.cn |
| COZE_WORKFLOW_ID | 工作流ID | - |
| COZE_BOT_ID | 机器人ID | - |
| COZE_IMG_WORKFLOW_ID | 图片生成工作流ID | - |
| PORT | 服务器端口 | 3000 |
| HOST | 服务器主机绑定地址 | 0.0.0.0 |

## 服务器启动

### 默认启动

```bash
npm run dev
```

### 使用IP地址启动（所有网络接口）

```bash
npm run dev:ip
```

## 前端集成示例

### 聊天示例 (HTML + JavaScript)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Coze Chat 示例</title>
  <style>
    #chatbox {
      height: 400px;
      border: 1px solid #ccc;
      overflow-y: auto;
      padding: 10px;
      margin-bottom: 10px;
    }
    .user-message {
      background-color: #e1f5fe;
      padding: 8px;
      margin: 5px 0;
      border-radius: 8px;
    }
    .bot-message {
      background-color: #f1f1f1;
      padding: 8px;
      margin: 5px 0;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>Coze 聊天示例</h1>
  <div id="chatbox"></div>
  <div>
    <input type="text" id="messageInput" placeholder="输入消息..." style="width: 80%">
    <button onclick="sendMessage()">发送</button>
  </div>

  <script>
    const chatbox = document.getElementById('chatbox');
    const messageInput = document.getElementById('messageInput');
    const serverUrl = 'http://您的IP地址:3000';

    function addMessage(content, isUser) {
      const div = document.createElement('div');
      div.className = isUser ? 'user-message' : 'bot-message';
      div.textContent = content;
      chatbox.appendChild(div);
      chatbox.scrollTop = chatbox.scrollHeight;
    }

    async function sendMessage() {
      const content = messageInput.value.trim();
      if (!content) return;
      
      // 显示用户消息
      addMessage(content, true);
      messageInput.value = '';
      
      try {
        const response = await fetch(`${serverUrl}/api/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content })
        });
        
        // 创建一个空的bot消息容器
        const botDiv = document.createElement('div');
        botDiv.className = 'bot-message';
        chatbox.appendChild(botDiv);
        
        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botResponse = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const text = decoder.decode(value);
          const lines = text.split('\n\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);
              
              if (data.trim() === '[DONE]') {
                break;
              }
              
              try {
                const jsonData = JSON.parse(data);
                if (jsonData.assistant) {
                  botResponse += jsonData.assistant;
                  botDiv.textContent = botResponse;
                  chatbox.scrollTop = chatbox.scrollHeight;
                }
              } catch (e) {
                console.error('解析失败:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('请求失败:', error);
        addMessage('抱歉，发生了错误，请稍后再试。', false);
      }
    }

    // 按Enter发送消息
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  </script>
</body>
</html>
```

### 图片生成示例 (HTML + JavaScript)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Coze 图片生成示例</title>
  <style>
    #imageContainer {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }
    .image-item {
      max-width: 300px;
      border: 1px solid #ddd;
      padding: 10px;
      border-radius: 4px;
    }
    .image-item img {
      width: 100%;
      border-radius: 4px;
    }
    #statusMessage {
      margin-top: 10px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>Coze 图片生成示例</h1>
  <form id="imageForm">
    <div>
      <label>生日:</label>
      <input type="text" id="birth" value="2001-08-09 12:23:12">
    </div>
    <div>
      <label>性别:</label>
      <select id="sex">
        <option value="man">男</option>
        <option value="woman">女</option>
      </select>
    </div>
    <div>
      <label>伴侣性别:</label>
      <select id="companion_sex">
        <option value="woman">女</option>
        <option value="man">男</option>
      </select>
    </div>
    <div>
      <label>地区:</label>
      <input type="text" id="area" value="Beijing">
    </div>
    <div>
      <label>请求方式:</label>
      <select id="requestType">
        <option value="stream">流式</option>
        <option value="sync">非流式</option>
      </select>
    </div>
    <button type="submit">生成图片</button>
  </form>
  
  <div id="statusMessage"></div>
  <div id="imageContainer"></div>

  <script>
    const form = document.getElementById('imageForm');
    const statusMessage = document.getElementById('statusMessage');
    const imageContainer = document.getElementById('imageContainer');
    const serverUrl = 'http://您的IP地址:3000';
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // 清空之前的结果
      imageContainer.innerHTML = '';
      statusMessage.textContent = '正在生成图片，请稍候...';
      
      // 获取表单数据
      const params = {
        birth: document.getElementById('birth').value,
        sex: document.getElementById('sex').value,
        companion_sex: document.getElementById('companion_sex').value,
        area: document.getElementById('area').value
      };
      
      const requestType = document.getElementById('requestType').value;
      
      try {
        if (requestType === 'stream') {
          // 流式请求
          await handleStreamRequest(params);
        } else {
          // 非流式请求
          await handleSyncRequest(params);
        }
      } catch (error) {
        console.error('请求失败:', error);
        statusMessage.textContent = '生成图片失败，请稍后再试。';
      }
    });

    // 处理流式请求
    async function handleStreamRequest(params) {
      const response = await fetch(`${serverUrl}/api/getImg/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let imageUrls = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            
            if (data.trim() === '[DONE]') {
              statusMessage.textContent = '图片生成完成！';
              break;
            }
            
            try {
              const jsonData = JSON.parse(data);
              
              // 提取图片 URL
              if (jsonData && jsonData.image_urls && jsonData.image_urls.length > 0) {
                for (const url of jsonData.image_urls) {
                  if (!imageUrls.includes(url)) {
                    imageUrls.push(url);
                    addImage(url);
                  }
                }
                
                statusMessage.textContent = `已接收 ${imageUrls.length} 张图片...`;
              }
            } catch (e) {
              console.error('解析失败:', e);
            }
          }
        }
      }
    }
    
    // 处理非流式请求
    async function handleSyncRequest(params) {
      const response = await fetch(`${serverUrl}/api/getImg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      const result = await response.json();
      
      if (result.code === 200 && result.data) {
        statusMessage.textContent = '图片生成完成！';
        
        // 提取图片 URL
        const imageUrls = result.data.image_urls || [];
        
        if (imageUrls.length > 0) {
          imageUrls.forEach(url => addImage(url));
        } else {
          statusMessage.textContent = '没有生成图片。';
        }
      } else {
        statusMessage.textContent = `生成失败: ${result.message}`;
      }
    }
    
    // 添加图片到界面
    function addImage(url) {
      const div = document.createElement('div');
      div.className = 'image-item';
      
      const img = document.createElement('img');
      img.src = url;
      img.alt = '生成的图片';
      
      div.appendChild(img);
      imageContainer.appendChild(div);
    }
  </script>
</body>
</html>
``` 