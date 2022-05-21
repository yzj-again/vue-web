<template>
  <div class='web-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <WebBread>
        <WebBreadItem to="/">首页</WebBreadItem>
        <WebBreadItem :to="`/category/${goods.categories[1].id}`">{{
            goods.categories[1].name
          }}
        </WebBreadItem>
        <WebBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{
            goods.categories[0].name
          }}
        </WebBreadItem>
        <WebBreadItem>{{ goods.name }}</WebBreadItem>
      </WebBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures"></GoodsImage>
          <GoodsSales></GoodsSales>
        </div>
        <div class="spec">
          <GoodsName :goods="goods"></GoodsName>
          <!--SKU组件-->
          <GoodsSku :goods="goods"></GoodsSku>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant></GoodsRelevant>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs"></div>
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside"></div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from '@/views/goods/components/goods-relevant'
import GoodsImage from '@/views/goods/components/goods-image'
import GoodsSales from '@/views/goods/components/goods-sales'
import GoodsName from '@/views/goods/components/goods-name'
import GoodsSku from '@/views/goods/components/goods-sku'
import { nextTick, ref, watch } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'

export default {
  name: 'WebGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku
  },
  setup () {
    // 1.获取商品详情,进行渲染
    const goods = useGoods()
    return { goods }
  }
}
// 方法封装在外面,将来逻辑太多怎么办
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    // console.log(newVal) 侦听的是当前的路由path
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        // console.log(data)
        // 让商品数据为空,然后使用v-if的组件可以重新销毁和创建
        goods.value = null
        // 上面数据还没生效就别直接覆盖了
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  }, { immediate: true })
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;

  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }

  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}

.goods-footer {
  display: flex;
  margin-top: 20px;

  .goods-article {
    width: 940px;
    margin-right: 20px;
  }

  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;
}

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
