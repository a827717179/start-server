/**
 * 默认配置文件
 * 包含最小化的API配置
 */

const config = {
  // 中国环境配置 (api.coze.cn)
  cn: {
    COZE_BASE_URL: process.env.COZE_BASE_URL || 'https://api.coze.cn',
    COZE_WORKFLOW_ID: process.env.COZE_WORKFLOW_ID || '7529877789434445833',
    COZE_BOT_ID: process.env.COZE_BOT_ID || '7528335712321044520',
    auth: {
      pat: {
        // 个人访问令牌
        COZE_API_KEY: process.env.COZE_API_KEY || 'pat_jy1zC2WohLYJ5ZPPjYJQfwarQLdOVmw7v8nwFdzMZurD4n1wgtP3jNr5q9WvdfPg'
      }
    }
  }
};

module.exports = config; 