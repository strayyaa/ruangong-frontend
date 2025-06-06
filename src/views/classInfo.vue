<template>
  <NavBar />
  <div class = "background-layer">
    <h1 :style = "{'margin-top': distance}" class="courseNameTitle" @click="scrollToTop">{{ courseInfo.name }}-{{ classInfo.name }}</h1>
    <p :style = "{opacity:contentOpacity}" class="courseInfoContent">班级代码：{{ classInfo.class_code }}</p>
    <p v-if="status!==null&&status===1" :style = "{opacity:contentOpacity}" class="courseInfoContent">任务完成情况:{{ finishRateOfStu[0] }}/{{ finishRateOfStu[1] }}</p>
    <div v-if="status !==null">
    <el-button
        v-if = "status != 3"
        class="register-btn"
        :style = "{top: distanceOfButton}"
        @mouseenter="registerMouseEnter"
        @mouseleave="registerMouseLeave"
        @click="router.push('/course/'+classInfo.course_id)"
    >->返回课程详情页</el-button>
    <el-button
        v-if = "status === 3"
        class="register-btn"
        :style = "{top: distanceOfButton}"
        @mouseenter="registerMouseEnter"
        @mouseleave="registerMouseLeave"
        @click="chooseClass"
    >选择课程</el-button>
    </div>
    </div>

  <div class="tabs-container">
  <el-tabs v-model="currentTab" class="main-tabs">
      <el-tab-pane  v-for="tab in navItems" :key="tab" :name="tab">
        <template #label>
          <span class = "coponent-title" @click = "scrollToPos" >{{ tab }}</span>
        </template>
        
        <!-- 学生页 -->
        <template v-if="tab === '学生'">
          <div style="margin-left: 20px;margin-top: 10px;">
            <span style="color: rgb(235,235,235);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">搜索学生：</span>
            <el-input
              v-model="searchText"
              placeholder="搜索学生信息"
              clearable
              style="width: 300px; margin-bottom: 20px;"
            />
            <el-button 
            style="margin-left: 30px;margin-right: 20px;margin-top: -17px;scale: 1.2;font-size: 1rem;font-weight: bold;">
            <el-upload style=""
            action="http://101.42.92.21:8080/class/addFile"
            :headers="uploadHeaders"
            :data="uploadData"
            name="file"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            >使用文件导入学生信息</el-upload></el-button>
            <el-button 
            style="margin-left: 30px;margin-right: 20px;margin-top: -17px;scale: 1.2;font-size: 1rem;font-weight: bold;"
            @click="drawerAddStudentBySearch=true">直接搜索学生导入</el-button>

            <el-drawer
                title="直接导入学生"
                v-model="drawerAddStudentBySearch"
                :direction="'rtl'"
                :before-close="(done) => { drawerAddStudentBySearch = false; done(); }"
                style="z-index: 1001;"
                :append-to-body="true"
                :size="'50%'">
                <div style="margin-left: 20px;margin-top: 0px;">
                    <div>
                    <span style="color: rgb(135,135,135);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">搜索学生：</span>
                    <el-input
                        v-model="drawerSearchTextOfStudent"
                        placeholder="搜索信息"
                        clearable
                        style="width: 300px; margin-bottom: 10px;"
                    />
                    </div>
                    <el-card v-for="student in drawerPagedStudent" :key="student.id" class="card">
                    <div class="card-row">
                        <!-- 左侧内容 -->
                        <div class="card-info">
                        <span class="drawer-card-word">{{ student.user_id }}</span>
                        <span class="drawer-card-word">{{ student.username }}</span>
                        <span class="drawer-card-word">{{ student.name }}</span>
                        <span class="drawer-card-word">{{ student.mail }}</span>
                        </div>

                        <!-- 右侧按钮 -->
                        <div class="card-actions">
                            <el-button class="cardButton"><span style="margin-top: 14px;" @click="drawerAddStudent(student.username)">添加</span></el-button>
                        </div>
                    </div>
                    </el-card>
                    <el-pagination
                        v-if="drawerFilteredStudent.length > pageSize"
                        layout="prev, pager, next"
                        :total="drawerFilteredStudent.length"
                        :page-size="pageSize"
                        :current-page="drawerCurrentPageOfStudent"
                        @current-change="handlePageChangeOfStudent"
                        style="margin-top: 20px; text-align: center;">
                    </el-pagination>
                </div>
            </el-drawer>
            
          </div>
          <el-descriptions 
           border style="margin-bottom: 2px;" 
          class="descriptions">
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  <strong>用户名</strong>
                </div>
              </template>
              <div class="descriptions-content">
                姓名
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  邮箱
                </div>
              </template>
              <div class="descriptions-content">
                任务完成率
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                </div>
              </template>
              <div class = "descriptions-label">
                </div>
            </el-descriptions-item>
          </el-descriptions>

          <el-descriptions 
          v-for="student in pagedStudents" :key="student.id" border style="margin-bottom: 2px;" 
          class="descriptions">
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  <strong>{{ student.username }}</strong>
                </div>
              </template>
              <div class="descriptions-content">
                {{ student.name }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  {{ student.mail }}
                </div>
              </template>
              <div class="descriptions-content">
                {{ student.finishRate?.[0] ?? '-' }}/{{ student.finishRate?.[1] ?? '-' }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  <el-button style="scale: 1.2;font-size: 1rem;font-weight: bold;" @click="router.push('/profile/'+student.user_id)">查看学生</el-button>
                </div>
              </template>
              <div class = "descriptions-label">
                  <el-button style="scale: 1.2;font-size: 1rem;font-weight: bold;" @click="deleteStudent(student.user_id)">删除学生</el-button>
              </div>
            </el-descriptions-item>
          </el-descriptions>
          <el-pagination
            v-if="filteredStudents.length > pageSize"
            layout="prev, pager, next"
            :total="filteredStudents.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
            style="margin-top: 20px; text-align: center;"
          />
        </template>

        <!-- 班级页 -->
        <template v-else-if="tab === '进度'">
            <div style="display: flex; height: 100%; background-color: transparent;">
                <!-- 左侧进度选择器 -->
                <div
                style="width: 200px; background-color: transparent; border-right: 1px solid #ccc;
                        overflow-y: auto; height: auto; padding: 8px 0;">
                <el-menu
                    :default-active="selectedProgressId"
                    class="el-menu-vertical-demo"
                    background-color="transparent"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    @select="handleProgressSelect"
                >
                    <el-menu-item
                    v-for="progress in processList"
                    :key="progress.process_id"
                    :index="progress.process_id"
                    >
                    <span style="font-size: 1.5rem;font-weight: bold;">{{ progress.name }}</span>
                    </el-menu-item>
                    <el-menu-item @click="drawerOfCreatingProcess=true">
                        <span style="font-size: 1.5rem;font-weight: bold;">添加进度</span>
                    </el-menu-item>
                    <el-drawer
                        title="创建进度"
                        v-model="drawerOfCreatingProcess"
                        :direction="'rtl'"
                        :before-close="(done) => { drawerOfCreatingProcess = false; done(); }"
                        style="z-index: 1001;"
                        :append-to-body="true">
                        <div style="margin-left: 20px;margin-top: 150px;">
                        <span style="color: rgb(100,100,100);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">输入进度名称：</span>
                        <el-input
                            v-model="createProcessForm.name"
                            placeholder="进度名称"
                            clearable
                            style="width: 300px; margin-bottom: 20px;"
                        />
                        </div>
                        <el-button style="margin-left:20px;margin-top: 10px;background-color:  rgb(80,80,80);color: white;"
                        @click="createProcessSubmit">创建进度</el-button>
                    </el-drawer>
                </el-menu>
                </div>

                <!-- 右侧资源展示区域 -->
                <div
                style="flex: 1; padding: 16px; background-color: transparent;
                        overflow-y: auto; height: 100vh;">
                <!-- 表头 -->
                 <el-empty v-if="processList.length === 0" description="暂无进度，请添加进度"></el-empty>
                <el-card class="card" v-if="processList.length > 0">
                    <div class="card-row" style="display: flex; justify-content: space-between;">
                    <div class="card-info" style="display: flex; flex-wrap: wrap;">
                        <span class="cardWord"><strong>名称</strong></span>
                        <span class="cardWord"><strong>公开</strong></span>
                        <span class="cardWord"><strong>类型</strong></span>
                        <span class="cardWord"><strong>上传时间</strong></span>
                        <span class="cardWord"><strong>类型</strong></span>
                    </div>
                    <div class="card-actions" style="display: flex; align-items: center;">
                        <el-button v-if="status!=1" class="cardButton" @click="drawerOfAddResource=true">导入资源</el-button>
                    </div>
                    <el-drawer
                        title="导入资源"
                        v-model="drawerOfAddResource"
                        :direction="'rtl'"
                        :before-close="(done) => { drawerOfAddResource = false; done(); }"
                        style="z-index: 1001;"
                        :append-to-body="true">
                        <div>
                            <span style="color: rgb(135,135,135);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">选择是否公开：</span>
                            <el-radio-group v-model="createResourceForm.public" style="margin-left: 20px;margin-top: 10px;">
                                <el-radio :value="true">公开</el-radio>
                                <el-radio :value="false">私密</el-radio>
                            </el-radio-group>
                        </div>
                        <div>
                            <span style="color: rgb(135,135,135);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">选择一个Tag：</span>
                            <el-radio-group v-model="createResourceForm.tag" style="margin-left: 20px;margin-top: 10px;">
                                <el-radio v-for="tag in allTags" :key="tag.tag_id" :value="tag.tag_id">{{ tag.name }}</el-radio>
                            </el-radio-group>
                        </div>
                        <div>
                        <span style="color: rgb(135,135,135);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">请确保文件小于1MB</span>
                        </div>
                        <el-button 
                        style="margin-left: 30px;margin-right: 20px;margin-top: 20px;scale: 1.2;font-size: 1rem;font-weight: bold;">
                        <el-upload style=""
                        action="http://101.42.92.21:8080/process/resource/add"
                        :headers="uploadHeaders"
                        :data="uploadDataOfResource"
                        name="data"
                        :show-file-list="false"
                        :on-success="handleUploadSuccessOfResource"
                        :on-error="handleUploadErrorOfResource"
                        >上传并创建资源</el-upload></el-button>
                    </el-drawer>
                    </div>
                </el-card>

                <!-- 资源列表 -->
                <el-card
                    v-for="res in pagedResources"
                    :key="res.res_code"
                    class="card"
                >
                    <div class="card-row" style="display: flex; justify-content: space-between;">
                    <div class="card-info" style="display: flex; flex-wrap: wrap;">
                      <span class="cardWord">{{ res.name }}</span>
                      <span class="cardWord">{{ res.process_id===-1 ? '是' : '否' }}</span>
                      <span class="cardWord">{{ res.type }}</span>
                      <span class="cardWord">{{ res.date.split('T')[0] }}</span>
                      <span class="cardWord">
                      <template v-for="(tagIdx, idx) in String(res.tag).split(',')" :key="tagIdx">
                        {{ allTags[Number(tagIdx)]?.name || allTags[Number(tagIdx)] }}
                        <span v-if="idx !== String(res.tag).split(',').length - 1">, </span>
                      </template>
                    </span>
                    </div>

                    <div class="card-actions" style="display: flex; align-items: center;">
                        <el-button class="cardButton" @click="searchHistory(res.res_id)">查询历史</el-button>
                        <el-button class="cardButton" @click="previewRes(res.url)">预览</el-button>
                        <el-button class="cardButton" @click="downloadRes(res.res_id)">下载</el-button>
                        <el-button class="cardButton" @click="currentResId=res.res_id"><el-upload
                          action="http://101.42.92.21:8080/process/resource/update"
                        :headers="uploadHeaders"
                        :data="uploadDataOfResourceUpdate"
                        name="data"
                        :show-file-list="false"
                        :on-success="handleUploadSuccessOfResourceUpdate"
                        :on-error="handleUploadErrorOfResourceUpdate">更新</el-upload></el-button>
                        <el-button class="cardButton" @click="deleteRes(res.res_id)">删除</el-button>
                    </div>
                    </div>
                </el-card>
                <el-pagination
                    v-if="sampleResources.length > pageSize"
                    layout="prev, pager, next"
                    :total="sampleResources.length"
                    :page-size="pageSize"
                    :current-page="currentPageOfRes"
                    @current-change="handlePageChangeOfRes"
                    style="margin-top: 20px; text-align: center;">
                </el-pagination>
                </div>
            </div>
            <el-drawer
            title="查询文件历史"
            v-model="drawerOfSearchHistory"
            :direction="'btt'"
            :before-close="(done) => { drawerOfSearchHistory = false; done(); }"
            style="z-index: 1001;"
            :append-to-body="true"
            :size="'50%'" >
                <el-card class="card">
                <span class="cardWord"><strong>资源编码</strong></span>
                <span class="cardWord"><strong>名称</strong></span>
                <span class="cardWord"><strong>公开</strong></span>
                <span class="cardWord"><strong>类型</strong></span>
                <span class="cardWord"><strong>上传时间</strong></span>
                <span class="cardWord"><strong>类型</strong></span>
              </el-card>
              <el-card v-for="res in historyResources" :key="res.res_id" class="card">
              <div class="card-row">
                <!-- 左侧内容 -->
                <div class="card-info">
                  <span class="cardWord">{{ res.res_code }}</span>
                  <span class="cardWord">{{ res.name }}</span>
                  <span class="cardWord">{{ res.process_id===-1 ? '是' : '否' }}</span>
                  <span class="cardWord">{{ res.type }}</span>
                  <span class="cardWord">{{ res.date.split('T')[0] }}</span>
                  <span class="cardWord">
                  <template v-for="(tagIdx, idx) in String(res.tag).split(',')" :key="tagIdx">
                    {{ allTags[Number(tagIdx)]?.name || allTags[Number(tagIdx)] }}
                    <span v-if="idx !== String(res.tag).split(',').length - 1">, </span>
                  </template>
                </span>
                </div>

                <!-- 右侧按钮 -->
                <div class="card-actions">
                  <el-button class="cardButton"><span style="margin-top: 14px;" @click="previewRes(res.url)">预览</span></el-button>
                  <el-button class="cardButton"><span style="margin-top: 14px;" @click="downloadRes(res.res_id)">下载</span></el-button>
                </div>
              </div>
            </el-card>
          </el-drawer>
        </template>

        

        <!-- 助教/老师 -->
        <template v-else-if="tab === '助教/老师'">
          <div style="margin-left: 20px;margin-top: 10px;">
            <el-button 
            style="margin-right: 20px;margin-top: -10px;scale: 1.2;font-size: 1rem;font-weight: bold;"
            @click="changeAssAndTea">{{ changeAssandTeaWord }}</el-button>
            <span style="color: rgb(235,235,235);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">搜索{{isAssistant}}：</span>
            <el-input
              v-model="searchTextOfAssAndTea"
              placeholder="搜索信息"
              clearable
              style="width: 300px; margin-bottom: 10px;"
            />
            <el-button 
            style="margin-left:30px;margin-right: 20px;margin-top: -10px;scale: 1.2;font-size: 1rem;font-weight: bold;"
            @click="drawerOfAddAssAndTea=true">为班级添加老师/助教</el-button>

            <el-drawer
                title="添加助教/老师"
                v-model="drawerOfAddAssAndTea"
                :direction="'rtl'"
                :before-close="(done) => { drawerOfAddAssAndTea = false; done(); }"
                style="z-index: 1001;"
                :append-to-body="true">
                <div style="margin-left: 20px;margin-top: 0px;">
                    <el-button 
                    style="margin-right: 20px;margin-top: -30px;scale: 1.2;font-size: 1rem;font-weight: bold;"
                    @click="drawerChangeAssAndTea">{{ drawerButtonChangeAssandTeaWord }}</el-button>
                    <div>
                    <span style="color: rgb(135,135,135);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">搜索{{drawerIsAssistant}}：</span>
                    <el-input
                        v-model="drawerSearchTextOfAssAndTea"
                        placeholder="搜索信息"
                        clearable
                        style="width: 300px; margin-bottom: 10px;"
                    />
                    </div>
                    <el-card v-for="assAndTea in drawerPagedAssAndTea" :key="assAndTea.id" class="card">
                    <div class="card-row">
                        <!-- 左侧内容 -->
                        <div class="card-info">
                        <span class="drawer-card-word">{{ assAndTea.user_id }}</span>
                        <span class="drawer-card-word">{{ assAndTea.username }}</span>
                        <span class="drawer-card-word">{{ assAndTea.name }}</span>
                        <span class="drawer-card-word">{{ assAndTea.mail }}</span>
                        </div>

                        <!-- 右侧按钮 -->
                        <div class="card-actions">
                        <el-button class="cardButton"><span style="margin-top: 14px;" @click="drawerAddAssAndTea(assAndTea.user_id)">添加</span></el-button>
                        </div>
                    </div>
                    </el-card>
                    <el-pagination
                    v-if="drawerFilteredAssAndTea.length > pageSize"
                    layout="prev, pager, next"
                    :total="drawerFilteredAssAndTea.length"
                    :page-size="pageSize"
                    :current-page="drawerCurrentPageOfAssAndTea"
                    @current-change="handlePageChangeOfAssAndTea"
                    style="margin-top: 20px; text-align: center;">
                    </el-pagination>
                </div>
            </el-drawer>
          </div>
          <el-descriptions 
           border style="margin-bottom: 2px;" 
          class="descriptions">
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  用户ID
                </div>
              </template>
              <div class="descriptions-content">
                <strong>用户名</strong>
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  姓名
                </div>
              </template>
              <div class="descriptions-content">
                邮箱
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  班级
                </div>
              </template>
              <div class="descriptions-content">
              </div>
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions 
          v-for="assAndTea in pagedAssAndTea" :key="assAndTea.id" border style="margin-bottom: 2px;" 
          class="descriptions">
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-content">
                  {{ assAndTea.user_id }}
                </div>
              </template>
              <div class="descriptions-content">
                <strong>{{ assAndTea.username }}</strong>
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  {{ assAndTea.name }}
                </div>
              </template>
              <div class="descriptions-content">
                {{ assAndTea.mail }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class = "descriptions-label">
                  <span v-if="assAndTea.classes.length == 0">无</span>
                  <span v-for="(cls,index) in assAndTea.classes" :key="cls">
                    {{ cls }}
                  <span v-if="index!=assAndTea.classes.length-1">, </span>
                  </span>
                </div>
              </template>
              <div class = "descriptions-label">
                
              <el-button style="scale: 1.2;font-size: 1rem;font-weight: bold;" @click="router.push('/profile/'+assAndTea.user_id)">查看用户信息</el-button>
              </div>
            </el-descriptions-item>
          </el-descriptions>
          <el-pagination
            v-if="filteredAssAndTea.length > pageSize"
            layout="prev, pager, next"
            :total="filteredAssAndTea.length"
            :page-size="pageSize"
            :current-page="currentPageOfAssAndTea"
            @current-change="handlePageChangeOfAssAndTea"
            style="margin-top: 20px; text-align: center;"
          />
        </template>

        <!-- 资源页 -->
        <template v-else-if="tab === '任务'">
          <div style="display: flex; height: 100%; background-color: transparent;">
                <!-- 左侧进度选择器 -->
                <div
                style="width: 200px; background-color: transparent; border-right: 1px solid #ccc;
                        overflow-y: auto; height: 100vh; padding: 8px 0;">
                <el-menu
                    :default-active="toChooseTasks"
                    class="el-menu-vertical-demo"
                    background-color="transparent"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    @select="handleTasksSelect"
                >
                    <el-menu-item
                    :key="2"
                    :index="'2'"
                    >
                    <span style="font-size: 1.5rem;font-weight: bold;" v-if="status!=1">未到截止日期</span>
                    <span style="font-size: 1.5rem;font-weight: bold;" v-if="status==1">未开始</span></el-menu-item>
                    <el-menu-item
                    :key="0"
                    :index="'0'" 
                    >
                    <span style="font-size: 1.5rem;font-weight: bold;" v-if="status==1">未完成</span>
                    <span style="font-size: 1.5rem;font-weight: bold;" v-if="status!=1">未批改</span>
                    </el-menu-item>
                    <el-menu-item :key="1"
                    :index="'1'">
                        <span style="font-size: 1.5rem;font-weight: bold;" v-if="status==1">已完成</span>
                        <span style="font-size: 1.5rem;font-weight: bold;" v-if="status!=1">已批改</span>
                    </el-menu-item>
                    <el-menu-item v-if = "status == 0" @click="drawerOfAddTasks=true">
                        <span style="font-size: 1.5rem;font-weight: bold;">添加任务</span>
                    </el-menu-item>
                    <el-drawer
                        title="添加任务"
                        v-model="drawerOfAddTasks"
                        :direction="'rtl'"
                        :before-close="(done) => { drawerOfAddTasks = false; done(); }"
                        style="z-index: 1001;"
                        :append-to-body="true">
                        <div style="margin-left: 20px;margin-top: 0px;">
                            <el-button 
                            style="margin-right: 20px;margin-top: -30px;scale: 1.2;font-size: 1rem;font-weight: bold;"
                            @click="drawerChangePubAndPriTasks">{{ drawerButtonChangePubAndPriTasks }}</el-button>
                            <div>
                            <span style="color: rgb(135,135,135);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">搜索
                                <span v-if="drawerIsPrivate">私有</span><span v-else>公有</span>任务：</span>
                            <el-input
                                v-model="drawerSearchTextOfPubAndPriTasks"
                                placeholder="搜索信息"
                                clearable
                                style="width: 300px; margin-bottom: 10px;"
                            />
                            </div>
                            <el-card class="card">
                            <span class="drawer-card-word"><strong>任务ID</strong></span>
                            <span class="drawer-card-word"><strong>任务名称</strong></span>
                            <span class="drawer-card-word"><strong>创建者</strong></span>
                            </el-card>
                            <el-card v-for="task in drawerPagedPubAndPriTasks" :key="task.id" class="card">
                            <div class="card-row">
                                <!-- 左侧内容 -->
                                <div class="card-info">
                                <span class="drawer-card-word">{{ task.exer_id }}</span>
                                <span class="drawer-card-word">{{ task.name }}</span>
                                <span class="drawer-card-word">{{ task.creator_id }}</span>
                                </div>

                                <!-- 右侧按钮 -->
                                <div class="card-actions">
                                <el-button class="cardButton"><span style="margin-top: 14px;" @click="drawerAddPubAndPriTasks(task.exer_id,task.creator_id)">添加</span></el-button>
                                </div>
                            </div>
                            </el-card>
                            <el-pagination
                            v-if="drawerFilteredPubAndPriTasks.length > pageSize"
                            layout="prev, pager, next"
                            :total="drawerFilteredPubAndPriTasks.length"
                            :page-size="pageSize"
                            :current-page="drawerCurrentPageOfPubAndPriTasks"
                            @current-change="handlePageChangeOfPubAndPriTasks"
                            style="margin-top: 20px; text-align: center;">
                            </el-pagination>
                        </div>
                    </el-drawer>
                    <el-drawer
                        title="添加任务必要信息"
                        v-model="drawerOfTasksAddInfo"
                        :direction="'rtl'"
                        :before-close="(done) => { drawerOfTasksAddInfo = false; done(); }"
                        style="z-index: 1001;"
                        :append-to-body="true">
                        <div><span style="color: rgb(100,100,100);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">输入任务名称：</span><el-input v-model="createTaskForm.name" placeholder="任务名称" style="margin-left: 20px;margin-top: 20px;width: 300px;" /></div>
                         <div><span style="color: rgb(100,100,100);font-size: 1.7rem;font-weight: bold;margin-top: -20px;">选择起止时间：</span></div>
                        <el-date-picker type='datetime' v-model="createTaskForm.begin_time" placeholder="起始时间" />
                        <el-date-picker type="datetime"
                        v-model="createTaskForm.end_time"
                        placeholder="终止时间"
                        />
                        <div>
                            <el-radio-group v-model="createTaskForm.is_multi" style="margin-left: 20px;margin-top: 10px;">
                                <el-radio :value="true">可重复提交</el-radio>
                                <el-radio :value="false">不可重复提交</el-radio>
                            </el-radio-group>
                            <el-radio-group v-model="createTaskForm.to_everyClass" style="margin-left: 20px;margin-top: 10px;">
                                <el-radio :value="true">发布到所有班级</el-radio>
                                <el-radio :value="false">仅发布到当前班级</el-radio>
                            </el-radio-group>
                        </div>
                        <el-button style="margin-left:20px;margin-top: 10px;background-color:  rgb(80,80,80);color: white;"
                        @click="drawerSubmitTask">创建任务</el-button>
                    </el-drawer>
                </el-menu>
                </div>

                <!-- 右侧资源展示区域 -->
                <div
                style="flex: 1; padding: 16px; background-color: transparent;
                        overflow-y: auto; height: 100vh;">
                <!-- 表头 -->
                <el-card class="card" >
                    <div class="card-row" style="display: flex; justify-content: space-between;">
                    <div class="card-info" style="display: flex; flex-wrap: wrap;">
                        <span class="cardWord"><strong>名称</strong></span>
                        <span class="cardWord"><strong>开始时间</strong></span>
                        <span class="cardWord"><strong>结束时间</strong></span>
                        <span class="cardWord"><strong>发布到所有班级</strong></span>
                        <span class="cardWord"><strong>可重复提交</strong></span>
                    </div>
                    </div>
                </el-card>

                <!-- 资源列表 -->
                <el-card
                    v-for="task in pagedTasks"
                    :key="task.id"
                    class="card"
                >
                    <div class="card-row" style="display: flex; justify-content: space-between;">
                    <div class="card-info" style="display: flex; flex-wrap: wrap;">
                        <span class="cardWord">{{ task.name }}</span>
                        <span class="cardWord">{{ task.begin_time.split('T')[0] + ';' + (task.begin_time.split('T')[1]?.split('.')[0] || '')}}</span>
                        <span class="cardWord">{{ task.end_time.split('T')[0] + ';' + (task.end_time.split('T')[1]?.split('.')[0] || '') }}</span>
                        <span class="cardWord">{{ task.is_public }}</span>
                        <span class="cardWord">{{ task.is_multi }}</span>
                    </div>
                    <div v-if = "status==0||status == 2" class = "card-actions" style="display:flex;flex-wrap:wrap;">
                        <el-button class="cardButton" @click="router.push('/showExerInfo/'+task.exer_id)">查看任务</el-button>
                        <el-button class="cardButton" v-if = "toChooseTasks==2" @click="drawerShowFinishRate(task.exer_id)">完成情况</el-button>
                         <el-button class="cardButton" v-if = "toChooseTasks==1" @click="downloadReportOfAssAndTea(task.exer_id)">下载反馈报告</el-button>
                        <el-button class="cardButton" v-if="toChooseTasks == 0 && task.reach_time" @click="router.push('/checkTaskList/'+task.exer_id)">批改任务</el-button>
                    </div>
                    <div v-if = "status==1" class = "card-actions" style="display:flex;flex-wrap:wrap;">
                        <el-button class="cardButton" v-if="toChooseTasks == 0 && task.reach_time" >已经截止</el-button>
                        <el-button class="cardButton" v-if="toChooseTasks == 0 && !task.reach_time" @click="router.push('/doTask/'+task.exer_id)">去完成</el-button>
                        <el-button class="cardButton" v-if="toChooseTasks == 1 && !task.reach_time && task.is_multi" @click="router.push('/doTask/'+task.exer_id)">去完成</el-button>
                        <el-button class="cardButton" v-if="toChooseTasks == 1 && !task.reach_time && !task.is_multi">已提交</el-button>
                        <el-button class="cardButton" v-if="toChooseTasks == 1 && task.reach_time" @click="goToLookCheckDetail(task.exer_id)">查看批改信息</el-button>
                    </div>
                    </div>
                </el-card>
                <el-pagination
                    v-if="filteredTasks.length > pageSize"
                    layout="prev, pager, next"
                    :total="filteredTasks.length"
                    :page-size="pageSize"
                    :current-page="currentPageOfTasks"
                    @current-change="handlePageChangeOfTasks"
                    style="margin-top: 20px; text-align: center;">
                </el-pagination>
                <el-drawer
                    title="学生完成任务情况"
                    v-model="drawerOfShowFinishRate"
                    :direction="'rtl'"
                    :before-close="(done) => { drawerOfShowFinishRate = false; done(); }"
                    style="z-index: 1001;"
                    :append-to-body="true">
                    <el-card class="card">
                        <span class="drawer-card-word"><strong>用户名</strong></span>
                        <span class="drawer-card-word"><strong>姓名</strong></span>
                        <span class="drawer-card-word"><strong>是否完成</strong></span>
                    </el-card>
                    <el-card v-for="stu in showStudentFinishRate[0]" :key="stu.user_id" class="card">
                        <div class="card-row">
                            <!-- 左侧内容 -->
                            <div class="card-info">
                                <span class="drawer-card-word">{{ stu.username }}</span>
                                <span class="drawer-card-word">{{ stu.name }}</span>
                                <span class="drawer-card-word">是</span>
                            </div>
                        </div>
                    </el-card>
                    <el-card v-for="stu in showStudentFinishRate[1]" :key="stu.user_id" class="card">
                        <div class="card-row">
                            <!-- 左侧内容 -->
                            <div class="card-info">
                                <span class="drawer-card-word">{{ stu.username }}</span>
                                <span class="drawer-card-word">{{ stu.name }}</span>
                                <span class="drawer-card-word">否</span>
                            </div>
                        </div>
                    </el-card>
                </el-drawer>
                </div>
            </div>
        </template>
      </el-tab-pane>
      <!-- <div style="height: 45vh;"></div> -->
    </el-tabs>
    
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,computed,inject } from 'vue';
import NavBar from '../components/NavBar.vue';
import { useRoute } from 'vue-router';
import router from '../router';
import { getCourseInfoById,getUserCourses,getClassInfoById, getStudentListByClassIdAndCourseId,fetchAllStudents, deleteStudentFromClass, addStudentToClassById, getProcessesByClassId, addProcessByClassId, getResourcesByProcessId,getAllTags,getHistoryByResourceId,downloadResource, getAssAndTeaByClassId, getTeacherListByCourseId, addAssAndTeaToClass,getClassOfAssAndTeaOfCourse, chooseClassByClassId, getTaskListByClassId,  getUnCheckedTaskListByCourseId, getUnDoneTaskListOfAllOfStudent, getAllPrivateTasks, getAllPublicTasks, submitTaskToClass, generateReportOfTaskOfAssAndTea, generateReportOfTaskOfStu, deleteResource, getFinishRateOfStudent, getTaskFinishStudent } from '../js/api.js';
import { animate } from 'animejs'
import { ElMessage, useTransitionFallthroughEmits } from 'element-plus';
import { Base64 } from 'js-base64';
import { el } from 'element-plus/es/locales.mjs';

const route = useRoute();
const classId = ref(0);
const courseId = ref(0);
const status = ref(null); // 更换以模拟不同身份：0老师、1学生、2助教、3学生未选课、4无关老师
const userAllCourses = ref([]);
const judgeStatus = async () => {
  const userId = localStorage.getItem('userId');
  const rawStatus = Number(localStorage.getItem('userIdentity')); // 原始身份
  const cid = Number(courseId.value);

  console.log("当前用户ID:"+userId);
  const res = await getUserCourses(userId);
  if (!res.success) {
    ElMessage({
      message: '获取用户课程失败',
      type: 'error',
      duration: 2000
    });
    return;
  }
  userAllCourses.value = res.data;
  console.log("用户所属所有课程:", userAllCourses.value);

  if (rawStatus === 0) {
    // 老师
    // userAllCourses.value 是课程id数组
    const courseList = userAllCourses.value[0];
    if (courseList && courseList.some(c => c.course_id === cid)) {
      status.value = 0; // 老师且与该课有关
    } else {
      status.value = 4; // 老师但与该课无关
    }
  } else if (rawStatus === 1) {
    // 学生
    // userAllCourses.value 是 [学生课程列表, 助教课程列表]
    const [studentCourses, assistantCourses] = userAllCourses.value;
    const inStudent = studentCourses && studentCourses.some(c => c.course_id === cid);
    const inAssistant = assistantCourses && assistantCourses.some(c => c.course_id === cid);
    if (inStudent) {
      status.value = 1; // 学生
    } else if (inAssistant) {
      status.value = 2; // 助教
    } else {
      status.value = 3; // 学生未选课
    }
  }
  // 测试用
  // status.value = 0;
  console.log("身份状态:", status.value);
}
const finishRateOfStu = ref([]);
const getFinishRate = async()=>{
  const res = await getFinishRateOfStudent(localStorage.getItem('userId'),courseId.value,targetClass.value.class_id);
  if(res.success){
    finishRateOfStu.value = res.data;
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}

const distance = ref('140px');
const distanceOfButton = ref('630px');
const contentOpacity = ref(1);

const handleScroll = () => {
  const currentScroll = window.pageYOffset;

  const scrollProgress = Math.min(currentScroll / 500, 1);
  distance.value = `${Math.max(140 - scrollProgress * 140,80)}px`;
  distanceOfButton.value = `${Math.max(630 - currentScroll, 110)}px`;
  contentOpacity.value = Math.max(0, 1 - scrollProgress);
};

const scrollToPos = () =>{
  window.scrollTo({
    top: 500,
    behavior: 'smooth'
  });
}
const scrollToTop = () =>{
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
} 


const courseInfo = ref({
  course_id: 0,
  name: '计算机组成原理',
  creator_id: 0,
  syllabus: '主要讲解CPU与内存的交互原理、指令流水线等内容。长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-长度测试-',
  assMethod: '闭卷 + 实验报告',
  score: 3,
  time: 48
});
const classInfo = ref({
    class_id:0,
    name:'A班',
    course_id:0,
    class_code:'C101',
})

const getCourse = async (id) => {
  const res = await getCourseInfoById(id);
  if(res.success){
    courseInfo.value = res.data;
  }else{
    ElMessage({
      message: '获取课程信息失败',
      type: 'error',
      duration: 2000
    });
  }
};
const getClass = async (id) => {
  const res = await getClassInfoById(id);
  if(res.success){
    classInfo.value = res.data;
  }else{
    ElMessage({
      message: '获取班级信息失败',
      type: 'error',
      duration: 2000
    });
  }
};
const chooseClass = async ()=>{
  const res = await chooseClassByClassId(courseId.value,classInfo.value.class_code,localStorage.getItem('userId'));
  if(res.success){
    ElMessage({
      message: '选择班级成功',
      type: 'success',
      duration: 2000
    });
    router.push('/class/'+classInfo.value.class_id);
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}

const registerMouseEnter = () => {
  animate('.register-btn', {
    scale: 1.2,
    backgroundColor: '#FFFFFF', // 改为明确属性
    color: 'rgba(0, 0, 0, 0.8)', // 使用标准rgba格式
    duration: 300,
    easing: 'easeOutExpo'
  });
};

const registerMouseLeave = () => {
  animate('.register-btn', {
    scale: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 统一使用rgba格式
    color: 'rgba(203, 203, 203, 0.8)', // 保持格式一致
    duration: 300,
    easing: 'easeOutExpo'
  });
};

const imgMouseEnter = (str) => {
  animate(str, {
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    duration: 300,
    easing: 'easeOutExpo'
  });
};
const imgMouseLeave = (str) => {
  animate(str, {
    scale: 1,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    duration: 300,
    easing: 'easeOutExpo'
  });
};

const uploadData = computed(() => ({
  user_id: localStorage.getItem('userId'),
  class_id: classId.value
}))

// 如果需要携带 token 或其他 header，可设置
const uploadHeaders = {
  'Authorization': `${localStorage.getItem('token')}`
}
const handleUploadSuccess = async (response) => {
  await getStudentList();
  ElMessage.success('上传成功')
  // 你可以根据 response 做进一步处理
}

const handleUploadError = () => {
  ElMessage.error('上传失败')
}

const drawerAddStudentBySearch = ref(false);
const drawerSearchTextOfStudent = ref('');

const getAllTheStudents = async () => {
  const res = await fetchAllStudents();
  if (res.success) {
    allTheStudents.value = res.data;
  } else {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
};

const allTheStudents = ref([
  { id: 101, username: 'stuA', name: '张三', email: 'zs@mail.com' },
  { id: 102, username: 'stuB', name: '李四', email: 'ls@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
]);

const drawerFilteredStudent = computed(() => {
  const keyword = drawerSearchTextOfStudent.value.trim().toLowerCase()

  return (allTheStudents).value
    .filter(student => {
      // 匹配任意字段
      return Object.values(student).some(value =>
        String(value).toLowerCase().includes(keyword)
      )
    })
    .sort((a, b) => {
      // 先按 class 排序（字符串），再按 id 排序（数字）
      return a.id - b.id
    })
})
const drawerCurrentPageOfStudent = ref(1)
const drawerPagedStudent = computed(() => {
  const start = (drawerCurrentPageOfStudent.value - 1) * pageSize
  return drawerFilteredStudent.value.slice(start, start + pageSize)
})
const drawerAddStudent = async (id) => {
  const res = await addStudentToClassById(courseId.value, classId.value, localStorage.getItem('userId'), id);
  if(res.success){
    await getStudentList();
    drawerAddStudentBySearch.value = false;
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
    return;
  }
  ElMessage({
    message: '添加成功',
    type: 'success',
    duration: 2000
  });
}
const handlePageChangeOfStudent = (page) => {
  drawerCurrentPageOfStudent.value = page
}

const navItems = computed(() => {
    if(status.value == 1){
      return ['进度','助教/老师','任务'];
    }
    if(status.value == 3||status.value == 4) return ['助教/老师'];
    return ['学生','进度','助教/老师','任务'];
    
});

const currentTab = ref('助教/老师');

const searchText = ref('');

const getStudentList = async () => {
  const res = await getStudentListByClassIdAndCourseId(courseInfo.value.course_id,classId.value, localStorage.getItem('userId'));
  if(res.success){
    sampleStudents.value = res.data;
    for(let i = 0; i < sampleStudents.value.length; i++){
      const res = await getFinishRateOfStudent(sampleStudents.value[i].user_id,courseId.value,classId.value);
      if(res.success){
        sampleStudents.value[i].finishRate = res.data;
      }else{
        sampleStudents.value[i].finishRate = [];
        ElMessage({
          message: res.errorMsg,
          type: 'error',
          duration: 2000
        });
      }
    }
  }else{
    ElMessage({
      message: '获取学生列表失败',
      type: 'error',
      duration: 2000
    });
  }
};
const deleteStudent = async(id)=>{
  const res = await deleteStudentFromClass(courseId.value,classId.value,id);
  if(res.success){
    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 2000
    });
    await getStudentList();
  }
}
const sampleStudents = ref([
  { id: 101, username: 'stuA', name: '张三', email: 'zs@mail.com',class: 'C101' },
  { id: 102, username: 'stuB', name: '李四', email: 'ls@mail.com',class: 'C101' },
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com',class:'C102'},
]);
const filteredStudents = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()

  return sampleStudents.value
    .filter(student => {
      // 匹配任意字段
      return Object.values(student).some(value =>
        String(value).toLowerCase().includes(keyword)
      )
    })
    .sort((a, b) => {
      // 先按 class 排序（字符串），再按 id 排序（数字）
      if (a.class < b.class) return -1
      if (a.class > b.class) return 1
      return a.id - b.id
    })
})
const currentPage = ref(1)
const pageSize = 10

const pagedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredStudents.value.slice(start, start + pageSize)
})

const handlePageChange = (page) => {
  currentPage.value = page
}
const getAllProcess = async () => {
  const res = await getProcessesByClassId(courseId.value,classId.value);
  if(res.success){
    processList.value = res.data;
    if(processList.value.length > 0){
      await handleProgressSelect(processList.value[0].process_id);
    }else{
      sampleResources.value = [];
    }
    
  }else{
    ElMessage({
      type:'error',
      message:res.errorMsg
    })
  }
};
const processList = ref([
  { id: 1, name: '实验一',createTime: '2025-05-01'  },
  { id: 2, name: '实验二' ,createTime: '2025-05-01' },
  { id: 3, name: '实验三' ,createTime: '2025-05-01' },
  { id: 4, name: '实验四' ,createTime: '2025-05-01' }
]);
const selectedProgressId = ref(1);
const drawerOfCreatingProcess = ref(false);
const createProcessForm = ref({
    id: 0,
  name: '',
  createTime: '',
});
const createProcessSubmit = async () => {
  if (createProcessForm.value.name.trim() === '') {
    ElMessage({
      message: '进度名称不能为空',
      type: 'warning',
      duration: 2000
    });
    return;
  }
  const res = await addProcessByClassId(createProcessForm.value.name,courseId.value,classId.value,new Date().toISOString().split('T')[0]);
  if(res.success){
    
  }else{
    ElMessage({
      message: '添加进度失败',
      type: 'warning',
      duration: 2000
    });
    return;
  }
  await getAllProcess();
  createProcessForm.value.name = '';
  drawerOfCreatingProcess.value = false;
  ElMessage({
    message: '创建成功',
    type: 'success',
    duration: 2000
  });
};

const sampleResources = ref([
  { id:0,url:"",code: 'R001', name: '实验一', public: true, type: 'PDF', date: '2025-05-01', tag: '实验' },
  { id:0,url:"",code: 'R002', name: '课程通知', public: false, type: 'DOCX', date: '2025-04-28', tag: '通知' },
  { id:0,url:"",code: 'R003', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' },
  { id:0,url:"",code: 'R003', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' },
  { id:0,url:"",code: 'R003', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' },
  { id:0,url:"",code: 'R003', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' }
]);
const handleProgressSelect = async (id) => {
  selectedProgressId.value = id;
  console.log("选择进度"+selectedProgressId.value);
  const res = await getResourcesByProcessId(courseId.value,id);
  if(res.success){
    sampleResources.value = res.data;
  }else{
    ElMessage({
      message: '获取资源列表失败',
      type: 'error',
      duration: 2000
    });
  }
};
const currentPageOfRes = ref(1);
const handlePageChangeOfRes = (page) => {
  currentPageOfRes.value = page
}
const pagedResources = computed(() => {
  const start = (currentPageOfRes.value - 1) * pageSize
  return sampleResources.value.slice(start, start + pageSize)
})
const historyResources = ref([
  { id:0,url:"",code: 'R001', name: '实验一', public: true, type: 'PDF', date: '2025-05-01', tag: '实验' },
  { id:0,url:"",code: 'R001', name: '课程通知', public: false, type: 'DOCX', date: '2025-04-28', tag: '通知' },
  { id:0,url:"",code: 'R001', name: '作业一', public: true, type: 'PDF', date: '2025-05-03', tag: '作业' }
]);

const drawerOfSearchHistory = ref(false);
const searchHistory = async (id) => {
  const res = await getHistoryByResourceId(id);
  if (res.success) {
    historyResources.value = res.data;
  } else {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
  drawerOfSearchHistory.value = true;
}
const previewRes = (url) => {
  window.open('http://101.42.92.21:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
};
const downloadRes = async (id) => {
  const res = await downloadResource(id);
  if (!res.success) {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
    return;
  }
  window.open(res.data);
  ElMessage({
    message: '下载成功',
    type: 'success',
    duration: 2000
  });
}
const deleteRes = async (id) =>{
  const res = await deleteResource(id);
  if(res.success){
    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 2000
    });
    await handleProgressSelect(selectedProgressId.value);
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}
const currentResId = ref(null);
const uploadDataOfResourceUpdate = computed(()=>({
  res_id:currentResId.value,
  is_public:false,
}))
const handleUploadSuccessOfResourceUpdate = async ()=>{
  await handleProgressSelect(selectedProgressId.value);
  ElMessage({
    type:'success',
    message:'更新成功'
  })
}
const handleUploadErrorOfResourceUpdate = (error)=>{
  ElMessage({
    type:'error',
    message:"请上传相同类型的文件"
  })
}
const drawerOfAddResource = ref(false);
const createResourceForm = ref({
  id: 0,
  url: '',
  code: '',
  name: '',
    public: false,
    type: '',
  date: '',
  tag: ''
});
const handleUploadSuccessOfResource = async (response)=>{
  ElMessage({
    type:'success',
    message:'上传成功'
  })
  console.log("上传的资源信息:",createResourceForm.value);
  console.log("上传的资源对应进度：",selectedProgressId.value);
  await handleProgressSelect(selectedProgressId.value);
}
const handleUploadErrorOfResource = (error)=>{
  ElMessage({
    type:'error',
    message:error.response.data.errorMsg
  })
}
const uploadDataOfResource = computed(()=>({
  course_id:courseId.value,
  class_id:classId.value,
  process_id:createResourceForm.value.public?-1:selectedProgressId.value,
  //a List of tag's index if tag in allTags
  tags: createResourceForm.value.tag ? allTags.value.map((tag, index) => tag.tag_id === createResourceForm.value.tag ? index : -1).filter(index => index !== -1) : [],
  is_public:createResourceForm.value.public
}))

const allTags = ref([]);
const fetchAllTags = async () => {
  const res = await getAllTags();
  if (res.success) {
    allTags.value = res.data;
  } else {
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
};
const getClassOfAssAndTea = async(user)=>{
  console.log("id:",user.user_id);
  const res2 = await getClassOfAssAndTeaOfCourse(courseId.value,user.user_id);
  if (res2.success) {
    user.classes = res2.data.map(cls => cls.name);
  } else {
    user.classes = [];
  }
  if (user.identity === 0) {
    sampleTeachers.value.push(user);
  } else if (user.identity === 1) {
    sampleAssistants.value.push(user);
  }
}

const getAssAndTea = async()=>{
  sampleAssistants.value = [];
  sampleTeachers.value = [];
  const res = await getAssAndTeaByClassId(classId.value);
  if(res.success){
    for(const user of res.data){
      await getClassOfAssAndTea(user);
    }
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}

const sampleAssistants = ref([
  { id: 201, username: 'taA', name: '王五', email: 'ww@mail.com',classes:['C101','C102'] },
  { id: 201, username: 'taA', name: '王五', email: 'ww@mail.com',classes:[] }
]);

const sampleTeachers = ref([
  { id: 301, username: 'tchA', name: '赵六', email: 'zl@mail.com',classes:['C101','C102'] }
]);

const isAssistant = ref("助教");
const changeAssandTeaWord = computed(() => {
  if(isAssistant.value == "助教"){
    return "切换到老师";
  }else{
    return "切换到助教";
  }
});
const changeAssAndTea = () => {
  if(isAssistant.value == "助教"){
    isAssistant.value = "老师";
  }else{
    isAssistant.value = "助教";
  }
};
const searchTextOfAssAndTea = ref('');
const filteredAssAndTea = computed(() => {
  const keyword = searchTextOfAssAndTea.value.trim().toLowerCase()

  return (isAssistant.value == "助教" ? sampleAssistants : sampleTeachers).value
    .filter(student => {
      // 匹配任意字段
      return Object.values(student).some(value =>
        String(value).toLowerCase().includes(keyword)
      )
    })
    .sort((a, b) => {
      // 先按 class 排序（字符串），再按 id 排序（数字）
      return a.id - b.id
    })
})
const currentPageOfAssAndTea = ref(1)
const pagedAssAndTea = computed(() => {
  const start = (currentPageOfAssAndTea.value - 1) * pageSize
  return filteredAssAndTea.value.slice(start, start + pageSize)
})
const handlePageChangeOfAssAndTea = (page) => {
  currentPageOfAssAndTea.value = page
}

const getAssAndTeaFromCourse = async ()=>{
  assistantsFromCourse.value = [];
  teachersFromCourse.value = [];
  const res = await getTeacherListByCourseId(courseId.value);
  if(res.success){
    for(const user of res.data){
      if(user.identity === 1){
        assistantsFromCourse.value.push(user);
      }else{
        teachersFromCourse.value.push(user);
      }
    }
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}

const drawerOfAddAssAndTea = ref(false);
const drawerSearchTextOfAssAndTea = ref('');
const assistantsFromCourse = ref([
  { id: 101, username: 'stuA', name: '张三', email: 'zs@mail.com' },
  { id: 102, username: 'stuB', name: '李四', email: 'ls@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
  { id: 103, username: 'stuC', name: '王五', email: 'ww@mail.com'},
]);
const teachersFromCourse = ref([
  { id: 301, username: 'tchA', name: '赵六', email: 'zl@mail.com'}
]);
const drawerIsAssistant = ref("助教");
const drawerButtonChangeAssandTeaWord = computed(() => {
  if(drawerIsAssistant.value == "助教"){
    return "切换到老师";
  }else{
    return "切换到助教";
  }
});
const drawerChangeAssAndTea = () => {
  if(drawerIsAssistant.value == "助教"){
    drawerIsAssistant.value = "老师";
  }else{
    drawerIsAssistant.value = "助教";
  }
};
const drawerFilteredAssAndTea = computed(() => {
  const keyword = drawerSearchTextOfAssAndTea.value.trim().toLowerCase()

  return (drawerIsAssistant.value == "助教" ? assistantsFromCourse : teachersFromCourse).value
    .filter(student => {
      // 匹配任意字段
      return Object.values(student).some(value =>
        String(value).toLowerCase().includes(keyword)
      )
    })
    .sort((a, b) => {
      // 先按 class 排序（字符串），再按 id 排序（数字）
      return a.id - b.id
    })
})
const drawerCurrentPageOfAssAndTea = ref(1)
const drawerPagedAssAndTea = computed(() => {
  const start = (drawerCurrentPageOfAssAndTea.value - 1) * pageSize
  return drawerFilteredAssAndTea.value.slice(start, start + pageSize)
})
const drawerAddAssAndTea = async (id) => {
  const res = await addAssAndTeaToClass(classId.value,id,courseId.value);
  if(res.success){
    await getAssAndTea();
    ElMessage({
      message: '添加成功',
      type: 'success',
      duration: 2000
    });
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
  
}
const getTasksToShowOfAssAndTea = async ()=>{
  tasksToShow.value = [];
  const res = await getTaskListByClassId(courseId.value,classId.value);
  const res2 = await getUnCheckedTaskListByCourseId(localStorage.getItem('userId'),courseId.value);
  if(res.success){
    if(res2.success){
      for(const task of res.data){
        task.is_checked = true;
        const now = new Date();
        const endTime = new Date(task.end_time);
        if(now < endTime){
          task.reach_time = false;
          task.is_checked = false;
        }else{
          task.reach_time = true;
        }
        for(const task2 of res2.data){
          if(task.exer_id === task2.exer_id){
            task.is_checked = false;
            break;
          }
        }
        tasksToShow.value.push(task);
      }
    }else{
      ElMessage({
        message: res2.errorMsg,
        type: 'error',
        duration: 2000
      });
    }
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}
const getTasksToShowOfStudent = async ()=>{
  tasksToShow.value=[];
  const res = await getTaskListByClassId(courseId.value,classId.value);
  const res2 = await getUnDoneTaskListOfAllOfStudent(localStorage.getItem('userId'));
  if(res.success){
    if(res2.success){
      for(const task of res.data){
        task.is_done = true;
        const now = new Date();
        const endTime = new Date(task.end_time);
        const beginTime = new Date(task.begin_time);
        if(now < endTime){
          task.reach_time = false;
        }else{
          task.reach_time = true;
        }
        if(now < beginTime){
          task.before_start = true;
        }else{
          task.before_start = false;
        }
        for(const task2 of res2.data){
          if(task.exer_id === task2.exer_id){
            task.is_done = false;
            break;
          }
        }
        tasksToShow.value.push(task);
      }
    }else{
      ElMessage({
        message: res2.errorMsg,
        type: 'error',
        duration: 2000
      });
    }
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}
const tasksToShow = ref([
    {id:0,begin_time:'2025-05-01',end_time:'2025-05-10',name:'实验一',is_public:true,score:100,is_multi:false,is_done:false,is_checked:false},
    {id:1,begin_time:'2025-05-01',end_time:'2025-05-10',name:'实验二',is_public:true,score:100,is_multi:false,is_done:false,is_checked:false},
    {id:2,begin_time:'2025-05-01',end_time:'2025-05-10',name:'实验三',is_public:false,score:100,is_multi:true,is_done:true,is_checked:true},
]);
const getAllPriTasks = async()=>{
  const res = await getAllPrivateTasks(localStorage.getItem('userId'));
  if(res.success){
    allPrivateTasks.value = res.data;
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }

}
const getAllPubTasks = async()=>{
  const res = await getAllPublicTasks(courseId.value);
  if(res.success){
    allPublicTasks.value = res.data;
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}
const drawerOfShowFinishRate = ref(false);
const showStudentFinishRate = ref([]);
const drawerShowFinishRate = async(id)=>{
  drawerOfShowFinishRate.value = true;
  const res = await getTaskFinishStudent(id);
  if(res.success){
    showStudentFinishRate.value = res.data;
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}
const downloadReportOfAssAndTea = async(id)=>{

  const res = await generateReportOfTaskOfAssAndTea(id);
  
  if(res.success){
    window.open(res.data);
    ElMessage({
      message: '下载成功',
      type: 'success',
      duration: 2000
    });
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
}
const allPrivateTasks = ref([
    {id:0,begin_time:'2025-05-01',end_time:'2025-05-10',name:'实验一',is_public:true,score:100,is_multi:false},
    {id:1,begin_time:'2025-05-01',end_time:'2025-05-10',name:'实验二',is_public:true,score:100,is_multi:false},
    {id:2,begin_time:'2025-05-01',end_time:'2025-05-10',name:'实验三',is_public:false,score:100,is_multi:useTransitionFallthroughEmits},
]);
const allPublicTasks = ref([
    {id:0,begin_time:'2025-05-01',end_time:'2025-05-10',name:'实验一',is_public:true,score:100,is_multi:false,creator_username:"0"},
    {id:1,begin_time:'2025-05-01',end_time:'2025-05-10',name:'实验二',is_public:true,score:100,is_multi:false,creator_username:"0"},
    {id:2,begin_time:'2025-05-01',end_time:'2025-05-10',name:'实验三',is_public:true,score:100,is_multi:true,creator_username:"0"},
]);
const toChooseTasks = ref(0);
const handleTasksSelect = (id) => {
  toChooseTasks.value = id;
//   filteredResources.value = ;
};
const drawerIsPrivate = ref(true);
const drawerButtonChangePubAndPriTasks = computed(() => {
  if(drawerIsPrivate.value){
    return "切换到公开任务";
  }else{
    return "切换到私有任务";
  }
});
const drawerChangePubAndPriTasks = () => {
  if(drawerIsPrivate.value){
    drawerIsPrivate.value = false;
  }else{
    drawerIsPrivate.value = true;
  }
};
const drawerOfAddTasks = ref(false);
const drawerSearchTextOfPubAndPriTasks = ref('');
const drawerFilteredPubAndPriTasks = computed(() => {
  const keyword = drawerSearchTextOfPubAndPriTasks.value.trim().toLowerCase()

  return (drawerIsPrivate.value ? allPrivateTasks : allPublicTasks).value
    .filter(student => {
      // 匹配任意字段
      return Object.values(student).some(value =>
        String(value).toLowerCase().includes(keyword)
      )
    })
    .sort((a, b) => {
      // 先按 class 排序（字符串），再按 id 排序（数字）
      return a.id - b.id
    })
});
const drawerCurrentPageOfPubAndPriTasks = ref(1)
const drawerPagedPubAndPriTasks = computed(() => {
  const start = (drawerCurrentPageOfPubAndPriTasks.value - 1) * pageSize
  return drawerFilteredPubAndPriTasks.value.slice(start, start + pageSize)
})
const handlePageChangeOfPubAndPriTasks = (page) => {
  drawerCurrentPageOfPubAndPriTasks.value = page
}
const drawerOfTasksAddInfo = ref(false);
const createTaskForm = ref({
  id: 0,
  begin_time: '',
  end_time: '',
  name: '',
  creator_id:0,
  to_everyClass:false,
  is_public: false,
  is_multi: false,
  is_done: false,
    is_checked: false
});
const drawerAddPubAndPriTasks = (id,cId) => {
  createTaskForm.value.id = id;
  createTaskForm.value.creator_id = cId;
  drawerOfTasksAddInfo.value = true;
}
const drawerSubmitTask = async () => {
  const res =  await submitTaskToClass(
    createTaskForm.value.id,
    courseId.value,
    classId.value,
    createTaskForm.value.creator_id,
    createTaskForm.value.begin_time,
    createTaskForm.value.end_time,
    createTaskForm.value.is_multi,
    createTaskForm.value.name,
    createTaskForm.value.to_everyClass
  );
  if(res.success){
    getTasksToShowOfAssAndTea();
    drawerOfTasksAddInfo.value = false;
    ElMessage({
      message: '创建成功',
      type: 'success',
      duration: 2000
    });
  }else{
    ElMessage({
      message: res.errorMsg,
      type: 'error',
      duration: 2000
    });
  }
  
}
const filteredTasks = computed(() =>{
    if(status.value == 1){
        if(toChooseTasks.value == 2){
            return tasksToShow.value.filter(task=>task.before_start==true);
        }
        if(toChooseTasks.value == 0){
            return tasksToShow.value.filter(task => task.is_done == false);
        }else{
            return tasksToShow.value.filter(task => task.is_done == true && task.before_start == false);
        }
    }
    if(status.value != 1){
        if(toChooseTasks.value == 2){
            return tasksToShow.value.filter(task=>task.reach_time==false);
        }
        if(toChooseTasks.value == 0){
            return tasksToShow.value.filter(task => task.is_checked == false&& task.reach_time == true);
        }else{
            return tasksToShow.value.filter(task => task.is_checked == true);
        }
    }
})
const pagedTasks = computed(() => {
  const start = (currentPageOfTasks.value - 1) * pageSize
  return filteredTasks.value.slice(start, start + pageSize)
})
const currentPageOfTasks = ref(1);
const handlePageChangeOfTasks = (page) => {
  currentPageOfTasks.value = page
}



const goToProfile = (id) => {
  router.push(`/profile/${id}`);
};

const goToLookCheckDetail = (id)=>{
  router.push(`/showCheckDetail/${id}/${localStorage.getItem('userId')}`);
}

const loading = inject('globalLoading');
onMounted(async() =>  {
  console.log("当前班级id："+classId.value);
  classId.value = route.params.id;
  await getClass(classId.value);
  await getCourse(classInfo.value.course_id);
  courseId.value = classInfo.value.course_id;

  await judgeStatus();

  if(status.value == 1){
    await getFinishRate();
  }
  //助教/老师：获取学生列表
  if(status.value == 0||status.value == 2){
    await getStudentList();
    await getAllTheStudents();
  }
  await getAllProcess();
  await fetchAllTags();

  //获取助教/老师列表
  await getAssAndTea();

  await getAssAndTeaFromCourse();

  if(status.value == 1){
    await getTasksToShowOfStudent();
  }else if(status.value == 0 || status.value == 2){
    await getTasksToShowOfAssAndTea();
    await getAllPriTasks();
    await getAllPubTasks();
  }

  window.addEventListener('scroll', handleScroll)
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<style scoped>
.background-layer {
  position: fixed;
  height: 100vh;
  width:100%;
    background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), 
              url('../assets/course_id_background.jpg');
  background-size: cover;
  margin-top: -80px;
  margin-left: -8px;
  background-position: center;
  z-index: 1;
}
.courseNameTitle {
  position: relative;
  color: rgb(206, 206, 206);
  font-size: 4rem;
  text-align: left;
  
  margin-left: 80px;
  font-weight: bold;
}
.courseInfoContent {
  position: relative;
  color: rgb(206, 206, 206);
  font-size: 1.5rem;
  text-align: left;
  margin-top: 20px;
  margin-left: 80px;
  max-width: 800px;
}
.register-btn {
  position: absolute;
  right: 40px;
  bottom: 60px;
  background-color: rgba(255, 255, 255, 0.1); 
  color: rgba(203, 203, 203, 0.8) ; 
  border: none !important;
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 25px !important;
  backdrop-filter: blur(5px);
  /* transition: all 0.3s ease; */
  /* 添加初始缩放 */
  /* transform: scale(1); */
  /* 防止Element UI覆盖 */
  box-shadow: none !important;
}

.tabs-container {
  position: relative;
  top: 600px;
  max-height: calc(100vh - 170px);
  overflow-y: auto;
  z-index: 1;

  background-color: rgb(255, 255, 255,0.05);
  /* 隐藏滚动条，保留滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.tabs-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari 和新版 Edge */
}


/* 使 tabs 栏固定在容器顶部 */
.main-tabs :deep(.el-tabs__header ) {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color:transparent; /* 可自定义背景 */
  /* color:rgb(255,255,255,1); */
}
.main-tabs :deep(.el-tabs__content) {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE 10+ */
}
.coponent-title {
  color: #c5c5c5;
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 80px;
  margin-right: 80px;
}
.descriptions-label {
  color: #424242;
  font-size: 1.2rem;
  font-weight: bold;
  width: 150px;
}
.descriptions-content{
  color: #424242;
  font-size: 1.2rem;
  width: 150px;
}
.class-box {
  height: 200px;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 上半部分：颜色块 */
.color-block {
  flex: 1;
  height: 140px;
  margin-top: -20px;
  margin-left:-20px;
  margin-right:-20px;
}

/* 下半部分：文字区域 */
.class-code {
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
.tag-selector {
  margin: 20px;
  display: flex;
  flex-wrap: wrap;
}
.card{
  margin-bottom: 5px;
}
.cardWord{
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 10px; 
  display: inline-block;
  width: 100px;
}
.drawer-card-word{
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 10px; 
  display: inline-block;
  width: 60px;
}
.cardButton{
  margin-top: -50px;
  height: 90px;
  width: 100px;
  margin-bottom: -50px;
  margin-right: -22px;
  font-size: 1.1rem;
  transition: all 0.3s ease-in-out !important;
}
.cardButton:hover{
  background-color: rgb(66, 66, 66);
  color: white;
}
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  display: flex;
  flex-wrap: wrap; /* 可换行，也可不加 */
}
.card-actions {
  display: flex;
  gap: 10px;
  margin-right: 10px;
}
.el-menu-vertical-demo {
  background-color: transparent;
  border: none;
}
</style>
