<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img :class="{selected:val.selected,disabled:val.disabled}" @click="getSku(item,val)" v-if="val.picture"
               :src="val.picture"
               :title="val.name" alt="">
          <span :class="{selected:val.selected,disabled:val.disabled}" @click="getSku(item,val)" v-else>{{
              val.name
            }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set'
const split = '★'
// 得到一个路径字典集合
const getPathMap = (skus) => {
  // 1.得到所有的sku集合 props.goods.skus
  // 2.从所有的sku中筛选出有效的sku
  // 3.根据有效sku使用power-set算法得到子集
  // 4.根据子集往路径字典对象中存储key-value
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 计算当前有库存的sku的子集
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // 可选值数组 子集
      const valueArrPowerSet = powerSet(valueArr)
      // console.log(valueArrPowerSet) 数组套数组
      // 遍历子集,往pathMap插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key,预定key=['蓝色','美国']===>'蓝色★美国'
        const key = arr.join(split)
        // 字典追加
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 每一次选中判断时都要重新生成选中数组
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 选中的按钮对象
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
// 更新按钮禁用状态
const updateDisableStatus = (specs, pathMap) => {
  // 1.约定每一个按钮的状态由它本身的disabled状态来控制
  // specs是由一行一行的数据组成
  specs.forEach((item, index) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 去路径字典中查找数据,有,可以点击(false);没有,不可以点击(true)-禁用
      // val.disabled = !pathMap[val.name]
      // 将当前按钮套入数组中
      // 2.判断当前是否选中,是选中不用判断
      if (val.selected) return
      // 3.拿当前的值按照顺序套入选中的值数组
      selectedValues[index] = val.name
      // 4.提出undefined数据,拼接key,拿key去路径字典查找
      const key = selectedValues.filter(value => value).join(split)
      val.disabled = !pathMap[key]
    })
  })
}
// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1.导出sku的信息
  // 2.遍历每一个按钮,按钮值===sku记录的值
  const sku = goods.skus.find(item => item.id === skuId)
  goods.specs.forEach((item, index) => {
    const val = item.values.find(val => val.name === sku.specs[index].valueName)
    val.selected = true
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const getMap = getPathMap(props.goods.skus)
    // 根据skuId初始化选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // 组件初始化更新禁用状态
    updateDisableStatus(props.goods.specs, getMap)
    // 1.选中与取消选中,约定在每一个按钮都拥有自己的选中状态数据:selected
    // 1.1点击的是已选中,只需要取消当前的选中
    // 1.2点击的是未选中,把同一规格的按钮改成未选中,当前点击的改成选中
    const getSku = (item, val) => {
      // 但按钮是禁用的阻止程序运行
      if (val.disabled) return
      // 如果不是禁用,正常执行
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      // 点击按钮时,更新按钮禁用状态
      updateDisableStatus(props.goods.specs, getMap)
      // 将你选择的sku信息通知父组件{skuId,price,oldPrice,inventory,specsText}
      // 只有选择完整之后才能发送信息
      // 1.选择完整的sku组合按钮,才可以拿到这些信息,提交父组件
      // 2.不是完整的sku组件,提交空对象给父组件
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(val => val)
      if (validSelectedValues.length === props.goods.specs.length) {
        // 找skuId
        const skuIds = getMap[validSelectedValues.join(split)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 拼接属性名和属性值
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}:${c.valueName}`, '').replace(' ', '')
        })
      } else {
        // 没选完情况
        // 购物车传空对象,判断方便
        emit('change', {})
      }
    }
    return { getSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @webColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }

      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
