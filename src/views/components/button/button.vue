<template>
    <button :type="htmlType" :class="classes" :disabled="disabled">
        <!-- <Icon class="ivu-load-loop" type="load-c" v-if="loading"></Icon>
        <Icon :type="icon" v-if="icon && !loading"></Icon> -->
        <span v-if="showSlot" ref="slot"><slot></slot></span>
    </button>
</template>
<script>
  import { oneOf } from 'utils/assist'

  const prefixCls = 'btn'

  export default {
    // components: { Icon },
    props: {
      type: {
        validator (value) {
          return oneOf(value, ['green', 'blue'])
        }
      },
      shape: {
        validator (value) {
          return oneOf(value, ['circle', 'circle-outline'])
        }
      },
      size: {
        validator (value) {
          return oneOf(value, ['small', 'large'])
        }
      },
      loading: Boolean,
      disabled: Boolean,
      htmlType: {
        default: 'button',
        validator (value) {
          return oneOf(value, ['button', 'submit', 'reset'])
        }
      },
      icon: String,
      long: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        showSlot: true
      }
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-${this.type}`]: !!this.type,
            [`${prefixCls}-long`]: this.long,
            [`${prefixCls}-${this.shape}`]: !!this.shape,
            [`${prefixCls}-${this.size}`]: !!this.size,
            [`${prefixCls}-loading`]: this.loading != null && this.loading,
            [`${prefixCls}-icon-only`]: !this.showSlot && (!!this.icon || this.loading)
          }
        ]
      }
    },
    compiled () {
      this.showSlot = this.$refs.slot.innerHTML.replace(/\n/g, '').replace(/<!--[\w\W\r\n]*?-->/gmi, '') !== ''
    }
  }
</script>
