<template>
  <div class="home-product" ref="target">
    <HomePanel :title="category.name" v-for="category in list" :key="category.id">
      <template v-slot:right>
        <div class="sub">
          <RouterLink v-for="sub in category.children" :key="sub.id" :to="`/category/sub/${sub.id}`">{{sub.name}}</RouterLink>
        </div>
        <WebMore :path="`/category/${category.id}`"></WebMore>
      </template>
      <div class="box">
        <RouterLink class="cover" :to="`/category/${category.id}`">
          <img v-lazy="category.picture" alt="">
          <strong class="label">
            <span>{{category.name}}馆</span>
            <span>{{category.saleInfo}}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="item in category.goods" :key="item.id">
            <HomeGoods :goods="item"></HomeGoods>
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from '@/views/home/components/home-panel'
import HomeGoods from '@/views/home/components/home-goods'
import { useLazyData } from '@/hooks'
import { findProduct } from '@/api/home'

export default {
  name: 'HomeProduct',
  components: {
    HomePanel,
    HomeGoods
  },
  setup () {
    const {
      target,
      result
    } = useLazyData(findProduct)
    return {
      target,
      list: result
    }
  }
}
</script>

<style scoped lang='less'>
.home-product {
  background: #fff;
  height: 2900px;

  .sub {
    margin-bottom: 2px;

    a {
      padding: 2px 12px;
      font-size: 16px;
      border-radius: 4px;

      &:hover {
        background: @xtxColor;
        color: #fff;
      }

      &:last-child {
        margin-right: 80px;
      }
    }
  }

  .box {
    display: flex;

    .cover {
      width: 240px;
      height: 610px;
      margin-right: 10px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .label {
        width: 188px;
        height: 66px;
        display: flex;
        font-size: 18px;
        color: #fff;
        line-height: 66px;
        font-weight: normal;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate3d(0, -50%, 0);

        span {
          text-align: center;

          &:first-child {
            width: 76px;
            background: rgba(0, 0, 0, .9);
          }

          &:last-child {
            flex: 1;
            background: rgba(0, 0, 0, .7);
          }
        }
      }
    }

    .goods-list {
      width: 990px;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 240px;
        height: 300px;
        margin-right: 10px;
        margin-bottom: 10px;

        &:nth-last-child(-n+4) {
          margin-bottom: 0;
        }

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
