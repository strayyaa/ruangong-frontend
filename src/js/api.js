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
    const res = await instance.post('/api/course/info',{
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

export const sendVerificationCode = async (email) => {
    try {
        console.log('正在发送验证码到邮箱:', email)
        const res = await instance.get('/user/verify', {
            params: {
                mail: email
            }
        })
        console.log('验证码发送响应:', res)
        if (res.status !== 200) {
            throw new Error('验证码发送失败')
        }
        return res.data
    } catch (error) {
        console.error('验证码发送错误:', error.response || error)
        throw new Error(error.response?.data?.message || '验证码发送失败，请稍后重试')
    }
}