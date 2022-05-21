<template>
  <div class="home-new">
    <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
      <template #right>
        <WebMore path="/"></WebMore>
      </template>
      <!--面板内容-->
      <div ref="target" style="position: relative;height: 426px;">
        <Transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <RouterLink :to="`/product/${item.id}`">
                <img v-lazy="item.picture" alt="">
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="price">&yen;{{ item.price }}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton v-else bg="#f0f9f4"></HomeSkeleton>
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>
<script>
import HomePanel from '@/views/home/components/home-panel'
import HomeSkeleton from '@/views/home/components/home-skeleton'
import { findNew } from '@/api/home'
import { useLazyData } from '@/hooks'

export default {
  name: 'HomeNew',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    // const goods = ref([])
    // findNew(6).then(data => {
    //   goods.value = data.result.filter((item) => (item.desc !== null))
    // })
    // const target = ref(null)
    // 每次都得先声明target再传入,将target放在函数里声明
    // const result = useLazyData(target, findNew)
    // return {
    //   goods: result,
    //   target
    // }
    // 这里即返回了target也返回了数据
    // 1.返回的target也是空响应式对象,为了满足绑定dom元素
    // 2.传一个api接口拿数据
    const { target, result } = useLazyData(findNew)
    return { goods: result, target }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;

  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }

    .price {
      color: @priceColor;
    }
  }
}
</style>
