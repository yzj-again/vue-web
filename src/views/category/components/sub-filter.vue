<template>
  <!-- 筛选区 -->
  <!--不用v-if刷新请求数据,在同级类目下切换不会有骨架屏-->
  <div class="sub-filter" v-if="filterDate && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <!--        filterDate.brands.selectedBrand=item.id-->
        <a @click="changeBrand(item.id)" :class="{active:item.id===filterDate.selectedBrand}"
           href="javascript:;" v-for="item in filterDate.brands" :key="item.id">{{ item.name }}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterDate.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}</div>
      <div class="body">
        <a @click="changeProps(item,prop.id)" :class="{active:prop.id===item.selectedProp}" href="javascript:;"
           v-for="prop in item.properties" :key="prop.id">{{ prop.name }}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <WebSkeleton class="item" width="800px" height="40px"></WebSkeleton>
    <WebSkeleton class="item" width="800px" height="40px"></WebSkeleton>
    <WebSkeleton class="item" width="600px" height="40px"></WebSkeleton>
    <WebSkeleton class="item" width="600px" height="40px"></WebSkeleton>
    <WebSkeleton class="item" width="600px" height="40px"></WebSkeleton>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'

export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 监听二级类目id的变化,获取筛选数据
    const filterDate = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      // 变化后id有值,且处于二级类目路由下
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = true
        // 发送请求
        findSubCategoryFilter(route.params.id).then(data => {
          // 每一个可选条件缺失 全部条件,处理下数据
          // 给每一组数据加上当前选中数据的id
          // 品牌
          data.result.selectedBrand = null
          // console.log(data) data里包着数据result
          data.result.brands.unshift({
            id: null,
            name: '全部'
          })
          // 属性
          data.result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({
              id: null,
              name: '全部'
            })
          })
          filterDate.value = data.result
          filterLoading.value = false
          // console.log(data.result)
        })
      }
    }, { immediate: true })
    // 获取筛选参数的函数
    const getFilterParams = () => {
      // 参考数据{brandId:'',attrs:[{groupName:'',propertyName:''},{..}]}
      const obj = {
        brandId: null,
        attrs: []
      }
      // 品牌
      obj.brandId = filterDate.value.selectedBrand
      // 销售属性
      // saleProperties 一整大块 一行是item
      // item 有属性properties
      filterDate.value.saleProperties.forEach(item => {
        // 记录这一行选中了什么筛选条件selectedProp 通过id
        if (item.selectedProp) {
          const prop = item.properties.find(prop => prop.id === item.selectedProp)
          obj.attrs.push({
            groupName: item.name,
            propertyName: prop.name
          })
        }
      })
      // obj.attrs = null直接就不会发请求给后台
      // header都看不都筛选参数
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }
    // 1.记录当前选中的品牌
    const changeBrand = (brandId) => {
      if (filterDate.value.selectedBrand === brandId) return
      filterDate.value.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }
    // 2.记录当前选中的筛选条件
    const changeProps = (item, propId) => {
      // 取消重复点击
      if (item.selectedProp === propId) return
      item.selectedProp = propId
      emit('filter-change', getFilterParams())
    }
    return {
      filterDate,
      filterLoading,
      changeBrand,
      changeProps
    }
  }
}
</script>
<style scoped lang='less'>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;

  .item {
    display: flex;
    line-height: 40px;

    .head {
      width: 80px;
      color: #999;
    }

    .body {
      flex: 1;

      a {
        margin-right: 36px;
        transition: all .3s;
        display: inline-block;

        &.active,
        &:hover {
          color: @webColor;
        }
      }
    }
  }

  .web-skeleton {
    padding: 10px 0;
  }
}
</style>
