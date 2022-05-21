// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'

export default {
  namespaced: true,
  state () {
    return {
      // 分类列表 - 默认有九个分类,依赖topCategory重新设置
      // 保证初始化页面正确
      // name 必须对应一个id
      list: topCategory.map(item => ({ name: item }))
    }
  },
  // 修改分类
  mutations: {
    // payload所有的分类集合
    setList (state, payload) {
      state.list = payload
    },
    // 修改方法 控制当前分类的二级分类的显示和隐藏
    show (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },
  // 获取分类函数
  actions: {
    async getList ({ commit }) {
      // 获取数据
      const data = await findAllCategory()
      // 给每个分类加上控制二级分类页面显示隐藏的数据
      data.result.forEach(top => {
        top.open = false
      })
      // 修改数据
      commit('setList', data.result)
    }
  }
}
