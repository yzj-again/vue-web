<template>
  <div class="web-numberBox">
    <div class="label" v-if="label">{{label}}</div>
    <div class="numberBox">
      <a @click="changeNum(-1)" href="javascript:;">-</a>
      <!--不用v-model,只是用不改-->
      <input type="text" readonly :value="modelValue">
      <a @click="changeNum(1)" href="javascript:;">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core/index'

export default {
  name: 'WebNumberBox',
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Number,
      default: 1
    },
    // 最大最小
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 10
    }

  },
  setup (props, { emit }) {
    // 1.按钮点击事件 -按钮 +按钮 同一个事件
    // 2.使用vueUse的useModel做数据绑定  count是响应式数据
    const count = useVModel(props, 'modelValue', emit)
    const changeNum = (step) => {
      // 3.得到将要改变的值,如果不合法,中止
      const newValue = count.value + step
      if (newValue < props.min || newValue > props.max) return
      count.value = newValue
      // 暴漏change事件
      emit('change', newValue)
    }
    return {
      changeNum,
      count
    }
  }
}
</script>
<style scoped lang="less">
.web-numberBox {
  display: flex;
  align-items: center;

  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }

  .numberBox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;

    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;

      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }

      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }

    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
