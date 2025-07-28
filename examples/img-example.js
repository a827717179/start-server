/**
 * Coze 非流式图片生成 API 示例
 */
const axios = require('axios');
const { CozeAPI } = require('@coze/api');

/**
 * 直接使用 Coze API 的图片生成示例（非流式）
 */
const directImgExample = async () => {
  try {
    // 配置信息
    const config = {
      baseURL: 'https://api.coze.cn',
      token: process.env.COZE_API_KEY || 'pat_jy1zC2WohLYJ5ZPPjYJQfwarQLdOVmw7v8nwFdzMZurD4n1wgtP3jNr5q9WvdfPg',
      workflowId: process.env.COZE_IMG_WORKFLOW_ID || '7528354883407118351'
    };
    
    // 请求参数
    const parameters = {
      birth: "2001-08-09 12:23:12",
      sex: "man",
      companion_sex: "woman",
      area: "Beijing"
    };
    
    // 初始化客户端
    const client = new CozeAPI({
      token: config.token,
      baseURL: config.baseURL
    });
    
    // 调用图片生成 API（非流式）
    console.log('=== 直接调用 Coze 图片生成 API（非流式）===');
    console.log(`使用工作流ID: ${config.workflowId}`);
    console.log('参数:', parameters);
    
    const result = await client.workflows.runs.create({
      workflow_id: config.workflowId,
      parameters: parameters
    });
    
    // 处理结果
    console.log('接收到响应:');
    console.log(result);
    
    // 提取图片 URL
    let imageUrls = [];
    if (result && result.image_urls) {
      imageUrls = result.image_urls;
      console.log('生成的图片 URL:', imageUrls);
    }
    
    console.log('直接调用图片生成 API 完成');
    return result;
  } catch (error) {
    console.error('直接调用失败:', error.message);
    return null;
  }
};

/**
 * 通过服务器接口请求（非流式）
 */
const serverImgExample = async () => {
  try {
    // 通过 Express 服务调用图片生成接口
    console.log('\n=== 通过 Express 服务调用图片生成接口（非流式）===');
    
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    
    // 请求参数
    const parameters = {
      birth: "2001-08-09 12:23:12",
      sex: "man",
      companion_sex: "woman",
      area: "Beijing"
    };
    
    console.log('请求参数:', parameters);
    
    const response = await axios.post(`${serverUrl}/api/getImg`, parameters);
    
    console.log('响应结果:', response.data);
    
    // 提取图片 URL
    if (response.data.success && response.data.imageUrls) {
      console.log('生成的图片 URL:', response.data.imageUrls);
    }
  } catch (error) {
    console.error('图片生成请求失败:', error.response ? error.response.data : error.message);
  }
};

// 运行示例
const runExamples = async () => {
  // 直接调用 API
  await directImgExample();
  
  // 通过服务器接口
  await serverImgExample();
};

runExamples(); 