const express = require('express');
const router = express.Router();
const cozeController = require('../controllers/cozeController');

// 获取起始详情接口（非流式）
router.post('/getStartDetail', cozeController.getStartDetail);

// 获取起始详情接口（流式）
router.post('/getStartDetailStream', cozeController.getStartDetailStream);

// 聊天接口（流式）
router.post('/chat/stream', cozeController.chatStreamController);

// 获取图片接口（非流式）
router.post('/getImg', cozeController.getImgController);

// 获取图片接口（流式）
router.post('/getImg/stream', cozeController.getImgStreamController);

module.exports = router; 