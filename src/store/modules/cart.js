// 购物车模块
import { getNewCartGoods } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      // 购物车列表
      list: []
    }
  },
  getters: {
    // vuex中计算属性
    // 有效商品列表 库存大于 0 stock 商品标识 true isEffective
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      // 浮点数要乘以100 1.1*3=3.300000000000003
      // return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
      return getters.validList.reduce((p, c) => p + parseInt(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.validList.length !== 0
    }
  },
  mutations: {
    insertCart (state, payload) {
      // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
      // 线上：比上面多 isCollect 有用 discount 无用 两项项信息
      // 插入时也有规则:先找是否有相同商品
      // 1.有相同的商品,查询数量再合并到payload上,再保存
      // 2.没有相同商品,保存在最新位置即可
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来的
        state.list.splice(sameIndex, 1)
      }
      // 追加新的
      state.list.unshift(payload)
    },
    // 修改本地购物车
    updateCart (state, payload) {
      // payload 商品信息:nowPrice stock isEffective
      // payload 商品对象的字段不固定,对象中有那些字段,就改那些字段,空数据不改
      // payload 商品对象必须有skuId
      const updateGoods = state.list.find(item => item.skuId === payload.skuId)
      for (const key in payload) {
        if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
          updateGoods[key] = payload[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    }
  },
  actions: {
    // 批量删除选中商品
    batchDeleteCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // 1. 获取选中商品列表，进行遍历调用deleteCart mutations函数
          ctx.getters.selectedList.forEach(item => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 做有效商品的全选&反选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // 1. 获取有效的商品列表,遍历的去调用修改mutations即可
          // 全部影响
          ctx.getters.validList.forEach(item => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 修改购物车(选中状态,数量)
    updateCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        // ctx.state是当前模块
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // payload 必须有skuId 可能有selected count
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 加入购物车
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        // ctx.state是当前模块
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 删除购物车
    deleteCart (ctx, payload) {
      // 单条删除 payload 现在, 就是skuId
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    // 修改本地购物车 区分本地和线上
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          // 同时发送多个请求,等所有请求成功,再一并修改本地数据
          // Promise.all() 可以并列发送多个请求,等所有请求成功,调用then,得到所有成功结果
          // Promise.race() 可以并列发送多个请求,等最快的请求成功,调用then,得到的是一个最快的成功结果
          // 用于两台服务器具有数据查询,每次发两个,取最快的结果
          // 传参是promise数组
          const promiseArr = ctx.state.list.map(item => {
            // 返回接口函数的调用
            return getNewCartGoods(item.skuId)
          })
          // dataList成功结果的集合,数据顺序和promiseArr顺序一致,它又是根据state.list而来
          Promise.all(promiseArr).then(dataList => {
            // console.log(dataList)
            // 更新本地购物车
            dataList.forEach((data, index) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[index].skuId, ...data.result })
            })
            // 调用resolve代表操作成功
            resolve()
          })
        }
      })
    }
  }
}
