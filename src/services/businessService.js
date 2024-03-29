import xhr from './xhr/'

/**
 * 业务 API
 */
class BusinessService {
    /**
     * 创建业务
     * @param data
     * @returns {{pre, visitor}|*}
     */
    createBusiness(data) {
        return xhr({
            method: 'post',
            url: '/business/create',
            params: data
        })
    }

    /**
     * 获取业务列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    fetchList(data) {
        return xhr({
            method: 'get',
            url: '/business/list',
            params: data
        })
    }

    /**
     * 获取业务详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessDetail(data) {
        return xhr({
            method: 'get',
            url: '/business/detail',
            params: data
        })
    }
    genarateBusinessReport(data) {
        return xhr({
            method: 'get',
            url: '/business/report/generate',
            params: data
        })
    }

    /**
     * 获取业务环节详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeDetail(data) {
        return xhr({
            method: 'get',
            url: '/business/node/detail',
            params: data
        })
    }

    /**
     * 获得结束并走向的 选项
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessTransPath(data) {
        return xhr({
            method: 'get',
            url: '/business/trans/path',
            params: data
        })
    }

    /**
     * 获取环节交流历史记录
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeMessages(data) {
        return xhr({
            method: 'get',
            url: '/business/node/messages',
            params: data
        })
    }

    /**
     * 获取动画环节所有功能按钮
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeFunction(data) {
        return xhr({
            method: 'get',
            url: '/business/node/function',
            params: data
        })
    }

    /**
     * 获取业务环节所有素材
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessNodeDocs(data) {
        return xhr({
            method: 'get',
            url: '/business/node/role/docs',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessListNoDel(data) {
        return xhr({
            method: 'get',
            url: '/business/list_nodel',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessListDel(data) {
        return xhr({
            method: 'get',
            url: '/business/list_del',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessDelete(data) {
        return xhr({
            method: 'post',
            url: '/business/delete',
            params: data
        })
    }

    /**
     * 业务
     */
    getBusinessRecovery(data) {
        return xhr({
            method: 'post',
            url: '/business/recovery',
            params: data
        })
    }

    /**
     * 业务
     */
    getUnitUserList(data) {
        return xhr({
            method: 'post',
            url: '/business/getUnitUserList',
            params: data
        })
    }

    /**
     * 获取业务成果
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessResults(data) {
        return xhr({
            method: 'get',
            url: '/business/messages',
            params: data
        })
    }

    /**
     * 获取业务展示列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessDisplayList(data) {
        return xhr({
            method: 'get',
            url: '/business/file/display/list',
            params: data
        })
    }

    /**
     * 获取业务模板
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessTemplates(data) {
        return xhr({
            method: 'get',
            url: '/business/templates',
            params: data
        })
    }

    /**
     * 获取业务所有环节对应笔记
     * @param data
     * @returns {*|{pre, visitor}}
     */
    getBusinessNoteList(data) {
        return xhr({
            method: 'get',
            url: '/business/note/list',
            params: data
        })
    }

    /**
     * 保存业务笔记
     * @param data
     * @returns {{pre, visitor}|*}
     */
    saveBusinessNote(data) {
        return xhr({
            method: 'post',
            url: '/business/note/create',
            params: data
        })
    }

    /**
     * 发送消息到后端
     * @param data
     * @returns {{pre, visitor}|*}
     */
    pushMessage(data) {
        return xhr({
            method: 'post',
            url: '/business/message/push',
            params: data
        })
    }

    /**
     * 发送消息到后端
     * @param data
     * @returns {{pre, visitor}|*}
     */
    saveMessage(data) {
        return xhr({
            method: 'post',
            url: '/business/message/save',
            params: data
        })
    }

    /**
     * 业务
     */
    addMoreTeammates(data) {
        return xhr({
            method: 'post',
            url: '/business/addMoreTeammates',
            params: data
        })
    }

    /**
     * 获取业务角色flash状态
     * @param data
     * @returns {*|{pre, visitor}}
     */
    getBusinessRoleStatus(data) {
        return xhr({
            method: 'get',
            url: '/business/role/status',
            params: data
        })
    }

    /**
     * 获取请入业务角色
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessRoleInList(data) {
        return xhr({
            method: 'get',
            url: '/business/role/in/list',
            params: data
        })
    }

    /**
     * 获取请出业务角色
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getBusinessRoleOutList(data) {
        return xhr({
            method: 'get',
            url: '/business/role/out/list',
            params: data
        })
    }

    /**
     * 获取业务环节可以被安排报告的角色
     * @param data 参数
     * @param data.experiment_id 业务id
     * @param data.node_id 环节id
     * @returns {{pre, visitor}|*}
     */
    getReportRoles(data) {
        return xhr({
            method: 'get',
            url: '/business/role/report/list',
            params: data
        })
    }

    /**
     * 获取业务环节中需要签字的角色
     * @param data 参数
     * @param data.experiment_id 业务id
     * @param data.node_id 环节id
     * @param data.role_id 当前角色id
     * @returns {{pre, visitor}|*}
     */
    querySignRoles(data) {
        return xhr({
            method: 'get',
            url: '/business/request/sign/roles',
            params: data
        })
    }

    /**
     * 获取流程下一步或上一步流程分支
     * @param  {String}
     * @return {Object}
     */
    queryWorkflowTrans(data) {
        return xhr({
            method: 'get',
            url: '/workflow/trans/query',
            params: data
        })
    }

    createPost(data) {
        return xhr({
            method: 'post',
            url: '/business/post/create',
            params: data
        })
    }

    postDetail(data) {
        return xhr({
            method: 'get',
            url: '/business/post/detail',
            params: data
        })
    }

    getPost(data) {
        return xhr({
            method: 'get',
            url: '/business/post',
            params: data
        })
    }

    /**
     * 获取业务列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getExperienceList(data) {
        return xhr({
            method: 'get',
            url: '/business/experience/list',
            params: data
        })
    }

    /**
     * @param data
     * @returns {{pre, visitor}|*}
     */
    postBusinessExperience(data) {
        return xhr({
            method: 'post',
            url: '/business/experience/save',
            params: data
        })
    }

    /**
     * 开始业务跳转项目
     * @param data 参数
     * @param data.business_id 业务id
     * @param data.project_id 要跳转的项目id
     * @param data.data 角色配置数据
     * @returns {{pre, visitor}|*}
     */
    jumpStart(data) {
        return xhr({
            method: 'post',
            url: '/business/jump/start',
            params: data
        })
    }

    removeBusiness(data) {
        return xhr({
            method: 'get',
            url: '/business/remove',
            params: data
        })
    }

    /**
     * 获取业务成果详情
     * @param data
     * @returns {{pre, visitor}|*}
     */
    fetchResults(data) {
        return xhr({
            method: 'get',
            url: '/business/result',
            params: data
        })
    }

    // added by ser
    // edit module api calls
    createBusinessTemplate(data) {
        return xhr({
            method: 'post',
            url: '/business/template/create',
            params: data
        })
    }

    newBusinessTemplate(data) {
        return xhr({
            method: 'post',
            url: '/business/template/new',
            params: data
        })
    }

    templateSign(data) {
        return xhr({
            method: 'post',
            url: '/business/template/sign',
            params: data
        })
    }
    // edit module api calls end

    // display module api calls
    getBusinessStepStatus(data) {
        return xhr({
            method: 'get',
            url: '/business/step/status',
            params: data
        })
    }

    getOwnGUsers(data) {
        return xhr({
            method: 'get',
            url: '/business/getOwnGUsers',
            params: data
        })
    }

    updateBusinessStepStatus(data) {
        return xhr({
            method: 'post',
            url: '/business/step/status/update',
            params: data
        })
    }

    deleteBusinessDisplayFile(data) {
        return xhr({
            method: 'post',
            url: '/business/docs/delete',
            params: data
        })
    }

    getBusinessDocTeamStatus(data) {
        return xhr({
            method: 'get',
            url: '/business/doc/team/status',
            params: data
        })
    }

    getBusinessDocTeamStatus1(data) {
        return xhr({
            method: 'get',
            url: '/business/doc/team/status1',
            params: data
        })
    }

    createBusinessDocTeamStatus(data) {
        return xhr({
            method: 'post',
            url: '/business/doc/team/status/create',
            params: data
        })
    }

    updateBusinessDocTeamStatus(data) {
        return xhr({
            method: 'post',
            url: '/business/doc/team/status/update',
            params: data
        })
    }

    createBusinessDocTeam(data) {
        return xhr({
            method: 'post',
            url: '/business/docs/team/create',
            params: data
        })
    }

    setNoneUser(data) {
        return xhr({
            method: 'post',
            url: '/business/setNoneUser',
            params: data
        })
    }

    getBusinessPrevDocs(data) {
        return xhr({
            method: 'get',
            url: '/business/prev/doc/get',
            params: data
        })
    }

    createBusinessDocFromPrev(data) {
        return xhr({
            method: 'post',
            url: '/business/doc/create/prev',
            params: data
        })
    }

    getSurvey(data) {
        return xhr({
            method: 'get',
            url: '/business/survey',
            params: data
        })
    }

    createOrUpdateSurvey(data) {
        return xhr({
            method: 'post',
            url: '/business/survey/createOrUpdate',
            params: data
        })
    }

    setSurveySelectQuestions(data) {
        return xhr({
            method: 'post',
            url: '/business/survey/setSelectQuestions',
            params: data
        })
    }

    setSurveyBlankQuestions(data) {
        return xhr({
            method: 'post',
            url: '/business/survey/setBlankQuestions',
            params: data
        })
    }

    setSurveyNormalQuestions(data) {
        return xhr({
            method: 'post',
            url: '/business/survey/setNormalQuestions',
            params: data
        })
    }

    publishSurvey(data) {
        return xhr({
            method: 'post',
            url: '/business/survey/publish',
            params: data
        })
    }

    surveyAnswer(data) {
        return xhr({
            method: 'post',
            url: '/business/survey/answer',
            params: data
        })
    }

    surveyPublicList(data) {
        return xhr({
            method: 'get',
            url: '/business/survey/public/list',
            params: data
        })
    }

    surveyPublicDetail(data) {
        return xhr({
            method: 'get',
            url: '/business/survey/public/detail',
            params: data
        })
    }

    surveyReport(data) {
        return xhr({
            method: 'get',
            url: '/business/survey/report',
            params: data
        })
    }


    /**
     * 查询未读留言
     * @param data 参数
     * @param data.from_user_id 发送者id
     */
    unReadBusinessMessage(data) {
        return xhr({
            method: 'get',
            url: '/cms/new/msg-business/num',
            params: data
        })
    }

    /**
     * 发送留言
     * @param data 参数
     * @param data.from_user_id 发送者id
     * @param data.content 发送内容
     * @param data.to_user_ids 发送对象ids
     * @param data.host_id 主题贴ID，回贴时必要
     */
    sendMessage(data) {
        return xhr({
            method: 'post',
            url: '/cms/send/msg-business',
            params: data
        })
    }

    /**
     * 发送留言
     * @param data 参数
     * @param data.from_user_id 发送者id
     * @param data.content 发送内容
     * @param data.to_user_ids 发送对象ids
     * @param data.host_id 主题贴ID，回贴时必要
     */
    getGuiderList(data) {
        return xhr({
            method: 'post',
            url: '/business/getGuiderList',
            params: data
        })
    }

    /**
     * 发送留言
     * @param data 参数
     * @param data.from_user_id 发送者id
     * @param data.content 发送内容
     * @param data.to_user_ids 发送对象ids
     * @param data.host_id 主题贴ID，回贴时必要
     */
    setGuider(data) {
        return xhr({
            method: 'post',
            url: '/business/setGuider',
            params: data
        })
    }

    /**
     * 获取留言的成员表
     * @param data 参数
     * @param data.business_id 业务id
     */
    getSendMembers(data) {
        return xhr({
            method: 'get',
            url: '/cms/to/user/list-business',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    getMessageList(data) {
        return xhr({
            method: 'get',
            url: '/cms/msg/list-business',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    getGuiderMessage(data) {
        return xhr({
            method: 'get',
            url: '/business/getGuiderMessage',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    getChatRooms(data) {
        return xhr({
            method: 'get',
            url: '/business/getChatRooms',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    sendGuiderMessage(data) {
        return xhr({
            method: 'post',
            url: '/business/sendGuiderMessage',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    sendAskMessage(data) {
        return xhr({
            method: 'post',
            url: '/business/sendAskMessage',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    getChatRoomMessages(data) {
        return xhr({
            method: 'post',
            url: '/business/getChatRoomMessages',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    evaluationSave(data) {
        return xhr({
            method: 'post',
            url: '/business/evaluationSave',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    getBusinessGuideList(data) {
        return xhr({
            method: 'get',
            url: '/business/getBusinessGuideList',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    getChatRoomId(data) {
        return xhr({
            method: 'get',
            url: '/business/getChatRoomId',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * @param data.user_id 用户id
     * page/size
     */
    getInitBusinessEvaluation(data) {
        return xhr({
            method: 'get',
            url: '/business/getInitBusinessEvaluation',
            params: data
        })
    }

    /**
     * 获取留言列表信息
     * @param data 参数
     * page/size
     */
    observableNodeList(data) {
        return xhr({
            method: 'get',
            url: '/business/node/observable_list',
            params: data
        })
    }
}

// 实例化后导出，全局单例
export default new BusinessService()
