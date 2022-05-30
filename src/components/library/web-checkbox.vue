<template>
  <div class="web-checkbox" @click="changeChecked">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </div>
</template>
<script>
// span接受label文字

// v-model === :modelValue + @update:modelValue
import { useVModel } from '@vueuse/core/index'

export default {
  name: 'WebCheckbox',
  props: {
    // 是否选中依赖modelValue
    modelValue: { // a
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 使用useVModel实现双向数据绑定v-model指令
    // 1.使用props接收modelValue
    // 2.使用useVModel来包装props中的modelValue属性的响应式数据
    // 3.在使用checked.value就是使用父组件数据
    // 4.在使用checked.value = '数据' 在赋值时,触发emit('update:modelValue', '数据')
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      // 通知父组件
      // checked.value = newVal
      checked.value = newVal

      // 让组件支持chang事件
      emit('change', newVal)
    }
    return {
      checked,
      changeChecked
    }
  }
}
</script>
<style scoped lang="less">
.web-checkbox {
  display: inline-block;
  margin-right: 2px;

  .icon-checked {
    color: @webColor;

    ~ span {
      color: @webColor;
    }
  }

  i {
    position: relative;
    top: 1px;
  }

  span {
    margin-left: 2px;
  }
}
</style>
