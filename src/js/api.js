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
    try {
        const res = await instance.get(`/user/info?user_id=${userId}`)
        if (res.status !== 200) {
            throw new Error('获取用户信息失败')
        }
        return res.data.data
    } catch (error) {
        console.error('获取用户信息错误:', error.response || error)
        throw new Error(error.response?.data?.message || '获取用户信息失败，请稍后重试')
    }
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
    const res = await instance.post('/class/create',{
        course_id: courseId,
        name: className
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

export const login = async (account, password) => {
    try {
        const res = await instance.post('/user/login', {
            account: account,
            password: password
        })
        console.log(res)
        if (res.status != '200') {
            throw new Error('登录失败')
        }
        // 保存token到localStorage
        if (res.data.data && res.data.data.token) {
            const token = res.data.data.token
            localStorage.setItem('token', token)
            // 设置后续请求的token
            // 保存用户信息
            localStorage.setItem('userId', res.data.data.user.user_id)
            localStorage.setItem('userIdentity', res.data.data.user.identity)
        }
        return res.data
    } catch (error) {
        console.error('登录错误:', error.response || error)
        throw new Error(error.response?.data?.message || '登录失败，请稍后重试')
    }
}

export const getUserCourses = async (userId) => {
    try {
        console.log(`Bearer ${localStorage.getItem("token")}`);
        const res = await instance.get(`/course/self?user_id=${userId}`)
        if (res.status !== 200) {
            throw new Error('获取课程信息失败')
        }
        return res.data.data
    } catch (error) {
        console.error('获取课程信息错误:', error.response || error)
        throw new Error(error.response?.data?.message || '获取课程信息失败，请稍后重试')
    }
}