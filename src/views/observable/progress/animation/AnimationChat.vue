<template>
  <div class="progress-chat-container">
    <div class="progress-chat-hd" v-if="currentRoleAllocation">
      <div class="chat-message" :class="{'active':this.activeSidebar}">
        <section ref="chat" class="chatlist" v-scroll-bottom="messages">
          <ul>
            <template v-for="(item, index) in messages">
              <li class="chat-status" :key="index" v-if="statusCmdArr.indexOf(item.ext.cmd) > -1">
                <!-- 申请发言 -->
                <div class="status-info" v-if="item.ext.cmd === 'action_role_apply_speak_opt'">
                  {{item.ext.opt.role_name}}申请发言
                  <br />
                  {{item.ext.role_name}}{{item.ext.opt.result === 1 ? '同意' : '拒绝'}}{{item.ext.opt.role_name}}进行发言
                </div>
                <!-- 请入 -->
                <div
                  class="status-info"
                  v-else-if="item.ext.cmd === 'action_role_letin'"
                >{{item.ext.role_name}}（{{item.ext.username}}）请入{{item.ext.opt.data.map(role => role.role_name).join('、')}}</div>
                <!-- 送出 -->
                <div
                  class="status-info"
                  v-else-if="item.ext.cmd === 'action_role_letout'"
                >{{item.ext.role_name}}（{{item.ext.username}}）{{item.data}}</div>
                <!-- 退出业务 -->
                <div
                  class="status-info"
                  v-else-if="item.ext.cmd === 'action_roles_exit'"
                >{{item.data}}</div>
                <div
                  class="status-info"
                  v-else-if="item.ext.cmd === 'action_trans'"
                >{{item.ext.role_name}}（{{item.ext.username}}）{{item.msg || item.data}}</div>
                <div
                  class="status-info"
                  v-else
                >{{item.ext.role_name}}（{{item.ext.username}}）{{item.msg || item.data}}</div>
              </li>
              <li class="chat-bubble chat-others" :key="index" v-else>
                <div class="chat-user">
                  <!-- <img :src="item.ext.avatar"> -->
                  <img :src="item.ext.avatar" />
                </div>
                <div class="time">
                  <cite>
                    {{item.ext.role_name}}-{{item.ext.business_role_alloc && item.ext.business_role_alloc.no}}（{{item.ext.username}}）
                    <i>{{item.ext.time}}</i>
                  </cite>
                </div>
                <!-- <div v-if="item.url" class="chat-text">
                                    <chataudio :src="item.url"></chataudio>
                </div>-->
                <div class="chat-text" v-html="replaceFace(item)"></div>
              </li>
            </template>
          </ul>
        </section>
      </div>
      <a
        href="javascript:void(0);"
        class="handle-right handle-control"
        @click="activeSidebar = !activeSidebar"
        v-if="!activeSidebar"
      >
        <!-- <icon name="caret-left" scale="3"></icon> -->
        <!-- <img src="@/assets/imgIsper/business/left1.png" /> -->
        <img src="/media/invite.png" />
      </a>
      <div
        class="online-user p-1"
        :class="{'inactive': !this.activeSidebar, 'active': this.activeSidebar}"
      >
        <div class="online-user-list">
          <b-list-group>
            <b-list-group-item
              class="mb-1 online-user-list-item"
              v-for="(nodeRoleAlloc, index) in nodeRoleAllocs"
              :key="index"
            >
              <img :src="nodeRoleAlloc.image.avatar" :class="{'is_online':nodeRoleAlloc.is_online}" />
              <div class="user-info" :class="{'is_online':nodeRoleAlloc.is_online}">
                <div class="role-name text-left">
                  <div class="online-status" :class="{'online': nodeRoleAlloc.is_online}"></div>
                  {{nodeRoleAlloc.name}}
                </div>
                <div class="user-name text-left">姓名：{{nodeRoleAlloc.user_name}}</div>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>

        <div class="online-user-handle">
          <a
            class="handle-left handle-control"
            href="javascript:void(0);"
            @click="activeSidebar = !activeSidebar"
          >
            <!-- <icon name="caret-right" scale="3"></icon> -->
            <img src="/media/invite.png" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as actionCmd from "@/components/business/common/actionCmds";
import emoji from "@/components/business/common/emoji";
import { mapState } from "vuex";
import _ from "lodash";

const handleCmds = [
  actionCmd.ACTION_ROLE_MEET,
  actionCmd.ACTION_DOC_SHOW,
  actionCmd.ACTION_DOC_SUBMIT,
  actionCmd.ACTION_DOC_APPLY_SUBMIT,
  actionCmd.ACTION_DOC_APPLY_SHOW,
  actionCmd.ACTION_ROLE_APPLY_SPEAK,
  actionCmd.ACTION_ROLE_REQUEST_SIGN,
  actionCmd.ACTION_ROLE_SIGN
];
export default {
  name: "AnimationChat",
  components: {},
  sockets: {
    onlineAllocs(data) {
      this.onlineAllocs = data.allocs;
    }
  },
  data() {
    return {
      emoji: emoji,
      modalShow: 0,
      // 申请操作消息体数据
      applyOptData: {
        opt_status: false,
        opt: {}
      },
      selectedUser: null,
      selectedId: null,
      // 查看签字文件详情
      signedDocDetail: null,
      activeSidebar: false,
      onlineAllocs: []
    };
  },
  computed: {
    ...mapState({
      userRoleAllocs: state => state.meta.info.user_role_allocs,
      currentRoleAllocation: state => state.meta.currentRoleAllocation,
      messages: state => state.meta.messages,
      roleAllocs: state => state.meta.info.role_allocs,
      node_id: state => state.meta.info.node_id
    }),
    nodeRoleAllocs() {
      let nodeRoleAllocs = _.filter(this.roleAllocs, {
        node_id: this.node_id
      });
      nodeRoleAllocs = _.map(nodeRoleAllocs, nodeRoleAlloc => {
        if (
          _.some(this.onlineAllocs, onlineAlloc => {
            return onlineAlloc.alloc_id == nodeRoleAlloc.id;
          })
        ) {
          nodeRoleAlloc.is_online = true;
        } else {
          nodeRoleAlloc.is_online = false;
        }
        return nodeRoleAlloc;
      });
      return nodeRoleAllocs;
    },
    statusCmdArr() {
      return [
        "action_trans",
        "action_role_hide",
        "action_role_show",
        "action_role_stand",
        "action_role_sitdown",
        "action_role_letin",
        "action_role_letout",
        "action_role_banned",
        "action_exp_restart",
        "action_exp_back",
        "action_exp_finish",
        "action_exp_node_end",
        "action_role_apply_speak_opt",
        "action_role_toward_report",
        "action_role_end_report",
        "action_roles_exit"
      ];
    }
  },
  directives: {
    // 发送消息后滚动到底部
    "scroll-bottom"(el, binding, vnode) {
      vnode.context.$nextTick(() => {
        el.scrollTop = el.scrollHeight - el.clientHeight;
      });
    },
    // 换行符
    "line-break"(el, binding) {
      el.innerHTML = binding.value.replace(/\r?\n|\r/g, "<br/>");
    }
  },
  watch: {},
  created() {
    this.$nextTick(() => {});
  },
  mounted() {
    this.$socket.emit("userIsOnline", {
      alloc_id: "observable"
    });
  },
  methods: {
    // 替换表情代码
    replaceFace(msg) {
      if (!msg) return "";
      var self = this;
      var con = "";
      // 展示文件
      if (msg.ext.cmd === actionCmd.ACTION_DOC_SHOW) {
        return `<a href="${msg.ext.opt.url}" class="btn-underline" target="_blank">${msg.data}</a>`;
      }
      // 提交文件
      if (msg.ext.cmd === actionCmd.ACTION_DOC_SUBMIT) {
        con += "提交文件 : ";
        msg.ext.opt.data.forEach(dt => {
          con += `<a href="${dt.url}" class="btn-underline" target="_blank">${dt.name}</a><br>`;
        });
        return con;
      }

      // 签字
      if (msg.ext.cmd === actionCmd.ACTION_ROLE_REQUEST_SIGN) {
        if (msg.ext.opt_status) {
          con = `<span>要求${msg.ext.opt.role_name}签字（已完成）</span>`;
        } else {
          con = `<span>${msg.data}</span>`;
        }
        return con;
      }

      // 签字之后生成链接
      if (msg.ext.cmd === actionCmd.ACTION_ROLE_SIGN) {
        return `${msg.ext.opt.name}${
          msg.ext.opt.result === 1 ? "已经" : "拒绝"
        }在《<a href="javascript:;" class="btn-underline">${
          msg.ext.opt.doc_name
        }</a>》上签字`;
      }

      // 安排报告
      if (msg.ext.cmd === actionCmd.ACTION_ROLE_SCHEDULE_REPORT) {
        if (
          msg.ext.opt &&
          parseInt(msg.ext.opt.role_id) === this.currentRoleAllocation.alloc_id
        ) {
          return `<a href="javascript:void(0)" class="btn-underline" title="点击左下侧走向发言席按钮">请走向发言席作报告</a>`;
        } else {
          return `${msg.data}`;
        }
      }

      // 签字
      if (
        msg.ext.cmd === actionCmd.ACTION_ROLE_REQUEST_SIGN &&
        msg.ext.opt &&
        parseInt(msg.ext.opt.role_id) !== this.currentRoleAllocation.alloc_id
      ) {
        return `<span>要求${msg.ext.opt.role_name}签字</span>`;
      }

      // 申请发言、申请提交、申请展示
      if (
        (msg.ext.cmd === actionCmd.ACTION_DOC_APPLY_SUBMIT ||
          msg.ext.cmd === actionCmd.ACTION_DOC_APPLY_SHOW ||
          msg.ext.cmd === actionCmd.ACTION_ROLE_APPLY_SPEAK) &&
        !this.currentRoleAllocation.can_terminate
      ) {
        return `${msg.data}`;
      }

      if (handleCmds.indexOf(msg.ext.cmd) > 0) {
        return `<a href="javascript:;" class="btn-underline" target="_blank">${msg.data}</a>`;
      }
      /* eslint-disable */
      con = msg.data.replace(/\[[^\[\]]+\]/g, function(item) {
        let index = self.emoji.code.indexOf(item);
        let src = require("@/assets/imgIsper/emoji/" + self.emoji.img[index]);
        return '<img src="' + src + '" width="32" height="32"  alt="" />';
      });
      return con;
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.progress-chat-container {
  background: #d4e4ff;
  .chat-message {
    height: 670px;
    .chatlist {
      height: 100%;
      padding: 10px 20px;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;

      ul,
      ol {
        padding: 0px;
        list-style: none;
        .chat-status {
          position: relative;
          margin-bottom: 10px;
          padding-left: 60px;
          text-align: center;
          .status-info {
            display: inline-block;
            font-size: 12px;
            line-height: 20px;
            padding: 0 20px;
            border-radius: 10px;
            background-color: #ccc;
          }
        }
        .chat-bubble {
          position: relative;
          margin-bottom: 10px;
          padding-left: 60px;
          min-height: 68px;
          text-align: left;
          .chat-user {
            position: absolute;
            left: 3px;
            top: 10px;
            img {
              width: 40px;
              height: 40px;
              border-radius: 100%;
            }
          }
          .time {
            width: 100%;
            cite {
              font-style: normal;
              line-height: 24px;
              font-size: 12px;
              white-space: nowrap;
              color: #999;
              text-align: left;
              i {
                font-style: normal;
                padding-left: 5px;
                padding-right: 5px;
                font-size: 12px;
              }
            }
          }
          .chat-text {
            position: relative;
            line-height: 22px;
            padding: 10px 15px;
            min-height: 32px;
            background-color: #fff;
            border-radius: 3px;
            color: #333;
            word-break: break-all;
            max-width: 462px\9;
          }
          .chat-text:after {
            content: "";
            position: absolute;
            left: -10px;
            top: 5px;
            width: 0;
            height: 0;
            border-style: solid dashed dashed;
            border-color: #fff transparent transparent;
            overflow: hidden;
            border-width: 10px;
          }
          .chat-text,
          .chat-user {
            display: inline-block;
            vertical-align: top;
            font-size: 14px;
          }
        }
        .chat-mine {
          text-align: right;
          padding-left: 0;
          padding-right: 60px;
          .chat-user {
            left: auto;
            right: 3px;
          }
          .chat-text {
            margin-left: 0;
            text-align: left;
            background-color: #6787e7;
            color: #fff;
          }
          .chat-text:after {
            left: auto;
            right: -10px;
            border-top-color: #6787e7;
          }
        }
      }
    }
    .chatlist::-webkit-scrollbar {
      width: 0em;
    }
  }
  .chat-message.active {
    width: 380px;
    transition: all 0.5s linear;
  }
  .progress-chat-hd {
    position: relative;
  }
  .online-user {
    background: rgb(221, 231, 249);
    box-shadow: -10px 0px 10px 1px #a6c3f9;
    height: 672px;
    width: 300px;
    position: absolute;
    top: 0px;
    right: 0px;
    .online-user-handle {
      position: absolute;
      left: -30px;
      top: 585px;
    }
    .user-name {
      font-size: 14px;
    }
  }
  .online-user.inactive {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s linear 300ms, opacity 300ms;
  }
  .online-user.active {
    visibility: visible;
    opacity: 1;
    transition: visibility 0s linear 0s, opacity 300ms;
  }
  .handle-left {
    img {
      width: 60px;
      height: 60px;
      filter: drop-shadow(3px 3px 4px #222);
    }
  }
  .handle-right {
    position: absolute;
    top: 585px;
    right: -30px;
    img {
      width: 60px;
      height: 60px;
      filter: drop-shadow(3px 3px 4px #222);
    }
  }
  .handle-control {
    color: #a6c3f9;
  }
  .online-user-list-item {
    display: flex;
    padding: 5px;
    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border: 2px solid #b1b1b1;
      border-radius: 50px;
      opacity: 0.5;
      filter: alpha(opacity=50); /* For IE8 and earlier */
    }
    .user-info {
      position: relative;
      width: 100%;
      color: #a29b9b;
    }
    .is_online {
      color: black;
    }
    img.is_online {
      opacity: 1;
      filter: alpha(opacity=100); /* For IE8 and earlier */
    }
    .role-name {
      display: flex;
    }
    .online-status {
      width: 10px;
      height: 10px;
      margin-top: 8px;
      margin-right: 8px;
      background: #bec0c2;
      border-radius: 10px;
    }
    .online-status.online {
      background: #5dc26a;
    }
  }
}
</style>
