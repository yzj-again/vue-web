<template>
  <div class="web-pagination">
    <a @click="changePage(myCurrentPage-1)" v-if="myCurrentPage>1" href="javascript:;">上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start>1">...</span>
    <a @click="changePage(i)" v-for="i in pager.btnArray" :key="i" href="javascript:;"
       :class="{active:i===myCurrentPage}">{{ i }}</a>
    <span v-if="pager.end<pager.pageCount">...</span>
    <a @click="changePage(myCurrentPage+1)" v-if="myCurrentPage<pager.pageCount" href="javascript:;">下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
// 1.是否禁用:需要知道当前页码是否时1
//  span 2.是否显示:需要知道第一个按钮页码是否是1
// 3.需要知道显示几个按钮
// 4.需要知道起始按钮页码,得到数组[3,4,5,6,7](理想)
// span 5.是否知道最后一个按钮页码是否等于总页数
// 6.是否禁用,需要知道当前页码是否等于总页数
// 需要按钮个数,当前页码,总页数,起始页码,结束页码,按钮数组
import { computed, ref, watch } from 'vue'

export default {
  name: 'WebPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 1.按钮的个数 5个,如果是动态的,需要设置成响应式数据
    const buttonCount = 5
    // 2.当前显示的页码
    const myCurrentPage = ref(1)
    // 3.总页数 = 总条数/每一页条数 向上取整
    const myTotal = ref(100)
    const myPageSize = ref(10)
    // 其他数据都可以依赖上面数据得到
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 起始页码,结束页码,按钮数组 需要按钮个数和当前页码
      // 1.理想情况 一边偏
      const offset = Math.floor(buttonCount / 2)
      let start = myCurrentPage.value - offset
      let end = start + buttonCount - 1
      // 2.如果起始页码<1
      if (start < 1) {
        start = 1
        end = (start + buttonCount - 1) > pageCount ? pageCount : (start + buttonCount - 1)
      }
      // 3.如果结束页码大于总页数
      if (end > pageCount) {
        end = pageCount
        start = (end - buttonCount + 1) < 1 ? 1 : (end - buttonCount + 1)
      }
      const btnArray = []
      for (let i = start; i <= end; i++) {
        btnArray.push(i)
      }
      return {
        pageCount,
        btnArray,
        start,
        end
      }
    })
    // 监听props的变化,更新组件内数据
    watch(props, () => {
      myTotal.value = props.total
      myCurrentPage.value = props.currentPage
      myPageSize.value = props.pageSize
      // 保证初始化拿到数据
    }, { immediate: true })
    // 切换分页
    const changePage = (page) => {
      myCurrentPage.value = page
      // 通知父组件
      emit('current-change', page)
    }
    return {
      myCurrentPage,
      pager,
      changePage
    }
  }
}
</script>
<style scoped lang="less">
.web-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;

  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;

    &:hover {
      color: @webColor;
    }

    &.active {
      background: @webColor;
      color: #fff;
      border-color: @webColor;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;

      &:hover {
        color: #333
      }
    }
  }

  > span {
    margin-right: 10px;
  }
}
</style>
