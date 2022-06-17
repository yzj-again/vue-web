<template>
  <div class="web-cart-page">
    <div class="container">
      <WebBread>
        <WebBreadItem to="/">首页</WebBreadItem>
        <WebBreadItem>购物车</WebBreadItem>
      </WebBread>
      <div class="cart">
        <table>
          <thead>
          <tr>
            <th width="120">
              <WebCheckbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选</WebCheckbox>
            </th>
            <th width="400">商品信息</th>
            <th width="220">单价</th>
            <th width="180">数量</th>
            <th width="180">小计</th>
            <th width="140">操作</th>
          </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
          <tr v-if="$store.getters['cart/validList'].length===0">
            <td colspan="6">
              <CartNone></CartNone>
            </td>
          </tr>
          <tr v-for="goods in $store.getters['cart/validList']" :key="goods.skuId">
            <td>
              <WebCheckbox :modelValue="goods.selected" @change="($event)=>checkOne(goods.skuId,$event)"></WebCheckbox>
            </td>
            <td>
              <div class="goods">
                <RouterLink :to="`/product/${goods.id}`">
                  <img :src="goods.picture" alt="">
                </RouterLink>
                <div>
                  <p class="name ellipsis">{{ goods.name }}</p>
                  <!-- 选择规格组件 -->
                </div>
              </div>
            </td>
            <td class="tc">
              <p>&yen;{{ goods.nowPrice }}</p>
              <p v-if="goods.price-goods.nowPrice>0">比加入时降价 <span
                class="red">&yen;{{ goods.price - goods.nowPrice }}</span></p>
            </td>
            <td class="tc">
              <WebNumberBox :modelValue="goods.count"></WebNumberBox>
            </td>
            <td class="tc">
              <p class="f16 red">&yen;{{ Math.round(goods.nowPrice * 100) * goods.count / 100 }}</p>
            </td>
            <td class="tc">
              <p><a href="javascript:;">移入收藏夹</a></p>
              <p><a @click="deleteCart(goods.skuId)" class="green" href="javascript:;">删除</a></p>
              <p><a href="javascript:;">找相似</a></p>
            </td>
          </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length">
          <tr>
            <td colspan="6"><h3 class="tit">失效商品</h3></td>
          </tr>
          <tr v-for="goods in $store.getters['cart/invalidList']" :key="goods.id">
            <td>
              <WebCheckbox style="color:#eee;"></WebCheckbox>
            </td>
            <td>
              <div class="goods">
                <RouterLink :to="`/product/${goods.id}`">
                  <img :src="goods.picture" alt="">
                </RouterLink>
                <div>
                  <p class="name ellipsis">{{ goods.name }}</p>
                  <p class="attr">{{ goods.attrsText }}</p>
                </div>
              </div>
            </td>
            <td class="tc"><p>&yen;{{ goods.nowPrice }}</p></td>
            <td class="tc">{{ goods.count }}</td>
            <td class="tc"><p>&yen;{{ Math.round(goods.nowPrice * 100) * goods.count / 100 }}</p></td>
            <td class="tc">
              <p><a @click="deleteCart(goods.skuId)" class="green" href="javascript:;">删除</a></p>
              <p><a href="javascript:;">找相似</a></p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <WebCheckbox @change="checkAll" :modelValue="$store.getters['cart/isCheckAll']">全选</WebCheckbox>
          <a href="javascript:;">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ $store.getters['cart/validTotal'] }} 件商品，已选择 {{ $store.getters['cart/selectedTotal'] }} 件，商品合计：
          <span class="red">¥{{ $store.getters['cart/selectedAmount'] }}</span>
          <WebButton type="primary">下单结算</WebButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant></GoodRelevant>
    </div>
  </div>
</template>
<script>
import GoodRelevant from '@/views/goods/components/goods-relevant'
import { useStore } from 'vuex'
import CartNone from '@/views/cart/components/cart-none'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'

export default {
  name: 'WebCartPage',
  components: { CartNone, GoodRelevant },
  setup () {
    // $event当前传递的数据
    const store = useStore()
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', {
        skuId,
        selected
      })
    }
    // 全选
    const checkAll = (selected) => {
      store.dispatch('cart/checkAllCart', selected)
    }
    // 删除
    const deleteCart = (skuId) => {
      Confirm({ text: '亲，您是否确认删除商品' }).then(() => {
        store.dispatch('cart/deleteCart', skuId).then(() => {
          Message({ type: 'success', text: '删除成功' })
        })
      }).catch(e => {
        console.log('2')
      })
    }
    return { checkOne, checkAll, deleteCart }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;

  .web-numberBox {
    margin: 0 auto;
    width: 120px;
  }
}

.red {
  color: @priceColor;
}

.green {
  color: @webColor
}

.f16 {
  font-size: 16px;
}

.goods {
  display: flex;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }

  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;

    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}

.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;

  .web-checkbox {
    color: #999;
  }

  .batch {
    a {
      margin-left: 20px;
    }
  }

  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}

.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}

.web-cart-page {
  .cart {
    background: #fff;
    color: #666;

    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;

      th, td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }

      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
