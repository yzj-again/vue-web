<template>
  <div class="sub-category">
    <div class="container">
      <!--面包屑-->
      <SubBread></SubBread>
      <!--筛选区-->
      <SubFilter @filter-change="filterChange"></SubFilter>
      <!--商品面板(排序加列表)-->
      <div class="goods-list">
        <!-- 排序 -->
        <!--sortChange也可以,sort-change-->
        <SubSort @sort-change="sortChange"></SubSort>
        <!-- 列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <GoodsItem :goods="item"/>
          </li>
        </ul>
        <WebInfiniteLoading @infinite="getData" :loading="loading" :finished="finished"></WebInfiniteLoading>
      </div>
    </div>
  </div>
</template>
<script>
import SubBread from '@/views/category/components/sub-bread'
import SubFilter from '@/views/category/components/sub-filter'
import SubSort from '@/views/category/components/sub-sort'
import GoodsItem from '@/views/category/components/goods-item'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'

export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup () {
    const route = useRoute()
    // 加载数据
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 请求参数
    let requestParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      loading.value = true
      //  设置二级分类的id
      requestParams.categoryId = route.params.id
      findSubCategoryGoods(requestParams).then(({ result }) => {
        // 获取数据 解构出了result->items才是商品数据`
        if (result.items.length) {
          // 有数据就追加
          goodsList.value.push(...result.items)
          // 把page改成下一页页码
          requestParams.page++
        } else {
          // 没有数据,代表加载完成
          finished.value = true
        }
        loading.value = false
      })
    }
    // 在更改了二级分类数据的时候需要重新加载
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        finished.value = false
        goodsList.value = []
        // 导致列表为空,组件就顶上来了,进入可视区就会加载
        requestParams = {
          page: 1,
          pageSize: 20
        }
      }
    })
    // 1.更改排序组件的筛选数据,重新发请求
    const sortChange = (sortParams) => {
      // console.log(sortParams)
      finished.value = false
      // 合并请求,保留之前的参数
      requestParams = { ...requestParams, ...sortParams }
      requestParams.page = 1
      goodsList.value = []
    }
    // 2.更改排序组件的筛选数据,重新发请求
    const filterChange = (filterParams) => {
      // console.log(filterParams)
      finished.value = false
      // 合并请求,保留之前的参数
      requestParams = { ...requestParams, ...filterParams }
      requestParams.page = 1
      goodsList.value = []
    }
    return {
      loading,
      finished,
      getData,
      goodsList,
      sortChange,
      filterChange
    }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;

    li {
      margin-right: 20px;
      margin-bottom: 20px;

      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
