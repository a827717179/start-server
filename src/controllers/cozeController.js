const cozeService = require('../services/cozeService');

/**
 * 获取起始详情控制器
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
const getStartDetail = async (req, res) => {
  try {
    const params = req.body;
    
    // 参数验证
    if (!params || Object.keys(params).length === 0) {
      return res.status(400).json({
        "code": 400,
        "data": null,
        "message": '请求参数不能为空'
      });
    }
    
    // 调用服务获取结果
    const result = await cozeService.getStartDetail(params);
    
    console.log('处理结果', result);

    return res.status(200).json({
      "code": 200,
      "data": JSON.parse(result.data),
      "message": result.msg
    });
  } catch (error) {
    console.error('处理请求失败:', error);
    
    return res.status(500).json({
      "code": 500,
      "data": null,
      "message": error.message
    });
  }
};

/**
 * 获取起始详情控制器（流式）
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
const getStartDetailStream = async (req, res) => {
  try {
    const params = req.body;
    
    // 参数验证
    if (!params || Object.keys(params).length === 0) {
      return res.status(400).json({
        "code": 400,
        "data": null,
        "message": '请求参数不能为空'
      });
    }

    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // 获取流式响应
    const stream = await cozeService.getStartDetailStream(params);
    
    // 处理流式数据
    for await (const chunk of stream) {
      // 如果客户端断开连接，停止发送数据
      if (res.writableEnded) {
        break;
      }
      
      if (chunk) {
        // 发送数据到客户端
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    }
    
    // 发送结束信号
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('处理流式请求失败:', error);
    
    // 如果响应头尚未发送，则返回错误信息
    if (!res.headersSent) {
      return res.status(500).json({
        "code": 500,
        "data": null,
        "message": error.message
      });
    }
    
    // 如果响应头已发送，则在流中发送错误信息
    res.write(`data: ${JSON.stringify({
      error: true,
      message: error.message
    })}\n\n`);
    res.end();
  }
};

/**
 * 聊天控制器（流式）
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
const chatStreamController = async (req, res) => {
  try {
    const { content, userId } = req.body;
    
    // 参数验证
    if (!content) {
      return res.status(400).json({
        "code": 400,
        "data": null,
        "message": '聊天内容不能为空'
      });
    }

    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // 获取聊天流式响应
    const stream = await cozeService.chatStream(content, userId || '123456789');
    
    // 处理流式数据
    for await (const chunk of stream) {
      // 如果客户端断开连接，停止发送数据
      if (res.writableEnded) {
        break;
      }
      
      if (chunk) {
        // 发送数据到客户端
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    }
    
    // 发送结束信号
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('处理聊天流式请求失败:', error);
    
    // 如果响应头尚未发送，则返回错误信息
    if (!res.headersSent) {
      return res.status(500).json({
        "code": 500,
        "data": null,
        "message": error.message
      });
    }
    
    // 如果响应头已发送，则在流中发送错误信息
    res.write(`data: ${JSON.stringify({
      error: true,
      message: error.message
    })}\n\n`);
    res.end();
  }
};

/**
 * 获取图片控制器（非流式）
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
const getImgController = async (req, res) => {
  try {
    const params = req.body;
    
    // 参数验证
    if (!params || Object.keys(params).length === 0) {
      return res.status(400).json({
        "code": 400,
        "data": null,
        "message": '请求参数不能为空'
      });
    }

    // 检查必要的参数
    const requiredParams = ['birth', 'sex', 'companion_sex', 'area'];
    for (const param of requiredParams) {
      if (!params[param]) {
        return res.status(400).json({
          "code": 400,
          "data": null,
          "message": `参数 ${param} 是必需的`
        });
      }
    }
    
    // 调用服务获取结果
    const result = await cozeService.getImg(params);

    console.log('处理结果', result);
    
    return res.status(200).json({
      "code": 200,
      "data": JSON.parse(result.data).data,
      "message": result.msg
    });
  } catch (error) {
    console.error('处理图片请求失败:', error);
    
    return res.status(500).json({
      "code": 500,
      "data": null,
      "message": error.message
    });
  }
};

/**
 * 获取图片控制器（流式）
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 */
const getImgStreamController = async (req, res) => {
  try {
    const params = req.body;
    
    // 参数验证
    if (!params || Object.keys(params).length === 0) {
      return res.status(400).json({
        "code": 400,
        "data": null,
        "message": '请求参数不能为空'
      });
    }

    // 检查必要的参数
    const requiredParams = ['birth', 'sex', 'companion_sex', 'area'];
    for (const param of requiredParams) {
      if (!params[param]) {
        return res.status(400).json({
          "code": 400,
          "data": null,
          "message": `参数 ${param} 是必需的`
        });
      }
    }

    // 设置响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // 获取图片流式响应
    const stream = await cozeService.getImgStream(params);
    
    // 处理流式数据
    for await (const chunk of stream) {
      // 如果客户端断开连接，停止发送数据
      if (res.writableEnded) {
        break;
      }
      
      if (chunk) {
        // 发送数据到客户端
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    }
    
    // 发送结束信号
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('处理图片生成请求失败:', error);
    
    // 如果响应头尚未发送，则返回错误信息
    if (!res.headersSent) {
      return res.status(500).json({
        "code": 500,
        "data": null,
        "message": error.message
      });
    }
    
    // 如果响应头已发送，则在流中发送错误信息
    res.write(`data: ${JSON.stringify({
      error: true,
      message: error.message
    })}\n\n`);
    res.end();
  }
};

module.exports = {
  getStartDetail,
  getStartDetailStream,
  chatStreamController,
  getImgController,
  getImgStreamController
}; 