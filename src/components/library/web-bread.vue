<script>
// 消除多余的符号
// 1.动态设置最后一个item后面的>的样式
// ul li:last-child{
// 先找到父元素,然后找到所有的子元素,找到最后一个,判断是不是li
//  i{  &:{display: none;}}
// 是就选中,不是就是无效选择器}
/* &:last-of-type{ 最后一个也确定了类型
  先找父元素,找到所有的类型为li的元素,选中最后一个
  }
* */
import { h } from 'vue'

export default {
  name: 'WebBread',
  render () {
    // 单文件组件有render,就不要template
    // 返回值就是组件内容
    // vue2的h函数传参进来render:h=>{},vue3的h函数导入进来render(){}
    // h() 函数参数,1. 节点名称  2. 属性|数据 是对象  3. 子节点
    // 1.创建父容器web-bread
    // 2.获取默认插槽内容
    // 3.去除web-bread-item组件的i标签,由render函数来组织
    // 4.遍历插槽中的item,得到一个动态创建的节点,最后一个item不加i标签
    // 5.把动态创建的节点渲染到web-bread标签中
    const items = this.$slots.default()// 获取默认插槽的内容
    const dynamicItems = []
    items.forEach((item, i) => {
      if (item.type.name === 'WebBreadItem' || item.type.displayName === 'Transition') {
        dynamicItems.push(item)
        if (i < (items.length - 1)) {
          dynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
        }
      }
    })
    return h('div', { class: 'web-bread' }, dynamicItems)
  }
}
</script>

<style lang='less'>
// 去掉scope可以让样式作用到web-bread-item组件 不用深度作用
.web-bread {
  display: flex;
  padding: 25px 10px;

  &-item {
    a {
      color: #666;
      transition: all .4s;

      &:hover {
        color: @webColor;
      }
    }
  }

  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
