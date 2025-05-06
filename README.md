## START:

Based on vite
use `npx vite` to start

### 设计时页面逻辑参考原型设计文件（以markdown文件为最新版）！
### 如果想要测试某些功能，到test.vue里测试，网址为/test43906

### 分工：
唐皓涵 ：1./register2./login3.个人详情信息页面/profile（显示个人信息，上传头像，修改密码等）
程宇繁：/，/createTask,/createCourse,/createQuestion,/course{id},/class{id}
付东淏：/home,/courses,/tasks,/questions,/task{id},/doTask，/checkTask 
待定：file预览，报告，批改作业，

### git push:
When meeting problem like:`Failed to connect to github.com port 443 after 21088 ms: Could not connect to server` while VPN is on,use code below before push:

```
git config --global http.proxy 127.0.0.1:<Your Port>
git config --global https.proxy 127.0.0.1:<Your Port>
```

### 存储用户信息有关：

使用 `localStorage`,以`localStorage.getItem('userId')`和`localStorage.getItem('userIdentity')`分别访问到用户的id和用户的身份（1为学生，0为教师）。如果要使用其他方式，请顺便修改 `index.js`中有关页面导航的逻辑。
目前页面导航（禁止未登录时访问/和/login、/register之外网站）逻辑因为测试未启用。

### 网站设计参考：
`https://www.awwwards.com/`：国外的一个网页设计评分网站，相对比较高级。
