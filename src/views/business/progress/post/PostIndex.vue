<template>
    <div class="post-index">
        <loading v-if="isRunning"></loading>
        <b-row>
            <b-col sm="12">
                <b-form-group label-cols="1" label="公示名称:" label-for="input-horizontal">
                    <b-form-input
                        class="cardDiv mt-0"
                        id="input-horizontal"
                        maxlength="32"
                        v-model="post_name"
                        placeholder="请输入名称（32个字以下）"
                        required
                    ></b-form-input>
                </b-form-group>
                <b-form-group label-cols="1" label="公示内容:" label-for="input-horizontal">
                    <div class="cardDiv mt-0">
                        <vue-editor v-model="post_content"></vue-editor>
                    </div>
                </b-form-group>
            </b-col>
        </b-row>
        <div class="create-btns">
            <business-post-upload></business-post-upload>
            <b-button size="sm" class="styledBtn" variant="outline-primary" @click="savePost()">
                <icon name="save"></icon>&nbsp;保存
            </b-button>

            <b-button
                v-if="currentRoleAllocation.can_terminate"
                size="sm"
                class="styledBtn"
                variant="outline-primary"
                @click="commitEnd = true"
            >结束并走向</b-button>
        </div>
        <end-node-handle :isCommit="commitEnd" @on-cancel="endNodeCancel"></end-node-handle>
        <siderUserBar></siderUserBar>
    </div>
</template>

<script>
import Loading from "@/components/loading/Loading";
import BusinessService from "@/services/businessService";
import { mapState } from "vuex";
import { VueEditor } from "vue2-editor";
import BusinessPostUpload from "@/components/upload/BusinessPostUpload";
import endNodeHandle from "@/components/business/modal/endNodeHandle";
import siderUserBar from "@/components/business/common/SiderUserBar";

export default {
    components: { Loading, VueEditor, BusinessPostUpload, endNodeHandle, siderUserBar },
    data() {
        return {
            post_name: "",
            post_content: "",
            commitEnd: false
        };
    },
    created() {
        this.$nextTick(() => {
            this.init();
        });
    },
    computed: {
        ...mapState(["userInfo"]),
        currentRoleAllocation() {
            return this.$store.state.meta.currentRoleAllocation;
        }
    },
    mounted() {},
    methods: {
        init() {
            this.run();
            BusinessService.getPost({
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid
            })
                .then(data => {
                    this.post_name = data.name || "";
                    this.post_content = data.content || "";
                    this.$emit("data-ready");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        savePost() {
            if (this.post_name.trim() == "" || this.post_content.trim() == "") {
                return;
            }
            this.run();
            BusinessService.createPost({
                business_id: this.$route.params.bid,
                node_id: this.$route.params.nid,
                post_name: this.post_name,
                post_content: this.post_content
            })
                .then(() => {
                    this.$emit("data-ready");
                    this.$toasted.success("保存成功");
                })
                .catch(() => {
                    this.$emit("data-failed");
                });
        },
        endNodeCancel() {
            this.commitEnd = false;
        }
    }
};
</script>
<style type="text/css" lang="scss" rel="stylesheet/scss">
.post-index {
    .create-btns {
        display: flex;
        justify-content: center;
    }
    .vue-upload-file {
        left: 50% !important;
    }
}
</style>
