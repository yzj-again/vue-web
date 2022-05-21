<template>
  <div class="web-infinite-loading" ref="target">
    <div class="loading" v-if="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core/index'

export default {
  name: 'WebInfiniteLoading',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const target = ref(null)
    // 监听target是否进入可视区
    // 解构接受
    useIntersectionObserver(target, ([isIntersecting]) => {
      if (isIntersecting) {
        // console.log('进入可视区')
        // 触发加载条件:1.必须请求加载完成loading,2数据已经加载完成finished
        if (!props.loading && !props.finished) {
          // infinite 事件是属于子组件的
          // 事件原则,谁绑定,谁触发
          // 在当前组件emit的是自己的事件
          // 只不过是在外面绑定了父组件的方法(在外面看到了这个事件)
          // 子组件触发我自己的事件,但由于绑定的是父组件里的方法
          // 子父通信
          emit('infinite')
        }
      }
    }, {
      threshold: 0
    })
    return { target }
  }

}
</script>

<style scoped lang='less'>
.web-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;

    .img {
      width: 50px;
      height: 50px;
      background: url(../../assets/images/load.gif) no-repeat center / contain;
    }

    .text {
      color: #999;
      font-size: 16px;
    }
  }

  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;

    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }

    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
