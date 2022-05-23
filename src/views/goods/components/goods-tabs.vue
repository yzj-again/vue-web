<template>
  <div class="goods-tabs">
    <nav>
      <a @click="activeName='GoodsDetail'" :class="{active:activeName==='GoodsDetail'}" href="javascript:;">商品详情</a>
      <a @click="activeName='GoodsComment'" :class="{active:activeName==='GoodsComment'}" href="javascript:;">商品评价<span>(500+)</span></a>
    </nav>
    <!-- 切换内容的地方 其实是两个组件 v-if也行,但还有其他方式-->
    <!--动态组件component,渲染一个元组件,根据is的值切换-->
    <!--is属性决定渲染-->
    <component :is="activeName"></component>
  </div>
</template>
<script>
import { ref } from 'vue'
import GoodsDetail from '@/views/goods/components/goods-detail'
import GoodsComment from '@/views/goods/components/goods-comment'

export default {
  name: 'GoodsTabs',
  components: {
    GoodsDetail,
    GoodsComment
  },
  setup () {
    // activeName的值GoodsDetail GoodsComment 控制激活那个
    const activeName = ref('GoodsDetail')
    return { activeName }
  }
}
</script>
<style scoped lang="less">
.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }

      &:first-child {
        border-right: 1px solid #f5f5f5;
      }

      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @webColor;
        }
      }
    }
  }
}
</style>
