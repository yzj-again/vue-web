<template>
  <div class="top-category">
    <div class="container">
      <!--面包屑-->
      <WebBread>
        <WebBreadItem :to="{path:'/'}">首页</WebBreadItem>
        <!--从虚拟节点的角度理解,虚拟DOM的创建和移除-->
        <!--但此时有卡顿,用多个元素的过渡-->
        <!--不同的key可以创建和移除元素,创造动画发生条件-->
        <Transition name="fade-right" mode="out-in">
          <WebBreadItem :key="topCategory.id">{{ topCategory.name }}</WebBreadItem>
        </Transition>
      </WebBread>
      <!--轮播图-->
      <WebCarousel :sliders="sliders" style="height:500px"/>
      <!--全部分类-->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" alt="">
              <p>{{ sub.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!--各个分类推荐商品-->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>- {{ sub.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <WebMore :path="`/category/sub/${sub.id}`"></WebMore>
        </div>
        <div class="body">
          <GoodsItem v-for="goods in sub.goods" :key="goods.id" :goods="goods"></GoodsItem>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { findBanner } from '@/api/home'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from '@/views/category/components/goods-item'
import { findTopCategory } from '@/api/category'

export default {
  name: 'TopCategory',
  components: { GoodsItem },
  setup () {
    // console.log('setup')
    // 只更新一次,数据的变化是因为计算属性的原因
    // 所以以后第二次获取二次分类的请求时是不会获取到数据的
    // 路由对应的组件何时初始化?当路由规则发生变化时
    // 当从居家到美食,是同一个路由规则,所以通过地址栏变化加载数据

    // 轮播图
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })

    // 面包屑和所有子分类 在vuex中
    const store = useStore()
    // 还得获取路由id
    const route = useRoute()
    // 根据地址栏数据得到新数据
    const topCategory = computed(() => {
      let cate = {}
      // 当前顶级分类 根据路由上的id去vuex中category模块list中查找
      // console.log(route.params.id)
      // console.log(store.state.category.list)
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })
    // 获取各个子类目下的商品数据
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    // 监听对象下的属性,用一个函数监听
    watch(() => route.params.id, (newVal) => {
      // newVal && getSubList() // 从有到另一个才发数据
      // 解决从一级到二级乱发请求问题
      if (newVal && `/category/${newVal}` === route.path) {
        getSubList()
      }
    }, { immediate: true })
    return {
      sliders,
      topCategory,
      subList
    }
  }

}
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }

  .sub-list {
    margin-top: 20px;
    background-color: #fff;

    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;

      li {
        width: 168px;
        height: 160px;

        a {
          text-align: center;
          display: block;
          font-size: 16px;

          img {
            width: 100px;
            height: 100px;
          }

          p {
            line-height: 40px;
          }

          &:hover {
            color: @webColor;
          }
        }
      }
    }
  }

  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;

    .head {
      .web-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }

      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }

    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}

</style>
