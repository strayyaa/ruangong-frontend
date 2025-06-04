import axios from "axios";
import instance from  "./axios";
import { ElMessage } from "element-plus";

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
    const res = await instance.get(`/course/info?course_id=${courseId}`)
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
    const res = await instance.get(`/course/self?user_id=${userId}`);
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}

export const getUserTodolist = async (userId, isTeacher, hasAssistantRole) => {
    try {
        if (isTeacher) {
            // 老师调用 exer/self
            const res = await instance.get(`/check/todo?course_id=-1&user_id=${userId}`);
            if (res.status !== 200) {
                throw new Error('请求失败');
            }
            return [res.data.data]; // 返回单个列表的数组
        } else if (hasAssistantRole) {
            // 助教同时调用两个接口
            const [studentRes, assistantRes] = await Promise.all([
                instance.get(`/exer/allTodo?user_id=${userId}`),
                instance.get(`/check/todo?course_id=-1&user_id=${userId}`)
            ]);
            if (studentRes.status !== 200 || assistantRes.status !== 200) {
                throw new Error('请求失败');
            }
            return [studentRes.data.data, assistantRes.data.data]; // 返回两个列表的数组
        } else {
            // 学生调用 exer/allSelf
            const res = await instance.get(`/exer/allTodo?user_id=${userId}`);
            if (res.status !== 200) {
                throw new Error('请求失败');
            }
            return [res.data.data]; // 返回单个列表的数组
        }
    } catch (error) {
        console.error('获取代办列表失败:', error);
        throw error;
    }
}

export const getUserTasks = async (userId, isTeacher, hasAssistantRole) => {
    try {
        if (isTeacher) {
            // 老师调用 exer/self
            const res = await instance.get(`/exer/self?user_id=${userId}`);
            if (res.status !== 200) {
                throw new Error('请求失败');
            }
            return [res.data.data]; // 返回单个列表的数组
        } else if (hasAssistantRole) {
            // 助教同时调用两个接口
            const [studentRes, assistantRes] = await Promise.all([
                instance.get(`/exer/alldone?user_id=${userId}`),
                instance.get(`/exer/self?user_id=${userId}`)
            ]);
            if (studentRes.status !== 200 || assistantRes.status !== 200) {
                throw new Error('请求失败');
            }
            console.log("作为助教的任务",assistantRes.data.data);
            return [studentRes.data.data, assistantRes.data.data]; // 返回两个列表的数组
        } else {
            // 学生调用 exer/allSelf
            const res = await instance.get(`/exer/alldone?user_id=${userId}`);
            if (res.status !== 200) {
                throw new Error('请求失败');
            }
            return [res.data.data]; // 返回单个列表的数组
        }
    } catch (error) {
        console.error('获取任务列表失败:', error);
        throw error;
    }
}

// 获取用户题目列表
export const getUserQuestions = async (userId, isTeacher, hasAssistantRole) => {
  try {
    if (isTeacher) {
      // 教师身份，获取创建的题目
      console.log('开始获取教师id为',userId,'的题目')
      
      const response = await instance.get(`/problem/self`,{
        params:{
            user_id:userId,
        }
      });
      console.log('响应信息为',response.data.success)
      console.log('题目信息为',response.data.data)
      return [response.data.data || []];
    } else if (hasAssistantRole) {
      // 助教身份，获取作为学生和助教的题目
      const [colloctResponse,wrongResponse, assistantResponse] = await Promise.all([
        instance.get(`/collect/getLike?stu_id=${userId}`),
        instance.get(`/collect/getWrong?stu_id=${userId}`),
        instance.get(`/problem/self?user_id=${userId}`)
      ]);
      //console.log('题目信息为',colloctResponse.data.data,wrongResponse.data.data)
      console.log('获取到的错题列表是',wrongResponse.data.data[0])
      return [colloctResponse.data.data || [],wrongResponse.data.data[0] || [], assistantResponse.data.data || [],wrongResponse.data.data[1] || []];
    } else {
      // 学生身份，获取需要完成的题目
      const [colloctResponse,wrongResponse] = await Promise.all([
        instance.get(`/collect/getLike?stu_id=${userId}`),
        instance.get(`/collect/getWrong?stu_id=${userId}`)
      ]);
      return [colloctResponse.data.data || [],wrongResponse.data.data[0] || [],[],wrongResponse.data.data[1] || []];
    }
  } catch (error) {
    console.error('获取题目列表失败:', error);
    throw new Error(error.response?.data?.message || '获取题目列表失败，请稍后重试');
  }
};
export const getQuestionInfo = async (questionId) => {
    const res = await instance.get(`/problem/info?id=${questionId}`)
    if(res.success===false){
        ElMessage({
            message: res.errorMsg,
            type:'error',
            duration:2000
            });
    }
    return res.data.data;
}

// 获取未批改学生列表
export const getUnmarkedStudents = async (exer_id) => {
    try {
        const res = await instance.get(`/check/stu?exer_id=${exer_id}`);
        if (res.status !== 200) {
            throw new Error('获取未批改学生列表失败');
        }
        return res.data;
    } catch (error) {
        console.error('获取未批改学生列表错误:', error.response || error);
        throw new Error(error.response?.data?.message || '获取未批改学生列表失败，请稍后重试');
    }
};
// 获取批改详情
export const getCheckDetail = async (exer_id, user_id) => {
    try {
        const res = await instance.get(`/check/get?exer_id=${exer_id}&user_id=${user_id}`);
        if (res.status !== 200) {
            throw new Error('获取批改详情失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('获取批改详情错误:', error.response || error);
        throw new Error(error.response?.data?.message || '获取批改详情失败，请稍后重试');
    }
};
// 提交批改
export const pushCheckInfo = async (user_id, exer_id, scores, infos) => {
    try {
        console.log('正在提交批改信息:')
        const res = await instance.post(`/check/push?user_id=${user_id}&exer_id=${exer_id}&scores=${scores}&infos=${infos}`);
        console.log('提交批改响应:', res.data.data);
        if (res.status !== 200) {
            console.log(res.data.errorMsg)
            throw new Error('提交批改失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('提交批改错误:', error.response || error);
        throw new Error(error.response?.data?.message || '提交批改失败，请稍后重试');
    }
};
export const pushWrongQuestion = async(probId,exerId,stuId)=>{
    try {
        const res = await instance.post(`/collect/addWrong?prob_id=${probId}&exer_id=${exerId}&stu_id=${stuId}`);
        console.log('提交错题响应:', res);
        if (res.status !== 200) {
            throw new Error('提交错题失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('提交错题错误:', error.response || error);
        throw new Error(error.response?.data?.message || '提交错题失败，请稍后重试');
    }
}
export const getTeacherNameById = async (userId) => {
    const res = await instance.get(`/user/info?user_id=${userId}`);
    if(res.success===false){
        ElMessage({
            message: res.errorMsg,
            type:'error',
            duration:2000
            });
    }
    console.log('老师的名字为:',res.data.data.name);
    return res.data.data.name;
};

export const getAllCourseList = async () =>{
    try{
        const res = await instance.get('/course/all');
        if (res.status !== 200) {
            throw new Error('获取课程列表失败');
        }
        return res.data.data;
    }catch (error) {
        console.error('获取课程列表错误:', error.response || error);
        throw new Error(error.response?.data?.message || '获取课程列表失败，请稍后重试');
    }
}
export const getExerAllinfoById = async (exerId) => {
    try {
        const res = await instance.get(`/exer/info?exer_id=${exerId}`);
        if (res.status !== 200) {
            throw new Error('获取练习名称失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('获取练习名称错误:', error.response || error);
        throw new Error(error.response?.data?.message || '获取练习名称失败，请稍后重试');
    }
}
export const getExerQuestionById = async (exerId) => {
    try {
        const res = await instance.get(`/exer/get?exer_id=${exerId}`);
        console.log('获取练习题目响应:', res.data.data);
        if (res.status !== 200) {
            throw new Error('获取练习题目失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('获取练习题目错误:', error.response || error);
        throw new Error(error.response?.data?.message || '获取练习题目失败，请稍后重试');
    }
}
export const saveExerciseAnswer = async (exerId, userId, answers) => {
    try {
        console.log('正在暂存练习答案:', { exerId, userId, answers });
        console.log('答案列表',answers.value);
        const res = await instance.post(`/exer/save`,{
            exer_id:exerId,
            user_id:userId,
            anslist:answers.value
        });
        console.log('暂存练习答案响应:', res.data.data);
        if (res.status !== 200) {
            throw new Error('暂存练习答案失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('提交暂存练习答案错误:', error);
        throw new Error(error.response?.data?.message || '暂存失败，请稍后重试');
    }
}

export const submitExercise = async (exerId,userId)=>{
    try {
        console.log('正在提交练习:', { exerId,userId});
        const res = await instance.post(`/exer/submit`,{
            exer_id:exerId,
            user_id:userId
        });
        console.log('提交练习响应:', res.data.data);
        if (res.status !== 200) {
            throw new Error('提交练习失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('提交练习错误:', error);
        throw new Error(error.response?.data?.message || '提交练习失败，请稍后重试');
    }   
}
export const pushCollectProblem = async(probID,stuID) =>{
    try {
        const res = await instance.post(`/collect/addLike?prob_id=${probID}&stu_id=${stuID}`);
        console.log('提交收藏题目响应:', res.data.data);
        if (res.status !== 200) {
            throw new Error('提交收藏题目失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('提交收藏题目错误:', error.response || error);
        throw new Error(error.response?.data?.message || '提交收藏题目失败，请稍后重试');
    }
}
export const deleteCollectProblem = async(probID,stuID)=>{
    try {
        const res = await instance.delete(`/collect/deleteLike?prob_id=${probID}&stu_id=${stuID}`);
        console.log('删除收藏题目响应:', res.data.data);
        if (res.status !== 200) {
            throw new Error('删除收藏题目失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('删除收藏题目错误:', error.response || error);
        throw new Error(error.response?.data?.message || '删除收藏题目失败，请稍后重试');
    }
}
export const getCollectProblem = async(stuID)=>{
    try {
        const res = await instance.get(`/collect/getLike?stu_id=${stuID}`);
        console.log('获取收藏题目响应:', res.data.data);
        if (res.status !== 200) {
            throw new Error('获取收藏题目失败');
        }
        return res.data.data;
    } catch (error) {
        console.error('删除收藏题目错误:', error.response || error);
        throw new Error(error.response?.data?.message || '删除收藏题目失败，请稍后重试');
    }
}