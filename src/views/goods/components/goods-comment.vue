<template>
  <div class="goods-comment">
    <!--评价头部-->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{ commentInfo.salesCount }}</span><span>人购买</span></p>
        <p><span>{{ commentInfo.praisePercent }}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a v-for="(item,index) in commentInfo.tags" :key="index" href="javascript:;"
             :class="{active:currentTagIndex===index}" @click="changeTag(index)">{{ item.title }}({{
              item.tagCount
            }})</a>
        </div>
      </div>
    </div>
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a @click="changeSort(null)" :class="{active:requestParams.sortField===null}"
         href="javascript:;">默认</a>
      <a @click="changeSort('createTime')" :class="{active:requestParams.sortField==='createTime'}"
         href="javascript:;">最新</a>
      <a @click="changeSort('praiseCount')" :class="{active:requestParams.sortField==='praiseCount'}"
         href="javascript:;">最热</a>
    </div>
    <!--评价列表-->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" :key="i+'s'" class="iconfont icon-wjx01"></i>
            <i v-for="i in 5-item.score" :key="i+'k'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">{{ item.content }}</div>
          <!--评论图片组件-->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures"></GoodsCommentImage>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--分页组件-->
    <WebPagination @current-change="changePage" :total="total" :pageSize="requestParams.pageSize"
                   :currentPage="requestParams.page" v-if="total"></WebPagination>
  </div>
</template>
<script>
import { inject, reactive, ref, watch } from 'vue'
import { findGoodsCommentInfo, findGoodsCommentList } from '@/api/product'
import GoodsCommentImage from '@/views/goods/components/goods-comment-image'

export default {
  name: 'GoodsComment',
  components: { GoodsCommentImage },
  setup () {
    // 未知类型ref(null)
    const commentInfo = ref(null)
    const goods = inject('goods')
    findGoodsCommentInfo(goods.value.id).then(data => {
      data.result.tags.unshift({
        title: '有图',
        tagCount: data.result.hasPictureCount,
        type: 'img'
      })
      data.result.tags.unshift({
        title: '全部评价',
        tagCount: data.result.evaluateCount,
        type: 'all'
      })
      // 设置数据之前tags数组前追加 有图tag 全部评价tag
      commentInfo.value = data.result
    })
    // 激活tag
    const currentTagIndex = ref(0)
    const changeTag = (index) => {
      currentTagIndex.value = index
      // 点击tag修改修改条件
      const tag = commentInfo.value.tags[index]
      // 1.全部情况 不用发
      // 2.有图 hasPicture = true tag=null
      // 3.其他情况 tag hasPicture =null
      if (tag.type === 'all') {
        requestParams.hasPicture = null
        requestParams.tag = null
      } else if (tag.type === 'img') {
        requestParams.hasPicture = true
        requestParams.tag = null
      } else {
        requestParams.hasPicture = null
        requestParams.tag = tag.title
      }
      // 页码置为1
      requestParams.page = 1
    }
    // 点击排序
    const changeSort = (sortField) => {
      requestParams.sortField = sortField
      requestParams.page = 1
    }
    // 准备筛选条件数据
    const requestParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      // 排序方式 praiseCount 热度 createTime 最新
      sortField: null
    })
    // 初始化和筛选条件改变时发请求
    const commentList = ref([])
    const total = ref(0)
    watch(requestParams, () => {
      // 初始化页码 - 这里不会触发watch?不建议
      // requestParams.page = 1
      findGoodsCommentList(goods.value.id, requestParams).then(data => {
        commentList.value = data.result.items
        total.value = data.result.counts
      })
    }, { immediate: true })
    // 定义转换数据的函数 - 过滤器
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}:${c.nameValue}`, '').replace(' ', '')
    }
    // 格式化姓名
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }
    // 实现分页切换
    const changePage = (newPage) => {
      requestParams.page = newPage
    }
    return {
      commentInfo,
      currentTagIndex,
      changeTag,
      requestParams,
      changeSort,
      commentList,
      formatSpecs,
      formatNickname,
      total,
      changePage
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;

    .data {
      width: 340px;
      display: flex;
      padding: 20px;

      p {
        flex: 1;
        text-align: center;

        span {
          display: block;

          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }

          &:last-child {
            color: #999;
          }
        }
      }
    }

    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;

      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }

      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;

        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;

          &:hover {
            border-color: @webColor;
            background: lighten(@webColor, 50%);
            color: @webColor;
          }

          &.active {
            border-color: @webColor;
            background: @webColor;
            color: #fff;
          }
        }
      }
    }
  }

  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;

    > span {
      margin-left: 20px;
    }

    > a {
      margin-left: 30px;

      &.active, &:hover {
        color: @webColor;
      }
    }
  }

  .list {
    padding: 0 20px;

    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;

      .user {
        width: 160px;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        span {
          padding-left: 10px;
          color: #666;
        }
      }

      .body {
        flex: 1;

        .score {
          line-height: 40px;

          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }

          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }

      .text {
        color: #666;
        line-height: 24px;
      }

      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
