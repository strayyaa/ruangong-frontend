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
export const getCourseInfoById = async (courseId) => {
    const res = await instance.post('https://run.mocky.io/v3/ce06efdd-c252-4e9d-91a3-4ece89d22129',{
        courseId: courseId
    })
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}
export const createClass = async (courseId, className) => {
    const res = await instance.post('/api/class/create',{
        courseId: courseId,
        className: className
    })
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}
export const getClassInfoById = async (classId) => {
    const res = await instance.post('/api/class/info',{
        classId: classId
    })
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}
export const getClassListByCourseId = async (courseId) => {
    const res = await instance.get('https://run.mocky.io/v3/b69ec206-7076-4464-a67a-d9a7ced5dd4d')
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}
export const loginByUsernameAndPassword = async (username, password) => {
    const res = await instance.post('/api/user/login',{
        username: username,
        password: password
    })
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}