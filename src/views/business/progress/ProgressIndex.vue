<template>
    <div class="progress-index" v-if="userInfo">
        <progress-menu @emit-viewxml="showFlowChart"></progress-menu>
        <div class="container" style="min-height: calc(100vh - 210px); padding: 110px 0 0 0;">
            <router-view v-if="!XMLModal"></router-view>
        </div>
        <view-xml
                :visible="XMLModal && this.$route.params.mode !== '1'"
                :xml="flowChart.xml"
                :options="flowChart.options"
                @on-close="onCloseXML"
        ></view-xml>
        <loading v-if="loaderShow"></loading>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex";
    import businessService from "@/services/businessService";
    import Loading from "@/components/loading/FullLoading";
    import ViewXml from "@/components/workflowXML/ViewXML";
    import ProgressMenu from "@/components/business/progress/Menu";
    import * as actionCmd from "@/components/business/common/actionCmds";
    import {
        STORAGE_KEY_EXP_PARAM,
        STORAGE_KEY_CURRENT_ROLE
    } from "@/store/storageKey";

    let actionForFreshen = [
        actionCmd.ACTION_ROLE_SCHEDULE_REPORT,
        actionCmd.ACTION_ROLE_TOWARD_REPORT,
        actionCmd.ACTION_ROLE_END_REPORT,
        actionCmd.ACTION_ROLE_SHOW,
        actionCmd.ACTION_ROLE_HIDE,
        actionCmd.ACTION_ROLE_STAND,
        actionCmd.ACTION_ROLE_SITDOWN,
        actionCmd.ACTION_ROLE_BANNED,
        actionCmd.ACTION_DOC_APPLY_SHOW_OPT,
        actionCmd.ACTION_DOC_APPLY_SUBMIT_OPT,
        actionCmd.ACTION_ROLE_LETIN,
        actionCmd.ACTION_ROLE_LETOUT
    ];
    let actionForWaiting = [
        actionCmd.ACTION_BUSINESS_RESTART,
        actionCmd.ACTION_BUSINESS_BACK,
        actionCmd.ACTION_BUSINESS_FINISH,
        actionCmd.ACTION_BUSINESS_NODE_END
    ];
    export default {
        name: "progress-index",
        components: {Loading, ViewXml, ProgressMenu},
        sockets: {
            connect() {
            },
            getMessage(msg) {
                msg = msg.result;
                if (msg.business != this.metaInfo.businessID) {
                    return;
                }
                if (this.$route.name === "wait") {
                    if (actionForWaiting.indexOf(msg.ext.cmd) > -1) {
                        this.messageHandler(msg.ext, msg);
                    }
                    return;
                }

                // 处理非动画命令
                if (msg.ext.cmd && msg.ext.cmd !== "") {
                    this.messageHandler(msg.ext, msg);
                }
                // 需要更新的动作
                if (actionForFreshen.indexOf(msg.ext.cmd) > -1) {
                    this.fetchBusinessNodeFunction();
                }

                // 需要刷新按钮状态的命令
                this.dispatchFlashAction(msg);
                if (
                    this.currentRoleAllocation.sitting_status === 2 ||
                    (msg.ext.opt && msg.ext.opt.sitting_status === 2)
                ) {
                    this.$store.dispatch("sendMessage", msg);
                }
                // this.$store.dispatch("sendMessage", msg.result);
            }
        },
        filters: {},
        data() {
            return {
                tipModal: 0,
                loaderShow: false,
                nodeTransShow: false,
                XMLModal: false,
                nodeTransTip: "主持人结束了本次环节，即将进入下一环节……",
                flowChart: {
                    xml: "",
                    options: {
                        parttern: 2,
                        currentTask: [],
                        paths: [],
                        user_role_allocs: []
                    }
                },
                taskId: null,
                WebimConn: null,
                metaInfo: {
                    businessID: null,
                    nodeID: null,
                    roleAllocID: null,
                    processType: null
                },
                parallelNodes: [],
                parallelAllocs: []
            };
        },
        created() {
            this.$nextTick(() => {
                this.init();
            });
        },
        computed: {
            ...mapState(["userInfo", "meta"]),
            trans() {
                return this.meta.trans;
            },
            currentRoleAllocation() {
                return this.meta.currentRoleAllocation;
            }
        },
        watch: {
            $route() {
                this.flowChart.options.parttern = 2;
                this.init();
            }
        },
        methods: {
            ...mapActions([
                "getBusinessDetail",
                "getBusinessNodeDetail",
                "setCurrentRoleAllocation",
                "getBusinessNodeMessages",
                "getBusinessNodeFunction",
                "getBusinessNodeDocs",
                "dispatchFlashAction"
            ]),
            init() {
                this.loaderShow = this.$route.name !== "experience";
                this.fetchBusinessDetail();
                if (this.$route.params.mode === '1')
                    this.XMLModal = true;
            },
            fetchBusinessDetail() {
                this.getBusinessDetail({
                    business_id: this.$route.params.bid
                }).then(data => {
                    if (data.role_not_set) {
                        this.$toasted.error(data.role_not_set);
                        this.$router.go(-1);
                    } else {
                        if (data.is_parallel === 0) {
                            this.metaInfo.businessID = data.id;
                            this.metaInfo.nodeID = data.node.id;
                            this.metaInfo.processType = data.node.process_type;

                            if (parseInt(this.$route.params.nid) !== this.metaInfo.nodeID) {
                                this.$router.push({
                                    path: `/business/progress/${this.metaInfo.processType}/${this.metaInfo.businessID}/${this.metaInfo.nodeID}`,
                                });
                            }
                            // this.WebimConnInit(data.huanxin_id);
                            if (data.user_role_allocs.length === 0) {
                                this.loadFlowChart(data.entire_graph);
                                this.getBusinessNodeDocs({
                                    business_id: this.metaInfo.businessID,
                                    node_id: this.metaInfo.nodeID
                                    // role_alloc_id: data.without_node_user_role_alloc_id
                                });
                                this.$router.push({name: "wait"});
                                this.loaderShow = false;
                                return;
                            }
                            this.metaInfo.roleAllocID =
                                data.user_role_allocs && data.user_role_allocs.length > 0
                                    ? data.user_role_allocs[0].alloc_id
                                    : "";
                            this.fetchBusinessNodeDetail();
                        } else {
                            if (this.$route.params.mode === '1') {
                                this.metaInfo.businessID = this.$route.params.bid;
                                this.metaInfo.nodeID = this.$route.params.nid;
                                let node_index = data.node.findIndex(v=>v.id.toString()===this.$route.params.nid);
                                if (node_index === -1)
                                    this.$router.go(-1);
                                this.metaInfo.processType = data.node[node_index].process_type;
                                this.metaInfo.roleAllocID = data.user_role_allocs[node_index][0].alloc_id;
                                this.getBusinessNodeDetail({
                                    business_id: this.metaInfo.businessID,
                                    node_id: this.metaInfo.nodeID,
                                    roleAllocID: this.metaInfo.roleAllocID,
                                });
                                this.setCurrentRoleAllocation(data.user_role_allocs[node_index][0]);
                                this.initAnimationData();
                                this.loaderShow = false;
                                this.XMLModal = false;
                            } else {
                                this.parallelNodes = data.node;
                                this.parallelAllocs = data.user_role_allocs;
                                this.metaInfo.businessID = data.id;
                                this.flowChart.options.user_role_allocs = data.user_role_allocs;
                                this.fetchBusinessNodeDetail(1);
                            }
                        }
                    }
                });
            },
            // 获取功能按钮及其状态
            fetchBusinessNodeFunction() {
                this.$store.dispatch("getBusinessNodeFunction", {
                    business_id: this.metaInfo.businessID,
                    node_id: this.metaInfo.nodeID,
                    role_alloc_id: this.metaInfo.roleAllocID
                });
            },
            fetchBusinessNodeDetail(mode=0) {
                if (mode === 0 &&
                    (!this.metaInfo.businessID ||
                    !this.metaInfo.nodeID ||
                    !this.metaInfo.roleAllocID)
                ) {
                    return;
                }
                // 获取环节详情
                if (mode === 0) {
                    this.getBusinessNodeDetail({
                        business_id: this.metaInfo.businessID,
                        node_id: this.metaInfo.nodeID,
                        roleAllocID: this.metaInfo.roleAllocID,
                    })
                        .then(data => {
                            this.setCurrentRoleAllocation(data.role_allocs[0]);
                            if (this.$route.name !== "experience") {
                                this.loadFlowChart(data.entire_graph);
                            }
                        })
                        .catch(() => {
                            this.$router.go(-1);
                        });
                    this.initAnimationData();
                } else {
                    this.loadFlowChart(1);
                }
            },
            // 加载流程图   type : 显示模式
            loadFlowChart(type) {
                if (type !== 1) {
                    this.loaderShow = false;
                }
                // 完整显示
                if (type === 1) {
                    // 获取流程图数据
                    businessService
                        .getBusinessTransPath({
                            business_id: this.$route.params.bid
                        })
                        .then(data => {
                            this.flowChart.xml = data.xml;
                            this.flowChart.options.currentTask = data.node;
                            // this.flowChart.options.paths = data.paths;
                            this.loaderShow = false;
                            this.XMLModal = true;
                        });
                }
                // 逐步显示
            },
            // 查看流程图
            showFlowChart() {
                // 获取流程图数据
                businessService
                    .getBusinessTransPath({
                        business_id: this.$route.params.bid
                    })
                    .then(data => {
                        this.flowChart.xml = data.xml;
                        this.flowChart.options.parttern = 1;
                        this.flowChart.options.currentTask = data.node;
                        // this.flowChart.options.paths = data.paths;
                        this.XMLModal = true;
                    });
            },
            // 初始化动画（法庭）环节数据
            initAnimationData() {
                // 动画模块数据
                if (this.metaInfo.processType === 1) {
                    // 获取业务历史消息
                    this.getBusinessNodeMessages({
                        business_id: this.metaInfo.businessID,
                        node_id: this.metaInfo.nodeID,
                        is_paging: 0
                    });
                    // 获取功能按钮及其状态
                    this.getBusinessNodeFunction({
                        business_id: this.metaInfo.businessID,
                        node_id: this.metaInfo.nodeID,
                        role_alloc_id: this.metaInfo.roleAllocID
                    });
                }

                // // 投票环节
                // if (this.metaInfo.processType === 5) {
                //     // 获取项目提示
                //     this.$store.dispatch("getBusinessProjectTips", {
                //         business_id: this.metaInfo.businessID,
                //         node_id: this.metaInfo.nodeID,
                //         role_alloc_id: this.metaInfo.roleAllocID,
                //         usage: 7
                //     });
                // }

                // 获取业务素材
                this.getBusinessNodeDocs({
                    business_id: this.metaInfo.businessID,
                    node_id: this.metaInfo.nodeID,
                    role_alloc_id: this.metaInfo.roleAllocID
                });
            },
            onCloseXML(node_seq) {
                if (typeof(node_seq) === 'object') {
                    this.XMLModal = false;
                } else if (node_seq !== null) {
                    this.metaInfo.nodeID = this.parallelNodes[node_seq].id;
                    this.metaInfo.processType = this.parallelNodes[node_seq].process_type;
                    this.metaInfo.roleAllocID =
                        this.parallelAllocs[node_seq] && this.parallelAllocs[node_seq].length > 0
                            ? this.parallelAllocs[node_seq][0].alloc_id
                            : "";
                    this.setCurrentRoleAllocation(this.parallelAllocs[node_seq][0]);
                    this.initAnimationData();
                    this.$router.push({
                        path: `/business/progress/${this.metaInfo.processType}/${this.metaInfo.businessID}/${this.metaInfo.nodeID}/1`
                    });
                } else {
                    this.XMLModal = false;
                }
            },
            nodeTransHandler(tip, action) {
                this.nodeTransTip = tip;
                if (
                    action.opt.status !== 9 &&
                    action.opt.process_type &&
                    action.opt.business_id &&
                    action.opt.node_id
                ) {
                    this.tipModal = 4;
                    this.$route.params.nid = action.opt.node_id;
                    this.XMLModal = false;
                    setTimeout(() => {
                        this.$router.push({
                            path: `/business/progress/${action.opt.process_type}/${action.opt.business_id}/${action.opt.node_id}`
                        });
                        this.tipModal = 0;
                    }, 800);
                }
                if (action.opt.status === 9) {
                    this.tipModal = 5;
                    setTimeout(() => {
                        this.tipModal = 0;
                        if (this.userInfo.identity === 5) {
                            this.$router.push({path: "/business/list/progress"});
                        } else {
                            this.$router.push({path: "/mentor/guide"});
                        }
                    }, 800);
                }
            },
            // 返回消息之后的处理 重新开始、返回上一步、申请提交
            messageHandler(action, msg) {
                switch (action.cmd) {
                    // 重新开始
                    case actionCmd.ACTION_BUSINESS_RESTART:
                        // 当前环节为第一个环节， 页面为刷新，重新获取数据
                        if (action.opt.node_id === parseInt(this.$route.params.nid)) {
                            this.init();
                        }
                        // this.emptyMessage()
                        this.nodeTransHandler(
                            "组长执行了重新开始操作操作，本环节即将重新开始……",
                            action
                        );
                        break;
                    // 返回上一步
                    case actionCmd.ACTION_BUSINESS_BACK:
                        this.nodeTransHandler(
                            "组长执行了返回上一步操作，即将返回上一步……",
                            action
                        );
                        break;
                    // 提前结束
                    case actionCmd.ACTION_BUSINESS_FINISH:
                        this.nodeTransHandler(
                            "组长提前结束了本次环节，即将跳出本业务……",
                            action
                        );
                        // 结束业务清楚session
                        window.sessionStorage.removeItem(STORAGE_KEY_EXP_PARAM);
                        window.sessionStorage.removeItem(STORAGE_KEY_CURRENT_ROLE);
                        break;
                    // 结束并走向
                    case actionCmd.ACTION_BUSINESS_NODE_END:
                        if (action.opt.status === 9) {
                            this.nodeTransHandler(
                                "主持人结束了本次业务，即将跳出本业务……",
                                action
                            );
                        } else {
                            this.nodeTransHandler(
                                "主持人结束了本次环节，即将进入下一环节……",
                                action
                            );
                        }
                        break;
                    // 表达管理
                    case actionCmd.ACTION_ROLE_BANNED:
                        this.$toasted.info(
                            action.opt.control_status === 1
                                ? "主持人取消了表达管理"
                                : "主持人启动了表达管理"
                        );
                        this.$store.dispatch("startRoleBanned", action.opt.control_status);
                        break;
                    // 申请发言处理
                    case actionCmd.ACTION_ROLE_APPLY_SPEAK_OPT:
                        if (
                            this.currentRoleAllocation.alloc_id &&
                            this.currentRoleAllocation.alloc_id ===
                            parseInt(action.opt.role_alloc_id)
                        ) {
                            this.$toasted.error(
                                action.opt.result === 1
                                    ? "主持人同意了您的发言申请"
                                    : "主持人拒绝了您的发言申请"
                            );
                        }
                        break;
                    case actionCmd.ACTION_DOC_APPLY_SHOW_OPT:
                        if (
                            this.currentRoleAllocation.alloc_id &&
                            this.currentRoleAllocation.alloc_id ===
                            parseInt(action.opt.role_alloc_id)
                        ) {
                            this.$toasted.error(
                                action.opt.result === 1
                                    ? "主持人同意了您的展示申请"
                                    : "主持人拒绝了您的展示申请"
                            );
                        }
                        break;
                    case actionCmd.ACTION_DOC_APPLY_SUBMIT_OPT:
                        if (
                            this.currentRoleAllocation.alloc_id &&
                            this.currentRoleAllocation.alloc_id ===
                            parseInt(action.opt.role_alloc_id)
                        ) {
                            this.$toasted.error(
                                action.opt.result === 1
                                    ? "主持人同意了您的提交申请"
                                    : "主持人拒绝了您的提交申请"
                            );
                        }
                        break;
                    case actionCmd.ACTION_SUBMIT_EXPERIENCE:
                        this.$store.dispatch("sendExperience", msg);
                        break;
                    // 投票操作或者结束投票
                    case actionCmd.ACTION_ROLE_VOTE:
                    case actionCmd.ACTION_ROLE_VOTE_END:
                        this.$store.dispatch("updateVoteStatus", msg.ext.opt);
                        break;
                    // 安排报告
                    case actionCmd.ACTION_ROLE_SCHEDULE_REPORT:
                        if (
                            this.currentRoleAllocation.alloc_id &&
                            this.currentRoleAllocation.alloc_id ===
                            parseInt(msg.ext.opt.role_alloc_id)
                        ) {
                            this.$toasted.error("请走向发言席作演讲");
                        }
                        break;
                    // 请入
                    case actionCmd.ACTION_ROLE_LETIN:
                        msg.data =
                            "请入" + action.opt.data.map(role => role.role_name).join("、");
                        break;
                    // 送出
                    case actionCmd.ACTION_ROLE_LETOUT:
                        msg.data = "送出" + action.opt.data.map(role => role.name).join("、");
                        break;
                    // 展示模块提交文件
                    case actionCmd.ACTION_DOC_REFRESH:
                        this.$refs.mainContent.queryExpDisplays();
                        break;
                }
            }
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .progress-index {
    }
</style>
