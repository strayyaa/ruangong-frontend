import axios from 'axios';

const instance = axios.create({
    // baseURL: '#咱们的后端域名',
    baseURL: 'http://10.192.53.103:8080',
    timeout: 50000, // 设置请求超时时间
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
    }
});

// 添加响应拦截器
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // 处理响应错误
            console.error('Response Error:', error.response);
        } else if (error.request) {
            // 处理请求错误
            console.error('Request Error:', error.request);
        } else {
            // 处理其他错误
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;