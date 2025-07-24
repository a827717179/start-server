/**
 * Coze API 客户端配置
 */

const auth = require('./auth');

// 使用 PAT 认证获取 API 客户端
const apiClient = auth.authenticateWithPAT();

console.log(`Coze API 客户端已初始化，使用环境: ${auth.currentConfig.COZE_BASE_URL}`);

module.exports = apiClient; 