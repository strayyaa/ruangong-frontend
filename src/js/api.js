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
    const res = await instance.get(`/user/info?user_id=${userId}`)
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}
export const getCourseInfoById = async () => {
    const res = await instance.get('/course/info?course_id=1')
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
export const getCollectQuestion = async (questionId) => {
    const res = await instance.get(`/collect/getLike?stu_id=${questionId}`);
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}

export const getUserCourses = async (userId) => {
    const res = await instance.get(`/course/self?user_id=${userId}`);
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}
