<template>
  <WebBread>
    <WebBreadItem to="/">首页</WebBreadItem>
    <WebBreadItem :key="category.top.id"
                  v-if="category.top"
                  :to="`/category/${category.top.id}`">{{ category.top.name }}
    </WebBreadItem>
    <Transition name="fade-right" mode="out-in">
      <WebBreadItem :key="category.sub.id"
                    v-if="category.sub">{{ category.sub.name }}
      </WebBreadItem>
    </Transition>
  </WebBread>
</template>
<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'SubBread',
  setup () {
    // 通过计算属性拿到顶级和二级类目的数据
    // 在vuex中 对象:{top:{id,name},sub:{id:name}}
    // 需要拿到地址栏id
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      // 完成数据获取逻辑
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = {
              id: top.id,
              name: top.name
            }
            cate.sub = {
              id: sub.id,
              name: sub.name
            }
          }
        }
      })
      return cate
    })
    return { category }
  }
}
</script>
<style scoped lang="less">

</style>
