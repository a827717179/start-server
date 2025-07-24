# Coze API 接口文档

## 基本信息

- **基础URL**：`http://192.168.220.68:3000`
- **内容类型**：`application/json`

## 接口列表

### 1. 工作流调用接口（非流式）

- **接口URL**：`/api/getStartDetail`
- **请求方法**：`POST`
- **功能描述**：调用Coze工作流并获取完整结果（非流式）

#### 请求参数

```json
{
  "birth": "2001-08-09 12:23:12",
  "sex": "man"
  // 可添加其他工作流所需参数
}
```

#### 响应格式

**成功响应**：

```json
{
  "success": true,
  "data": {
    // Coze工作流返回的完整数据
  }
}
```

**错误响应**：

```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息"
}
```

#### 请求示例

```javascript
// 使用axios
const response = await axios.post('http://您的服务器地址:3000/api/getStartDetail', {
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
  "birth": "2001-08-09 12:23:12",
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
const response = await axios.post('http://您的服务器地址:3000/api/getStartDetailStream', {
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
  "userId": "用户ID（可选，默认为123456789）"
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
const response = await axios.post('http://您的服务器地址:3000/api/chat/stream', {
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

## 错误码说明

| 错误码 | 说明 |
|-------|------|
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
| PORT | 服务器端口 | 3000 |

## 前端集成示例

### HTML + JavaScript示例

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
    const serverUrl = 'http://您的服务器地址:3000';

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