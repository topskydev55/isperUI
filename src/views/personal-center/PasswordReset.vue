<template>
    <div class="password-reset container">
        <PersonalCenterTab activeTab="1"/>

        <b-form @submit.prevent="updatePassword" class="cardDiv">
            <b-form-group
                label-cols="4"
                label-cols-lg="2"
                label="旧密码 *"
                :description="err['old-p']"
            >
                <b-form-input
                    type="password"
                    v-model="password.old"
                    name="old-password"
                    v-validate="'required|min:5'"
                />
            </b-form-group>
            <b-form-group
                label-cols="4"
                label-cols-lg="2"
                label="新密码 *"
                :description="err['new-p']"
            >
                <b-form-input
                    type="password"
                    v-model="password.new"
                    name="new-password"
                    v-validate="'required|min:5'"
                />
            </b-form-group>
            <b-form-group
                label-cols="4"
                label-cols-lg="2"
                label="密码确认 *"
                :description="err['new-p-c']"
            >
                <b-form-input
                    type="password"
                    v-model="password.new_confirm"
                    name="new-password-confirmation"
                />
            </b-form-group>
            <b-form-group
                label-cols="4"
                label-cols-lg="2"
                label="手机验证码 *"
                :description="err['verification-code']"
            >
                <b-input-group>
                    <b-form-input
                        type="text"
                        v-model="password.verification_code"
                        name="verification-code"
                        v-validate="'required|min:5'"
                    />
                    <b-input-group-append is-text>{{maskedPhone}}</b-input-group-append>
                    <b-input-group-append>
                        <b-button
                            variant="primary"
                            @click="sendVerificationCode"
                            :disabled="session_expire_time > 0 || sendLabel !='获取'"
                        >{{(session_expire_time &lt;= 0) ? sendLabel: session_expire_time + ' s'}}</b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
            <b-button class="mr-2" type="submit" variant="primary">修改</b-button>
            <b-button type="button" @click="resetPassword">取消</b-button>
        </b-form>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import accountService from "@/services/accountService";
import PersonalCenterTab from "@/components/personal-center/PersonalCenterTab";

export default {
    name: "personal-info",
    components: { PersonalCenterTab },
    data() {
        return {
            password: {
                old: null,
                new: null,
                new_confirm: null,
                verification_code: null
            },
            err: {},
            session_expire_time: 0,
            sendLabel: "获取",
            timer: null
        };
    },
    computed: {
        ...mapState(["userInfo"]),
        maskedPhone() {
            if (!this.userInfo.phone) {
                return "请先去个人信息中绑定手机号";
            }
            var x = this.userInfo.phone
                .replace(/\D/g, "")
                .match(/(\d{3})(\d{6})(\d{2})/);
            return x[1] + "******" + x[3];
        }
    },
    created() {},
    methods: {
        ...mapActions({
            loginAction: "login"
        }),
        resetPassword() {
            this.password = {
                old: null,
                new: null,
                new_confirm: null,
                verification_code: null
            };
        },
        notSameValidation() {
            if (this.password.new != this.password.new_confirm)
                return "Password Confirmation does not match";
            return "";
        },
        validate() {
            this.err = Object.assign({}, this.err, {
                "old-p": this.errors.has("old-password")
                    ? this.errors
                          .first("old-password")
                          .replace("old-password", "Old Password")
                    : "",
                "new-p": this.errors.has("new-password")
                    ? this.errors
                          .first("new-password")
                          .replace("new-password", "New Password")
                    : "",
                "new-p-c": this.notSameValidation(),
                "verification-code": this.errors.has("verification-code")
                    ? this.errors
                          .first("verification-code")
                          .replace("verification-code", "Verification Code")
                    : ""
            });
            if (
                this.err["old-p"] ||
                this.err["new-p"] ||
                this.err["new-p-c"] ||
                this.err["verification-code"]
            ) {
                return false;
            } else return true;
        },
        updatePassword() {
            if (!this.userInfo.id) {
                alert("You have no permission");
                return;
            }
            this.$validator
                .validateAll()
                .then(() => {
                    if (!this.validate()) {
                        return;
                    }
                    this.password.id = this.userInfo.id;
                    this.password.login_type = this.userInfo.role;
                    accountService.updatePassword(this.password).then(() => {
                        this.err = {};
                        this.password = {
                            old: null,
                            new: null,
                            new_confirm: null,
                            verification_code: null
                        };
                        this.session_expire_time = 0;
                        if (this.timer) {
                            clearInterval(this.timer);
                        }
                        this.$toasted.success("重置密码成功");
                    });
                })
                .catch(() => {
                    this.validate();
                });
        },
        sendVerificationCode() {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.sendLabel = "发送中...";
            accountService
                .sendCode({
                    to: this.userInfo.phone
                })
                .then(
                    () => {
                        this.$toasted.success("验证码已发送到手机");
                        this.startTimer();
                        this.sendLabel = "获取";
                    },
                    () => {
                        this.sendLabel = "获取";
                    }
                )
                .catch(() => {
                    this.sendLabel = "获取";
                });
        },
        startTimer() {
            this.session_expire_time = 300;
            this.timer = setInterval(() => {
                if (this.session_expire_time <= 0) {
                    this.session_expire_time = 0;
                    clearInterval(this.timer);
                    return;
                }
                this.session_expire_time--;
            }, 1000);
        }
    }
};
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.password-reset {
    .text-muted.form-text {
        color: #dc3545 !important;
    }
}
</style>
