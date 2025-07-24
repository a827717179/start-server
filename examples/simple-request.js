/**
 * 简单请求示例
 */
const axios = require('axios');
const { CozeAPI } = require('@coze/api');

/**
 * 直接使用 Coze API 的示例
 */
const directApiExample = async () => {
  try {
    // 配置信息
    const config = {
      baseURL: 'https://api.coze.cn',
      token: 'pat_jy1zC2WohLYJ5ZPPjYJQfwarQLdOVmw7v8nwFdzMZurD4n1wgtP3jNr5q9WvdfPg',
      workflowId: '7529877789434445833'
    };
    
    // 初始化客户端
    const client = new CozeAPI({
      token: config.token,
      baseURL: config.baseURL
    });
    
    // 调用工作流
    console.log('=== 直接调用 Coze API ===');
    console.log(`使用工作流ID: ${config.workflowId}`);
    
    const result = await client.workflows.runs.create({
      workflow_id: config.workflowId,
      parameters: {
        birth: '2001-08-09 12:23:12',
        sex: 'man'
      }
    });
    
    console.log('调用成功:', result);
  } catch (error) {
    console.error('调用失败:', error.message);
  }
};

/**
 * 通过服务器接口请求
 */
const serverApiExample = async () => {
  try {
    // 通过 Express 服务调用
    console.log('\n=== 通过 Express 服务调用 ===');
    
    const response = await axios.post('http://192.168.220.68:3000/api/getStartDetail', {
      birth: '2001-08-09 12:23:12',
      sex: 'man'
    });
    
    console.log('响应结果:', response.data);
  } catch (error) {
    console.error('请求失败:', error.response ? error.response.data : error.message);
  }
};

/**
 * 通过流式接口请求
 */
const streamApiExample = async () => {
  try {
    // 通过 Express 服务调用流式接口
    console.log('\n=== 通过流式接口调用 ===');
    
    const response = await axios.post('http://192.168.220.68:3000/api/getStartDetailStream', {
      birth: '2001-08-09 12:23:12',
      sex: 'man'
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
    
    response.data.on('end', () => {
      console.log('连接已关闭');
    });
  } catch (error) {
    console.error('流式请求失败:', error.message);
  }
};

// 运行示例
const runExamples = async () => {
  // 直接调用 API
  await directApiExample();
  
  // 通过服务器接口
  await serverApiExample();
  
  // 流式接口
  await streamApiExample();
};

runExamples(); 