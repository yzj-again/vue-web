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
          <!--SKU组件 skuId="1369155864430120962"测试-->
          <GoodsSku :goods="goods" @change="changeSku" skuId="1369155864430120962"></GoodsSku>
          <!--数量选择-->
          <WebNumberBox v-model="num" :max="goods.inventory" label="数量"></WebNumberBox>
          <!--按钮组件-->
          <WebButton @click="insertCart" type="primary" style="margin-top:20px;">加入购物车</WebButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant></GoodsRelevant>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs></GoodsTabs>
          <!-- 注意事项 -->
          <GoodsWarn></GoodsWarn>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot></GoodsHot>
          <GoodsHot :type="2"></GoodsHot>
        </div>
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
import GoodsTabs from '@/views/goods/components/goods-tabs'
import GoodsHot from '@/views/goods/components/goods-hot'
import GoodsWarn from '@/views/goods/components/goods-warn'
import { nextTick, provide, ref, watch } from 'vue'
import { findGoods } from '@/api/product'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'

export default {
  name: 'WebGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    // 1.获取商品详情,进行渲染
    const goods = useGoods()
    const changeSku = (sku) => {
      // 修改商品的现价原价信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 记录选择后sku
      currSKU.value = sku
    }
    // 商品数量选择数据 双向数据绑定
    const num = ref(1)
    // 提供goods数据给后代组件使用
    provide('goods', goods)
    // 加入购物车
    const store = useStore()
    const currSKU = ref(null)
    const insertCart = () => {
      // 约定那些字段加入本地vuex
      // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
      if (currSKU.value && currSKU.value.skuId) {
        // 解构内容
        const {
          skuId,
          specsText: attrsText,
          inventory: stock
        } = currSKU.value
        const {
          id,
          name,
          price,
          mainPictures
        } = goods.value
        store.dispatch('cart/insertCart', {
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        }).then(() => {
          Message({
            type: 'success',
            text: '加入购物车成功'
          })
        })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }
    return {
      goods,
      changeSku,
      num,
      insertCart
    }
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
