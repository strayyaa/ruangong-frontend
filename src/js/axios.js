import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://10.192.53.103:8080',
    timeout: 50000, // 设置请求超时时间
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export default instance;