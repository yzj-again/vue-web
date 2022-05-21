<template>
  <div class="goods-image">
    <!--右侧放大大图,已经放大了一倍-->
    <div v-show="show" class="large" :style="[{backgroundImage:`url(${images[currIndex]})`},largePosition]"></div>
    <!--中图-->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="">
      <!--遮罩层-->
      <div v-show="show" class="layer" :style="layerPosition"></div>
    </div>
    <ul class="small">
      <li v-for="(img,i) in images" :key="img" :class="{active:i===currIndex}">
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core/index'

export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    // currIndex是当前默认的图片索引位置
    const currIndex = ref(0)
    // 实现图片放大
    // 1.是否显示遮罩层和放大图
    const show = ref(false)
    // 2.遮罩的坐标 - 对象(定义成样式css中left,top)
    const layerPosition = reactive({
      left: 0,
      top: 0
    })
    // 3.放大图的背景定位(样式的方式)
    const largePosition = reactive({
      // backgroundPositionX: '1px',
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })
    // 4.使用useMouseInElement方法获取基于元素的偏移量
    // 设置监听元素
    const target = ref(null)
    const {
      elementX,
      elementY,
      isOutside
    } = useMouseInElement(target)
    watch([elementX, elementY, isOutside], () => {
      // console.log(elementX) 均为响应式数据 .value
      // console.log(isOutside)
      // 5.根据数据设置样式数据和是否显示数据
      // 设置是否显示预览大图
      show.value = !(isOutside.value)
      // 临时记录
      const position = {
        x: 0,
        y: 0
      }
      if (elementX.value < 100) {
        position.x = 0
      } else if (elementX.value > 300) {
        position.x = 200
      } else {
        position.x = elementX.value - 100
      }
      if (elementY.value < 100) {
        position.y = 0
      } else if (elementY.value > 300) {
        position.y = 200
      } else {
        position.y = elementY.value - 100
      }
      // 给样式赋值
      layerPosition.left = position.x + 'px'
      layerPosition.top = position.y + 'px'
      // 设置大背景的定位
      largePosition.backgroundPositionX = -2 * position.x + 'px'
      largePosition.backgroundPositionY = -2 * position.y + 'px'
    })
    return {
      currIndex,
      show,
      layerPosition,
      largePosition,
      target
    }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;

  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }

  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    // 遮罩层要定位
    position: relative;
    // 移动图标
    cursor: move;

    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, .2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }

  .small {
    width: 80px;

    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;

      &:hover, &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
