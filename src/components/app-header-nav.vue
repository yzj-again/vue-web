<template>
  <ul class="app-header-nav">
    <li class="home">
      <RouterLink to="/">首页</RouterLink>
    </li>
    <li v-for="item in list" :key="item.id" @mousemove="show(item)" @mouseleave="hide(item)">
      <RouterLink :to="`/category/${item.id}`" @click="hide(item)">{{ item.name }}</RouterLink>
      <div class="layer" :class="{open:item.open}">
        <ul>
          <li v-for="childItem in item.children" :key="childItem.id">
            <RouterLink :to="`/category/sub/${childItem.id}`" @click="hide(item)">
              <img :src="childItem.picture" alt="">
              <p>{{ childItem.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>
<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'AppHeaderNav',
  setup () {
    const store = useStore()
    const list = computed(() => {
      return store.state.category.list
    })
    // 跳转时不会关闭二级分类页面,通过数据控制
    // 1.每个分类加上open
    // 2.提供显示和隐藏函数,修改open数据
    // 3.在组件中使用vuex中的函数,使用事件绑定,提供一个类名显示隐藏的类名
    // 也可以模板里调用commit
    const show = (item) => {
      store.commit('category/show', item.id)
    }
    const hide = (item) => {
      store.commit('category/hide', item.id)
    }
    return {
      list,
      show,
      hide
    }
  }
}
</script>
<style scoped lang="less">
.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 999;
  // 只让自己生效,后代别生效
  // 子选择器
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;

    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }

    &:hover {
      > a {
        color: @webColor;
        border-bottom: 1px solid @webColor;
      }
    }
  }
}

.layer {
  &.open {
    height: 132px;
    opacity: 1;
  }

  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all .2s .1s;

  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;

    li {
      width: 110px;
      text-align: center;

      img {
        width: 60px;
        height: 60px;
      }

      p {
        padding-top: 10px;
      }

      &:hover {
        p {
          color: @webColor;
        }
      }
    }
  }
}
</style>
