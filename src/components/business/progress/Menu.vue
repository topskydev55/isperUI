<template>
  <div class="progress-menu main-bg" style="height: 100%; overflow: auto">
    <TopHeader>
      <template v-slot:pageMenu>
        <b-nav-item>
          <dropdown>
            <template slot="btn">ISPER助手</template>
            <template slot="icon">
              &nbsp;
              <icon name="caret-down"></icon>
            </template>
            <template slot="body">
              <ul>
                <li>
                  <span v-if="unReadMsgCount != 0" class="tipCount">({{unReadMsgCount}})</span>
                  <a href="javascript:;">环节提示</a>
                </li>
                <li>
                  <dropdown :trigger="'click'" :role="'sublist'" :align="'right'">
                    <template slot="btn">
                      指导交流
                      <span v-if="unReadMsgCount != 0" class="tipCount">({{unReadMsgCount}})</span>
                    </template>
                    <template slot="body">
                      <ul>
                        <li>
                          <a href="javascript:;" @click="sendMsg">发送留言</a>
                        </li>
                        <li>
                          <a href="javascript:;" @click="receiveMsgList">
                            留言面板
                            <span
                              v-if="unReadMsgCount != 0"
                              class="tipCount"
                            >({{unReadMsgCount}})</span>
                          </a>
                        </li>
                      </ul>
                    </template>
                  </dropdown>
                </li>
              </ul>
            </template>
          </dropdown>
        </b-nav-item>
        <b-nav-item>
          <dropdown>
            <template slot="btn">查看</template>
            <template slot="icon">
              &nbsp;
              <icon name="caret-down"></icon>
            </template>
            <template slot="body">
              <ul>
                <li>
                  <a href="javascript:;" @click="viewBusinessResult">业务成果</a>
                </li>
                <li>
                  <a href="javascript:;" @click="viewSubmittedFile">已提交文件</a>
                </li>
                <li>
                  <a href="javascript:;" @click="viewResultsRef">成果参考</a>
                </li>
                <li>
                  <a href="javascript:;" v-if="userInfo.identity == 5" @click="viewMyNotes">我的笔记</a>
                </li>
              </ul>
            </template>
          </dropdown>
        </b-nav-item>
        <b-nav-item>
          <dropdown>
            <template slot="btn">工具</template>
            <template slot="icon">
              &nbsp;
              <icon name="caret-down"></icon>
            </template>
            <template slot="body">
              <ul>
                <li>
                  <a
                    href="javascript:;"
                    :class="{'disabled': !metaInfo.can_switch}"
                    @click="switchView"
                  >切换视角</a>
                </li>
                <li>
                  <a href="javascript:;" @click="showFlowChart">查看流程图</a>
                </li>
              </ul>
            </template>
          </dropdown>
        </b-nav-item>
        <!-- <b-nav-item v-if="userInfo&&userInfo.id&&currentRoleAllocation.can_terminate">
                            <dropdown>
                                <template slot="btn">操作</template>
                                <template slot="icon">
                                    &nbsp;
                                    <icon name="caret-down"></icon>
                                </template>
                                <template slot="body">
                                    <ul>
                                        <li>
                                            <a href="javascript:;" @click="restartBusiness()">重新开始</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;" @click="endBusiness()">提前结束</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;" @click="backLastHandler()">返回上一步</a>
                                        </li>
                                    </ul>
                                </template>
                            </dropdown>
        </b-nav-item>-->
        <b-nav-item
          v-if="metaInfo && metaInfo.process_type === 1"
          @click="showProjectGuideModal = true"
        >操作指南</b-nav-item>
        <b-nav-item
          v-if="metaInfo && metaInfo.process_type === 1"
          @click="showProjectDocsModal = true"
        >项目素材</b-nav-item>
        <b-nav-item
          v-if="userInfo.position && userInfo.position.id"
          :to="'/student/enter-business/' + $route.params.bid"
        >课堂讨论组</b-nav-item>
        <b-nav-item @click="guiderSelect()">业务指导</b-nav-item>
        <b-nav-item @click="askOpen()">业务咨询</b-nav-item>
        <b-nav-item to="/business/list/progress">退出业务</b-nav-item>
      </template>
    </TopHeader>

    <b-modal centered hide-footer id="businessGuide" ref="businessGuide" title="指导者选择">
      <div class="p-4">
        <b-form-select v-model="selectedGuider" :options="guiders"></b-form-select>
        <b-button
          variant="success"
          @click="businessGuide()"
          class="mt-4"
          :disabled="selectedGuider === null"
        >确&emsp;定</b-button>
      </div>
    </b-modal>
    <b-modal centered hide-footer id="guideChat" size="lg" ref="guideChat" title="业务指导">
      <div class="p-4" v-if="guider.id">
        <guider-chat :guider="guider"></guider-chat>
      </div>
    </b-modal>
    <b-modal centered hide-footer id="askChat" size="xl" ref="askChat" title="业务咨询">
      <div class="p-4" v-if="askChatRoomId">
        <ask-chat :askChatRoomId="askChatRoomId"></ask-chat>
      </div>
    </b-modal>

    <!-- 发送留言 -->
    <send-msg-modal @on-send="sendMsgConfirm"></send-msg-modal>
    <!-- 查看留言 -->
    <receive-msg-modal @on-cancel="receiveMsgClose"></receive-msg-modal>
    <!-- 业务成果Modal -->
    <results-modal></results-modal>
    <!-- 已提交文件Modal -->
    <submitted-file-modal></submitted-file-modal>
    <!-- 成果参考modal -->
    <results-ref-modal></results-ref-modal>
    <!-- 我的笔记modal -->
    <my-notes-modal></my-notes-modal>
    <!-- 操作指南 -->
    <b-modal v-model="showProjectGuideModal" size="lg" title="操作指南" :hide-footer="true">
      <project-guide></project-guide>
    </b-modal>
    <!-- 项目素材 -->
    <b-modal v-model="showProjectDocsModal" size="lg" title="项目素材" :hide-footer="true">
      <project-docs></project-docs>
    </b-modal>
    <!-- 重新开始提示 -->
    <b-modal v-model="tipModalRestart" title="提示">
      <b-container>
        <div class="modal-msg">
          <p class="message">是否确定要重新开始</p>
          <p class="tip">提示：如果您选择重新开始本业务，业务成果将被清空</p>
        </div>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-button variant="danger" class="float-center mr-2" @click="restartOk()">确定</b-button>
        <b-button variant="secondary" class="float-center" @click="tipModalRestart=false">取消</b-button>
      </div>
    </b-modal>
    <!-- 提前结束Modal -->
    <b-modal v-model="tipModalEnd" title="提示">
      <b-container>
        <div class="modal-msg">
          <p class="message">是否确定要提前结束</p>
        </div>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-button variant="danger" class="float-center mr-2" @click="finishOk()">确定</b-button>
        <b-button variant="secondary" class="float-center" @click="tipModalEnd=false">取消</b-button>
      </div>
    </b-modal>
    <!-- 返回上一步Modal -->
    <b-modal v-model="tipModalBack" title="提示">
      <b-container>
        <div class="modal-msg">
          <p class="message">是否确定要返回上一步</p>
          <p class="tip">提示：若返回上一步，本环节数据将被清空</p>
        </div>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-button variant="danger" class="float-center mr-2" @click="goBackOk()">确定</b-button>
        <b-button variant="secondary" class="float-center" @click="tipModalBack=false">取消</b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import TopHeader from "@/components/header/TopHeader";
import { mapState, mapActions } from "vuex";
import businessService from "@/services/businessService";
import * as actionCmd from "@/components/business/common/actionCmds";
import Dropdown from "bp-vuejs-dropdown";
import sendMsgModal from "@/components/business/modal/sendMsgModal";
import receiveMsgModal from "@/components/business/modal/receiveMsgModal";
import resultsModal from "@/components/business/modal/resultsModal";
import submittedFileModal from "@/components/business/modal/submittedFileModal";
import resultsRefModal from "@/components/business/modal/resultsRefModal";
import myNotesModal from "@/components/business/modal/myNotesModal";
import projectGuide from "@/components/business/progress/ProjectGuide";
import projectDocs from "@/components/business/progress/ProjectDocs";
import GuiderChat from "./GuiderChat";
import AskChat from "./AskChat";

export default {
  components: {
    TopHeader,
    Dropdown,
    sendMsgModal,
    receiveMsgModal,
    resultsModal,
    submittedFileModal,
    resultsRefModal,
    myNotesModal,
    projectGuide,
    projectDocs,
    GuiderChat,
    AskChat
  },
  data() {
    return {
      selectedGuider: null,
      viewStatus: true,
      showModal: 0,
      tipModalRestart: false,
      tipModalEnd: false,
      tipModalBack: false,
      canHandle: true,
      unReadMsgCount: 0,
      intervalFlag: "",
      showSecendMend: false,
      showProjectGuideModal: false,
      showProjectDocsModal: false,
      guiders: [],
      guider: {},
      askChatRoomId: null
    };
  },
  created() {},
  computed: {
    ...mapState(["userInfo", "meta"]),
    metaInfo() {
      return this.meta.info;
    },
    currentRoleAllocation() {
      return this.meta.currentRoleAllocation;
    }
  },
  mounted() {
    this.queryUnreadMsg();
    // this.intervalFlag = setInterval(() => {
    //     this.queryUnreadMsg();
    // }, 20000);
  },
  beforeDestroy() {
    clearInterval(this.intervalFlag);
  },
  watch: {},
  methods: {
    ...mapActions(["dispatchFlashAction"]),
    queryUnreadMsg() {
      let param = {
        user_id: this.userInfo.id,
        business_id: this.$route.params.bid
      };
      businessService.unReadBusinessMessage(param).then(data => {
        this.unReadMsgCount = data;
      });
    },
    // 发送留言
    sendMsg() {
      this.$emit("openSendMsgModal");
    },
    // 确认发送留言
    sendMsgConfirm(msg) {
      msg.from_user_id = this.userInfo.id;
      businessService.sendMessage(msg).then(() => {
        this.$toasted.success("发送成功");
      });
    },
    guiderSelect() {
      businessService
        .getGuiderList({
          id: this.metaInfo.project.office_item_id,
          bid: this.$route.params.bid
        })
        .then(data => {
          if (data.status === 0) {
            this.$refs["businessGuide"].show();
            this.selectedGuider = null;
            this.guiders = data.results;
          } else {
            this.guider = data.results;
            this.$refs["guideChat"].show();
          }
        });
    },
    askOpen() {
      businessService
        .getChatRoomId({ officeItem: this.metaInfo.project.office_item_id })
        .then(data => {
          this.askChatRoomId = data.room_id;
          this.$refs["askChat"].show();
        });
    },
    businessGuide() {
      businessService
        .setGuider({
          guiderId: this.selectedGuider.id,
          guiderRole: this.selectedGuider.role,
          bid: this.$route.params.bid
        })
        .then(data => {
          if (data.status === 1) {
            this.$refs["businessGuide"].hide();
            this.guider = data.results;
            this.$refs["guideChat"].show();
          }
        });
    },
    // 留言面板
    receiveMsgList() {
      this.$emit("openReceiveMsgModal");
    },
    receiveMsgClose() {
      this.unReadMsgCount = 0;
    },
    viewBusinessResult() {
      if (this.userInfo.identity === 5) {
        if (
          this.metaInfo.process_type === 1 &&
          this.currentRoleAllocation.sitting_status === 1
        ) {
          this.$toasted.error("角色未入席无法查看业务成果");
          return;
        }
      }
      this.$emit("openResultsModal");
    },
    viewSubmittedFile() {
      this.$emit("openSubmittedFileModal");
    },
    viewResultsRef() {
      this.$emit("openResultsRefModal");
    },
    viewMyNotes() {
      this.$emit("openMyNotesModal");
    },
    // 切换视角
    switchView() {
      if (!this.metaInfo.can_switch) {
        return;
      }
      this.viewStatus = !this.viewStatus;
      this.dispatchFlashAction({
        ext: {
          cmd: "action_trans",
          param: `cmd=switch&viewname=${this.viewStatus ? "正面" : "反面"}`
        }
      });
    },
    // 退出业务
    quit() {
      if (this.userInfo.identity === 4) {
        // this.$router.push({ path: "/mentor/guide" });
      } else {
        // 退席
        let quitRoleAllocs = this.metaInfo.user_role_allocs
          .filter(roleAlloc => roleAlloc.sitting_status === 2)
          .map(roleAlloc => roleAlloc.name)
          .join("、");
        if (quitRoleAllocs.length > 0) {
          businessService.pushMessage({
            business_id: this.$route.params.bid,
            node_id: this.$route.params.nid,
            role_alloc_id: this.currentRoleAllocation.alloc_id,
            msg: quitRoleAllocs + "退席并退出业务",
            type: "cmd",
            cmd: actionCmd.ACTION_ROLES_EXIT
          });
        }
        this.$router.push({ path: "/business/list/progress" });
      }
    },
    restartBusiness() {
      this.tipModalRestart = true;
    },
    endBusiness() {
      this.tipModalEnd = true;
    },
    // 返回上一步确认
    backLastHandler() {
      if (!this.metaInfo.pre_node_id) {
        this.$toasted.error("没有上一步无法返回");
        return;
      }
      this.tipModalBack = true;
    },
    // 确定返回上一步
    goBackOk() {
      businessService.pushMessage({
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid,
        role_alloc_id: this.currentRoleAllocation.alloc_id,
        msg: "返回上一步",
        type: "cmd",
        cmd: actionCmd.ACTION_BUSINESS_BACK,
        data: JSON.stringify({ tran_id: this.metaInfo.pre_node_id })
      });
      this.tipModalBack = false;
    },
    // 重新开始确认操作
    restartOk() {
      businessService.pushMessage({
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid,
        role_alloc_id: this.currentRoleAllocation.alloc_id,
        type: "cmd",
        msg: "重新开始业务",
        cmd: actionCmd.ACTION_BUSINESS_RESTART
      });
      this.tipModalRestart = false;
    },
    // 提前结束确认
    finishOk() {
      businessService.pushMessage({
        business_id: this.$route.params.bid,
        node_id: this.$route.params.nid,
        role_alloc_id: this.currentRoleAllocation.alloc_id,
        msg: "提前结束业务",
        type: "cmd",
        cmd: actionCmd.ACTION_BUSINESS_FINISH
      });
      this.tipModalEnd = false;
    },
    // 查看流程图
    showFlowChart() {
      this.$emit("emit-viewxml");
    }
  }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.progress-menu {
  .bp-dropdown__btn {
    border: 0px;
    padding: 0px;
  }

  .bp-dropdown__btn--active {
    background-color: #253568;
  }

  a.disabled {
    color: #999 !important;
  }

  .bp-dropdown__body {
    color: #212529;
    padding: 0.5rem 0;
    margin: 0.125rem 0 0;
    min-width: 10rem;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    text-align: left !important;

    ul {
      list-style: none;
      padding: 0;

      li {
        line-height: 24px;
        padding: 0.25rem 1.5rem;
        font-weight: 400;
        white-space: nowrap;
        font-size: 16px;
        font-family: "Microsoft JhengHei";
        text-align: left;

        a {
          color: #212529;
          text-decoration: none;
        }
      }

      li.active,
      li:active {
        color: #fff;
        text-decoration: none;
        background-color: #007bff;
      }

      li:hover,
      li:focus {
        color: #16181b;
        text-decoration: none;
        background-color: #f8f9fa;
      }
    }
  }
}
</style>

