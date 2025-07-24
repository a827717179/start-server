/**
 * 认证相关路由
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { auth } = require('../config/coze');

// 保存状态参数，用于验证 OAuth 回调（实际项目中应使用数据库或 Redis 存储）
const stateStore = new Map();

/**
 * 获取 OAuth 授权 URL
 */
router.get('/oauth/url', (req, res) => {
  // 生成随机状态参数
  const state = crypto.randomBytes(16).toString('hex');
  const authUrl = auth.getOAuthWebAuthUrl(state);
  
  // 存储状态参数
  stateStore.set(state, { timestamp: Date.now() });
  
  res.json({
    success: true,
    authUrl
  });
});

/**
 * OAuth 回调处理
 */
router.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // 验证状态参数
  if (!state || !stateStore.has(state)) {
    return res.status(400).json({
      success: false,
      message: '无效的状态参数'
    });
  }
  
  try {
    // 清除存储的状态参数
    stateStore.delete(state);
    
    // 获取访问令牌
    const tokenResponse = await auth.getOAuthWebToken(code);
    
    if (tokenResponse.error) {
      return res.status(400).json({
        success: false,
        message: tokenResponse.error_description || '获取访问令牌失败'
      });
    }
    
    // 存储访问令牌（实际项目中应安全存储）
    const { access_token, refresh_token, expires_in } = tokenResponse;
    
    // 返回令牌信息
    res.json({
      success: true,
      message: '授权成功',
      data: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in
      }
    });
  } catch (error) {
    console.error('OAuth 回调处理失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

/**
 * JWT 认证示例
 */
router.get('/jwt/test', (req, res) => {
  try {
    // 使用 JWT 认证获取客户端
    // 注意：实际使用时需要配置正确的私钥
    const jwtClient = auth.authenticateWithJWT();
    
    res.json({
      success: true,
      message: 'JWT 认证成功'
    });
  } catch (error) {
    console.error('JWT 认证失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

module.exports = router; 