<template>
  <div class="web-confirm" :class="{fade}">
    <div class="wrapper" :class="{fade}">
      <div class="header">
        <h3>{{ title }}</h3>
        <a @click="cancel" href="JavaScript:;" class="iconfont icon-close-new"></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{ text }}</span>
      </div>
      <div class="footer">
        <WebButton @click="cancel" size="mini" type="gray">取消</WebButton>
        <WebButton @click="submit" size="mini" type="primary">确认</WebButton>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue'
import WebButton from '@/components/library/web-button'

export default {
  name: 'WebConfirm',
  components: {
    WebButton
  },
  props: {
    title: {
      type: String,
      default: '温馨提示'
    },
    text: {
      type: String,
      default: ''
    },
    cancelCallback: {
      type: Function
    },
    submitCallback: {
      type: Function
    }
  },
  setup (props) {
    // 默认是隐藏的
    const fade = ref(false)
    // 组件渲染完后
    onMounted(() => {
      // 立马加动画不会立即生效
      // 当元素渲染完毕立即过渡的动画不会触发
      setTimeout(() => {
        fade.value = true
      }, 0)
    })
    // 在这里如何触发promise的resolve,reject方法
    // 用props传递函数、对象
    // 取消
    const cancel = () => {
      props.cancelCallback()
    }
    // 确认
    const submit = () => {
      props.submitCallback()
    }
    return {
      cancel,
      submit,
      fade
    }
  }
}
</script>
<style scoped lang="less">
.web-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0, 0, 0, 0);

  &.fade {
    transition: all 0.4s;
    background: rgba(0, 0, 0, .5);
  }

  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    opacity: 0;

    &.fade {
      transition: all 0.4s;
      transform: translate(-50%, -50%);
      opacity: 1;
    }

    .header, .footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }

    .body {
      padding: 20px 40px;
      font-size: 16px;

      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }

    .footer {
      text-align: right;

      .xtx-button {
        margin-left: 20px;
      }
    }

    .header {
      position: relative;

      h3 {
        font-weight: normal;
        font-size: 18px;
      }

      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;

        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
