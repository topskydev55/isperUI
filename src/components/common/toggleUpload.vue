<template>
  <div class="toggle-upload-wrapper">
    <a class="upload-btn" href="javascript:;" @click.stop="toggleUploadShow()"><i class="iconfont icon-upload"></i>{{success ? '已上传' : '上传'}}</a>
    <my-upload url="/api/file/upload"
      :only-single="true"
      :value="uploadShow"
      field="file"
      :keyId="key"
      max-size="2048"
      :only-img="true"
      @uploadSuccess="uploadSuccess"
      @uploadFail="uploadFail">
    </my-upload>
  </div>
</template>
<script type="text/ecmascript-6">
import upload from 'components/upload/upload'
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
      uploadShow: false,
      success: false,
      key: 0
    }
  },
  methods: {
    // 渲染动画1上传框显示与隐藏
    toggleUploadShow() {
      this.uploadShow = !this.uploadShow
    },
    // 渲染动画上传成功回调
    uploadSuccess(data, field, key) {
      if (data.c === 0) {
        if (this.keyId === 1) this.item.animation1 = data.d
        if (this.keyId === 2) this.item.animation2 = data.d
        this.$emit('uploadSuccess', this.item)
        this.success = true
        this.uploadShow = false
      } else {
        this.$toast.error(data.m)
        this.success = false
      }
    },
    // 渲染动画上传失败回调
    uploadFail(status, field, key) {
      this.$toast.error('上传失败')
      this.success = false
      // console.log(status)
      // console.log('field: ' + field)
      // console.log('key: ' + key)
    }
  },
  components: {
    'my-upload': upload
  },
  mounted() {
    document.addEventListener('click', () => {
      this.uploadShow = false
    })
  }
}
</script>
<style>
.upload-btn {
    border: none;
    display: inline-block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #91DABF;
    border-radius: 4px;
    text-align: center;
}
.upload-btn .icon-upload{
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
