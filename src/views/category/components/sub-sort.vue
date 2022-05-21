<template>
  <div class='sub-sort'>
    <div class="sort">
      <a :class="{active:sortParams.sortField===null}" @click="changeSort(null)" href="javascript:;">默认排序</a>
      <a :class="{active:sortParams.sortField==='publishTime'}" @click="changeSort('publishTime')" href="javascript:;">最新商品</a>
      <a :class="{active:sortParams.sortField==='orderNum'}" @click="changeSort('orderNum')"
         href="javascript:;">最高人气</a>
      <a :class="{active:sortParams.sortField==='evaluateNum'}" @click="changeSort('evaluateNum')" href="javascript:;">评论最多</a>
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i class="arrow up" :class="{active:sortParams.sortField==='price' && sortParams.sortMethod==='asc'}"/>
        <i class="arrow down" :class="{active:sortParams.sortField==='price' && sortParams.sortMethod==='desc'}"/>
      </a>
    </div>
    <div class="check">
      <WebCheckbox @change="changeCheck" v-model="sortParams.inventory">仅显示有货商品</WebCheckbox>
      <WebCheckbox @change="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</WebCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'

export default {
  name: 'SubSort',
  setup (props, { emit }) {
    // 实现交互(实现交互数据和后台保持一致)
    // 1.明确交互数据
    const sortParams = reactive({
      inventory: false,
      onlyDiscount: false,
      sortField: null,
      sortMethod: null
    })
    // 2.提供给模板使用
    // 3.绑定按钮的点击事件,修改排序方式
    // sortField====>publishTime,orderNum,price,evaluateNum
    // sortMethod====>asc为正序 desc为倒序
    // 通过传参判断
    const changeSort = (sortField) => {
      // 单独处理价格
      if (sortField === 'price') {
        sortParams.sortField = sortField
        // 处理箭头
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        // 如果已经选中,组织点击
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        // 其他排序方法为降序
        sortParams.sortMethod = null
      }
      // 触发事件 sort-change事件 通知父组件
      emit('sort-change', sortParams)
    }

    const changeCheck = () => {
      // 触发事件 sort-change事件 通知父组件
      emit('sort-change', sortParams)
    }
    return {
      sortParams,
      changeSort,
      changeCheck
    }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .sort {
    display: flex;

    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;

      &.active {
        background: @webColor;
        border-color: @webColor;
        color: #fff;
      }

      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;

        &.up {
          top: 3px;
          border-bottom-color: #bbb;

          &.active {
            border-bottom-color: @webColor;
          }
        }

        &.down {
          top: 15px;
          border-top-color: #bbb;

          &.active {
            border-top-color: @webColor;
          }
        }
      }
    }
  }

  .check {
    .web-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
