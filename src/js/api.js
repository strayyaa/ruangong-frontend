import instance from  "./axios";

export const getTest = async () => {
    const res = await instance.get('/myapi/test',{
        params:{
            id:1,
            username:'test',
        }
    })
    if (res.status !== 200) {
        throw new Error('请求失败');
    }
    return res.data;
}