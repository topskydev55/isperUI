<template>
  <div class="team-list container">
    <loading v-if="isRunning"></loading>
    <div class="cardDiv">
      <h2>我的团队</h2>
      <b-table :items="myTeam.list" small hover :fields="columns1" head-variant>
        <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
        <template slot="name" slot-scope="row">{{row.item.name}}</template>
        <template
          slot="leader"
          slot-scope="row"
        >{{row.item.team_leader && row.item.team_leader.name}}</template>
        <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
        <template slot="type" slot-scope="row">{{row.item.type == 0 ? "开放":"不开放"}}</template>
        <template slot="action" slot-scope="row">
          <div>
            <b-button
              v-if="row.item.type==1 && row.item.team_leader.id == userInfo.id"
              :size="template_size"
              class="styledBtn"
              variant="outline-primary"
              @click="setMember(row.item)"
            >加入团队</b-button>
            <!-- <b-button :size="template_size" class="ml-1 styledBtn" @click="escapeTeam(row.item)">退出</b-button> -->
            <b-button
              v-else
              :size="template_size"
              class="ml-1 styledBtn"
              @click="showTeamMember(row.item)"
            >查看</b-button>
            <b-button :size="template_size" class="ml-1 styledBtn" @click="escapeTeam(row.item)">退出</b-button>
          </div>
        </template>
      </b-table>
      <b-row class="justify-content-center row-margin-tweak mt-3">
        <b-pagination
          :size="template_size"
          :total-rows="myTeam.total"
          :per-page="queryMyTeamParam.size"
          limit="5"
          v-model="queryMyTeamParam.page"
        ></b-pagination>
      </b-row>
    </div>
    <div class="cardDiv mt-5">
      <h2>待加入团队</h2>
      <b-table :items="availableTeam.list" small hover :fields="columns2" head-variant>
        <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
        <template slot="name" slot-scope="row">{{row.item.name}}</template>
        <template
          slot="leader"
          slot-scope="row"
        >{{row.item.team_leader && row.item.team_leader.name}}</template>
        <template slot="create_time" slot-scope="row">{{row.item.create_time}}</template>
        <template slot="type" slot-scope="row">{{row.item.type == 0 ? "开放":"不开放"}}</template>
        <template slot="action" slot-scope="row">
          <div>
            <b-button
              :size="template_size"
              class="styledBtn"
              variant="outline-primary"
              @click="setMember(row.item, true)"
            >加入团队</b-button>
          </div>
        </template>
      </b-table>
      <b-row class="justify-content-center row-margin-tweak mt-3">
        <b-pagination
          :size="template_size"
          :total-rows="availableTeam.total"
          :per-page="queryAvailableTeamParam.size"
          limit="5"
          v-model="queryAvailableTeamParam.page"
        ></b-pagination>
      </b-row>
    </div>

    <b-modal v-model="userModal" title="选择团队成员" size="lg" hide-footer>
      <b-container fluid>
        <b-input-group :size="template_size" class="w-50 mb-3">
          <b-input-group-prepend>
            <span class="input-group-text">
              <icon name="search"></icon>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model.lazy="queryUserDebounceParam.search" placeholder="请输入内容" />
        </b-input-group>
        <b-table :items="user.list" small hover :fields="columns3" head-variant>
          <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
          <template slot="name" slot-scope="row">
            {{row.item.name}}
            <span class="ml-2" v-if="row.item.is_member">(团队成员)</span>
          </template>
          <template slot="username" slot-scope="row">{{row.item.username}}</template>
          <template slot="action" slot-scope="row">
            <div>
              <b-button
                v-if="row.item.is_member"
                :size="template_size"
                variant="outline-danger"
                @click="removeMember(row.item)"
              >退出</b-button>
              <b-button
                v-else-if="!row.item.is_invited"
                :size="template_size"
                variant="outline-primary"
                @click="inviteMember(row.item)"
              >邀请</b-button>
              <span v-else>被邀请</span>
            </div>
          </template>
        </b-table>
        <b-row class="justify-content-center row-margin-tweak mt-3">
          <b-pagination
            :size="template_size"
            :total-rows="user.total"
            :per-page="queryUserParam.size"
            limit="5"
            v-model="queryUserParam.page"
          ></b-pagination>
        </b-row>
      </b-container>
    </b-modal>

    <b-modal v-model="teammateModal" title="团队成员" size="lg" hide-footer>
      <b-container fluid>
        <b-table :items="teamUsers" small hover :fields="columns3" head-variant>
          <template slot="sn" slot-scope="row">{{ row.index + 1 }}</template>
          <template slot="name" slot-scope="row">
            {{row.item.name}}
            <span
              class="ml-2"
              v-if="selectedTeam.team_leader.id == row.item.id"
            >(队长)</span>
          </template>
          <template slot="username" slot-scope="row">{{row.item.username}}</template>
          <template slot="action" slot-scope="row">
            <div>
              <b-button
                v-if="selectedTeam.team_leader.id==userInfo.id && userInfo.id!=row.item.id"
                :size="template_size"
                variant="outline-danger"
                @click="removeMember(row.item, true)"
              >退出</b-button>
            </div>
          </template>
        </b-table>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Loading from "@/components/loading/Loading";
import _ from "lodash";
import studentService from "@/services/studentService";
import { businessStatus, gender } from "@/filters/fun";

export default {
  components: { Loading },
  filters: { businessStatus, gender },
  data() {
    return {
      queryMyTeamParam: {
        type: 0,
        page: 1,
        size: 5
      },
      queryAvailableTeamParam: {
        type: 0,
        page: 1,
        size: 5
      },
      queryUserParam: {
        page: 1,
        size: 5
      },
      queryUserDebounceParam: {
        search: ""
      },
      myTeam: {
        list: [],
        total: 0
      },
      availableTeam: {
        list: [],
        total: 0
      },
      userModal: false,
      selectedTeam: null,
      teammateModal: false,
      user: {
        list: [],
        total: 0
      },
      teamUsers: [],
      invitedUsers: [],
      columns1: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn w-10"
        },
        name: {
          label: "团队名称",
          sortable: false,
          class: "text-left field-name w-20"
        },
        leader: {
          label: "队长",
          sortable: false,
          class: "text-left field-creator w-20"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center field-create_time w-20"
        },
        type: {
          label: "团队模式",
          sortable: false,
          class: "text-left field-creator w-15"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center field-status w-15"
        }
      },
      columns2: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn w-10"
        },
        name: {
          label: "团队名称",
          sortable: false,
          class: "text-left field-name w-20"
        },
        leader: {
          label: "队长",
          sortable: false,
          class: "text-left field-creator w-20"
        },
        create_time: {
          label: "创建时间",
          sortable: false,
          class: "text-center field-create_time w-20"
        },
        type: {
          label: "团队模式",
          sortable: false,
          class: "text-left field-creator w-15"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center field-status w-15"
        }
      },
      columns3: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn"
        },
        name: {
          label: "姓名",
          sortable: false,
          class: "text-left field-name"
        },
        username: {
          label: "用户名",
          sortable: false,
          class: "text-left field-creator"
        },
        action: {
          label: "操作",
          sortable: false,
          class: "text-center field-creator"
        }
      },
      columns4: {
        sn: {
          label: "序号",
          sortable: false,
          class: "text-center field-sn"
        },
        name: {
          label: "姓名",
          sortable: false,
          class: "text-left field-name"
        },
        username: {
          label: "用户名",
          sortable: false,
          class: "text-left field-creator"
        }
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  watch: {
    queryMyTeamParam: {
      handler() {
        this.queryMyTeamList();
      },
      deep: true
    },
    queryAvailableTeamParam: {
      handler() {
        this.queryAvailableTeamList();
      },
      deep: true
    },
    queryUserParam: {
      handler() {
        this.querUserList();
      },
      deep: true
    },
    queryUserDebounceParam: {
      deep: true,
      handler: _.debounce(function() {
        this.querUserList();
      }, 500)
    }
  },
  mounted() {},
  methods: {
    init() {
      this.queryMyTeamList();
      this.queryAvailableTeamList();
    },
    queryMyTeamList() {
      this.run();
      studentService
        .myTeamList({
          ...this.queryMyTeamParam
        })
        .then(data => {
          this.myTeam.list = data.results;
          this.myTeam.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    queryAvailableTeamList() {
      this.run();
      studentService
        .availableTeamList({
          ...this.queryAvailableTeamParam
        })
        .then(data => {
          this.availableTeam.list = data.results;
          this.availableTeam.total = data.paging.count;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    querUserList(viewOnly = false) {
      let team = this.selectedTeam;
      if (!team) return;
      this.run();
      if (viewOnly) {
        studentService
          .teamUserList({
            id: team.id
          })
          .then(data => {
            this.teamUsers = data.members;
            this.teammateModal = true;
            this.$emit("data-ready");
          })
          .catch(() => {
            this.$emit("data-failed");
          });
        return;
      }
      studentService
        .teamUserList({
          ...this.queryUserDebounceParam,
          ...this.queryUserParam,
          ...{
            id: team.id
          }
        })
        .then(data => {
          this.user.list = _.map(data.university_users, user => {
            user.is_member = _.some(data.members, member => {
              return member.id == user.id;
            });
            user.is_invited = _.some(data.invited_users, member => {
              return member.id == user.id;
            });
            return user;
          });
          this.user.total = data.paging.count;
          this.teamUsers = data.members;
          this.invitedUsers = data.invited_users;
          this.userModal = true;
          this.$emit("data-ready");
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    showTeamMember(team) {
      this.selectedTeam = team;
      this.querUserList(true);
    },
    setMember(team, isMe = false) {
      if (!isMe) {
        this.selectedTeam = team;
        this.querUserList();
      } else {
        this.run();
        studentService
          .addTeamUser({
            id: team.id,
            student_id: this.userInfo.id
          })
          .then(() => {
            this.$emit("data-ready");
            this.init();
          })
          .catch(() => {
            this.$emit("data-failed");
          });
      }
    },
    updateTeam(val, user) {
      let team = this.selectedTeam;
      if (!team) return;
      if (val) {
        this.run();
        studentService
          .addTeamUser({
            id: team.id,
            student_id: user.id
          })
          .then(() => {
            this.$emit("data-ready");
          })
          .catch(() => {
            this.$emit("data-failed");
          });
      } else {
        this.run();
        studentService
          .removeTeamUser({
            id: team.id,
            student_id: user.id
          })
          .then(() => {
            this.$emit("data-ready");
          })
          .catch(() => {
            this.$emit("data-failed");
          });
      }
    },
    inviteMember(user) {
      let team = this.selectedTeam;
      this.run();
      studentService
        .inviteTeamUser({
          id: team.id,
          student_id: user.id
        })
        .then(() => {
          this.querUserList();
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    removeMember(user, viewOnly = false) {
      let team = this.selectedTeam;
      this.run();
      studentService
        .removeTeamUser({
          id: team.id,
          student_id: user.id
        })
        .then(() => {
          this.querUserList(viewOnly);
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    },
    escapeTeam(team) {
      this.run();
      studentService
        .removeTeamUser({
          id: team.id,
          student_id: this.userInfo.id
        })
        .then(() => {
          this.$emit("data-ready");
          this.init();
        })
        .catch(() => {
          this.$emit("data-failed");
        });
    }
  }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.team-list {
  .vertical-center {
    line-height: 38px;
  }
}
</style>