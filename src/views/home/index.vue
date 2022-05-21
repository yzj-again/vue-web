<template>
  <!--网页的左侧分类和轮播图构成首页入口-->
  <div class="home-entry">
    <div class="container">
      <!--左侧分类-->
      <HomeCategory></HomeCategory>
      <!--轮播图-->
      <HomeBanner></HomeBanner>
    </div>
    <!--新鲜好物,人气推荐 通栏布局-->
    <HomeNew></HomeNew>
    <HomeHot></HomeHot>
    <HomeBrand></HomeBrand>
    <HomeProduct></HomeProduct>
    <HomeSpecial></HomeSpecial>
  </div>
</template>
<script>
// vue插件注册全局组件
import HomeCategory from '@/views/home/components/home-category'
import HomeBanner from '@/views/home/components/home-banner'
import HomeNew from '@/views/home/components/home-new'
import HomeHot from '@/views/home/components/home-hot'
import HomeBrand from '@/views/home/components/home-brand'
import HomeProduct from '@/views/home/components/home-product'
import HomeSpecial from '@/views/home/components/home-special'
export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  }
}
</script>
<style scoped lang="less">
</style>
