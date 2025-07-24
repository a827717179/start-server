/**
 * Coze Chat API 示例
 */
const axios = require('axios');
const { CozeAPI } = require('@coze/api');

/**
 * 直接使用 Coze Chat API 的示例
 */
const directChatExample = async () => {
  try {
    // 配置信息
    const config = {
      baseURL: 'https://api.coze.cn',
      token: process.env.COZE_API_KEY || 'pat_jy1zC2WohLYJ5ZPPjYJQfwarQLdOVmw7v8nwFdzMZurD4n1wgtP3jNr5q9WvdfPg',
      botId: process.env.COZE_BOT_ID || '7528335712321044520',
      userId: '123456789',
      content: '你好，请介绍一下你自己'
    };
    
    // 初始化客户端
    const client = new CozeAPI({
      token: config.token,
      baseURL: config.baseURL
    });
    
    // 调用聊天流式 API
    console.log('=== 直接调用 Coze Chat API ===');
    console.log(`使用机器人ID: ${config.botId}`);
    
    const stream = await client.chat.stream({
      bot_id: config.botId,
      user_id: config.userId,
      additional_messages: [
        {
          "content": config.content,
          "content_type": "text",
          "role": "user",
          "type": "question"
        }
      ]
    });
    
    // 处理流式响应
    console.log('接收到流式响应:');
    for await (const chunk of stream) {
      console.log(chunk);
    }
    
    console.log('直接调用聊天流式 API 完成');
  } catch (error) {
    console.error('直接调用失败:', error.message);
  }
};

/**
 * 通过服务器聊天接口请求
 */
const serverChatExample = async () => {
  try {
    // 通过 Express 服务调用聊天接口
    console.log('\n=== 通过 Express 服务调用聊天接口 ===');
    
    const serverUrl = process.env.SERVER_URL || 'http://192.168.220.68:3000';
    const response = await axios.post(`${serverUrl}/api/chat/stream`, {
      content: '你好，请介绍一下你自己',
      userId: '123456789'
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
    
    response.data.on('end', () => {
      console.log('聊天连接已关闭');
    });
  } catch (error) {
    console.error('聊天请求失败:', error.message);
  }
};

// 运行示例
const runExamples = async () => {
  // 直接调用 API
  await directChatExample();
  
  // 通过服务器接口
  await serverChatExample();
};

runExamples(); 