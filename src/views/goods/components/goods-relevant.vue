<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon"/>
      <span class="title">{{ goodsId ? '同类商品推荐' : '猜你喜欢' }}</span>
    </div>
    <!-- 此处使用改造后的web-carousel.vue -->
    <WebCarousel autoPlay :sliders="sliders"></WebCarousel>
  </div>
</template>

<script>
import { ref } from 'vue'
import { findRelGoods } from '@/api/product'

export default {
  // 同类推荐，猜你喜欢
  name: 'GoodsRelevant',
  components: {},

  props: {
    goodsId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 最终需要数据是sliders=[[4个商品],[4个商品],[4个商品],[4个商品]]
    const sliders = ref([])
    findRelGoods({ id: props.goodsId }).then(data => {
      // data.result商品列表 16个转成4个一组的形式
      const pageSize = 4
      const page = Math.ceil(data.result.length / pageSize)
      for (let i = 0; i < page; i++) {
        sliders.value.push(data.result.slice(pageSize * i, pageSize * (i + 1)))
      }
      // console.log(sliders)
    })
    return { sliders }
  }
}
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;

  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;

    .title {
      font-size: 20px;
      padding-left: 10px;
    }

    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @webColor;
      border-right: 4px solid @webColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);

      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@webColor, 40%);
      }
    }
  }
}
:deep(.web-carousel) {
  height: 380px;
  .carousel {
    &-indicator {
      bottom: 30px;
      span {
        &.active {
          background: @webColor;
        }
      }
    }
    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0,0,0,0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
  }
}
</style>
