<template>
  <div class="web-bread-item">
    <RouterLink v-if="to" :to="to">
      <slot></slot>
    </RouterLink>
    <span v-else><slot></slot></span>
  </div>
</template>
<script>
// 代码片段里不能乱写
export default {
  name: 'WebBreadItem',
  props: {
    to: {
      type: [String, Object],
      default: ''
    }
  }
}
</script>
<style scoped lang="less">

</style>
