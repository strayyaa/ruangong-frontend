import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://10.192.53.103:8080/',
    timeout: 50000, // 设置请求超时时间
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        //Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NiIsImlhdCI6MTc0NzkwNDg5OCwiZXhwIjoxNzQ3OTA4NDk4fQ.L9AioC8XWPK8Fy5yjaettzbFitFtM-iUcbvAkAwnTv8',
    },
});

export default instance;