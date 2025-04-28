import axios from 'axios';

const instance = axios.create({
    baseURL: '#咱们的后端域名',
    timeout: 50000, // 设置请求超时时间
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export default instance;