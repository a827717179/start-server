const axios = require('axios');

// 示例请求
const testGetStartDetail = async () => {
  console.log('==========开始请求==========');
  try {
    const response = await axios.post('http://192.168.220.68:3000/api/getStartDetail', {
      birth: "2001-08-09 12:23:12",
      sex: "man"
    });
    console.log('==========请求结束==========');
    console.log('响应结果:', response.data);
  } catch (error) {
    console.log('==========请求失败==========');
    console.error('请求失败:', error.response ? error.response.data : error.message);
  }
};

testGetStartDetail(); 