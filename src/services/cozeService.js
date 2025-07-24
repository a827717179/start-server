const apiClient = require('../config/coze');
const auth = require('../config/auth');

/**
 * 获取起始详情服务
 * @param {Object} params - 请求参数对象
 * @returns {Promise<Object>} 工作流运行结果
 */
const getStartDetail = async (params) => {
  try {
    // 从配置中获取工作流 ID
    const workflowId = auth.currentConfig.COZE_WORKFLOW_ID;
    
    console.log('调用 Coze API 参数:', {
      workflow_id: workflowId,
      parameters: params
    });
    
    // 调用 Coze API 的非流式接口
    const response = await apiClient.workflows.runs.create({
      workflow_id: workflowId,
      parameters: params
    });
    
    console.log('Coze API 响应成功');
    return response;
  } catch (error) {
    console.error('Coze API 调用失败:', error.response ? error.response.data : error.message);
    
    // 返回适当的错误对象，供上层处理
    if (error.response && error.response.data) {
      throw new Error(JSON.stringify(error.response.data));
    } else if (error.code && error.msg) {
      throw new Error(`code: ${error.code}, msg: ${error.msg}`);
    } else {
      throw error;
    }
  }
};

/**
 * 获取起始详情服务（流式）
 * @param {Object} params - 请求参数对象
 * @returns {Promise<ReadableStream>} 工作流流式响应
 */
const getStartDetailStream = async (params) => {
  try {
    // 从配置中获取工作流 ID
    const workflowId = auth.currentConfig.COZE_WORKFLOW_ID;
    
    console.log('调用 Coze API 流式接口参数:', {
      workflow_id: workflowId,
      parameters: params
    });
    
    // 调用 Coze API 的流式接口
    const stream = await apiClient.workflows.runs.stream({
      workflow_id: workflowId,
      parameters: params
    });
    
    console.log('Coze API 流式接口连接成功');
    return stream;
  } catch (error) {
    console.error('Coze API 流式调用失败:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * 聊天服务（流式）
 * @param {string} content - 用户输入内容
 * @param {string} userId - 用户ID
 * @returns {Promise<ReadableStream>} 聊天流式响应
 */
const chatStream = async (content, userId = '123456789') => {
  try {
    // 从配置中获取 bot_id
    const botId = auth.currentConfig.COZE_BOT_ID;
    
    console.log('调用 Coze Chat 流式接口参数:', {
      bot_id: botId,
      user_id: userId,
      content
    });
    
    // 调用 Coze API 的聊天流式接口
    const stream = await apiClient.chat.stream({
      bot_id: botId,
      user_id: userId,
      additional_messages: [
        {
          "content": content,
          "content_type": "text",
          "role": "user",
          "type": "question"
        }
      ]
    });
    
    console.log('Coze Chat 流式接口连接成功');
    return stream;
  } catch (error) {
    console.error('Coze Chat 流式调用失败:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = {
  getStartDetail,
  getStartDetailStream,
  chatStream
}; 