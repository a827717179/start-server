/**
 * 认证工具类
 * 提供 PAT 认证方式
 */

const { CozeAPI } = require('@coze/api');
const config = require('./config.default');

// 根据环境变量选择配置 (默认为 'cn')
const key = process.env.COZE_ENV || 'cn';

// 获取当前环境的配置
const currentConfig = config[key];

/**
 * 使用个人访问令牌（PAT）认证
 * @returns {CozeAPI} Coze API 客户端实例
 */
const authenticateWithPAT = () => {
  const apiKey = currentConfig.auth.pat.COZE_API_KEY;
  const baseURL = currentConfig.COZE_BASE_URL;
  
  return new CozeAPI({
    token: apiKey,
    baseURL: baseURL
  });
};

module.exports = {
  authenticateWithPAT,
  currentConfig
}; 