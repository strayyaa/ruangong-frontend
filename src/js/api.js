import axios from "axios";
import instance from  "./axios";

export const getTest = async () => {
    const res = await instance.get('https://run.mocky.io/v3/ecef9a81-a4a4-4b7f-8680-a3d25bfa6ece')
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}

export const getUserInfoById = async (userId) => {
    const res = await instance.post('/api/user/info',{
        userId: userId
    })
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}