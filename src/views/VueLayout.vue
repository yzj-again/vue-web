<template>
  <div>
    <!--顶部通栏-->
    <AppNavbar></AppNavbar>
    <!--头部组件-->
    <AppHeader></AppHeader>
    <!--吸顶组件-->
    <AppHeaderSticky></AppHeaderSticky>
    <!--内容组件-->
    <div class="app-body">
      <!--二级路由-->
      <RouterView></RouterView>
    </div>
    <!--底部组件-->
    <AppFooter></AppFooter>
  </div>
</template>
<script>
import AppNavbar from '@/components/app-navbar'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import AppHeaderSticky from '@/components/app-header-sticky'
import { useStore } from 'vuex'

export default {
  name: 'VueLayout',
  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup () {
    // 获取首页数据
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>
<style>
.app-body {
  min-height: 600px;
}
</style>
