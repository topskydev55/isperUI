<template>
    <div class="toggle-upload-wrapper">
        <b-button
            size="sm"
            class="styledBtn"
            variant="outline-primary"
            @click.stop="toggleUploadShow()"
        >
            <icon name="upload"></icon>
            &nbsp;{{success ? '已上传' : '上传'}}
        </b-button>
        <my-upload
            :url="apiRootPath + '/file/upload'"
            :only-single="true"
            :value="uploadShow"
            field="file"
            :keyId="key"
            max-size="2048"
            :only-img="true"
            @uploadSuccess="uploadSuccess"
            @uploadFail="uploadFail"
        ></my-upload>
    </div>
</template>
<script>
import Upload from "./Upload";
export default {
    props: {
        item: {},
        keyId: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            apiRootPath: process.env.VUE_APP_API_ENDPOINT,
            uploadShow: false,
            success: false,
            key: 0
        };
    },
    methods: {
        // 渲染动画1上传框显示与隐藏
        toggleUploadShow() {
            this.uploadShow = !this.uploadShow;
        },
        // 渲染动画上传成功回调
        // eslint-disable-next-line
        uploadSuccess(data, field, key) {
            if (data.c === 0) {
                var file_url =
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    data.d.url;
                this.$copyText(file_url)
                    .then(() => {
                        this.$toasted.success("链接复制完了");
                        this.$emit("uploadSuccess");
                        this.success = true;
                        this.uploadShow = false;
                    })
                    .catch(() => {
                        this.$toasted.error("链接复制失败");
                        this.success = false;
                    });
            } else {
                this.$toasted.error(data.m);
                this.success = false;
            }
        },
        // 渲染动画上传失败回调
        // eslint-disable-next-line
        uploadFail(status, field, key) {
            this.$toasted.error("上传失败");
            this.success = false;
        }
    },
    components: {
        "my-upload": Upload
    },
    mounted() {
        document.addEventListener("click", () => {
            this.uploadShow = false;
        });
    }
};
</script>
<style>
.upload-btn {
    border: none;
    display: inline-block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #91dabf;
    border-radius: 4px;
    text-align: center;
}
.upload-btn .icon-upload {
    color: #00c175;
    font-size: 16px;
    margin-right: 4px;
}
.toggle-upload-wrapper {
    position: relative;
}
.toggle-upload-wrapper .vue-upload-file .vuf-drop-area {
    border: 2px solid rgba(0, 0, 0, 0.8);
}
</style>
