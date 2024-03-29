import xhr from './xhr/'
/**
 * 项目相关的 API
 */
class CourseService {
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getCourseList(data) {
        return xhr({
            method: 'get',
            url: '/course/list',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getCourseFullList(data) {
        return xhr({
            method: 'get',
            url: '/course/full_list',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getOutsideCourseList(data) {
        return xhr({
            method: 'get',
            url: '/course/outside_list',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getHobbyCourseList(data) {
        return xhr({
            method: 'get',
            url: '/course/hobby_list',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    saveNewCourse(data) {
        return xhr({
            method: 'post',
            url: '/course/save_new',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    saveEditCourse(data) {
        return xhr({
            method: 'post',
            url: '/course/save_edit',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getTeacherList(data) {
        return xhr({
            method: 'get',
            url: '/course/get_teacher_list',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    teacherChangeSave(data) {
        return xhr({
            method: 'post',
            url: '/course/save_teacher_change',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    deleteCourse(data) {
        return xhr({
            method: 'post',
            url: '/course/delete_course',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    excelDataSave(data) {
        return xhr({
            method: 'post',
            url: '/course/excel_data_save',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    getInitAttentionData(data) {
        return xhr({
            method: 'get',
            url: '/course/get_init_attention_data',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    checkAttention(data) {
        return xhr({
            method: 'get',
            url: '/course/check_attention',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    sendRequestData(data) {
        return xhr({
            method: 'post',
            url: '/course/send_request_data',
            params: data
        })
    }
    /**
     * 获取流程列表
     * @param data
     * @returns {{pre, visitor}|*}
     */
    sendCancelData(data) {
        return xhr({
            method: 'post',
            url: '/course/send_cancel_data',
            params: data
        })
    }

}

export default new CourseService()
