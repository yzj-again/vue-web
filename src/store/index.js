import { createStore } from 'vuex'

// vue2 创建仓库 new Vuex.Store({})
// export default createStore({
//   state: {
//     // 存放状态
//   },
//   getters: {
//     // 计算属性
//   },
//   mutations: {
//     // 修改方法
//   },
//   actions: {
//     // 拿数据
//   },
//   modules: {
//     // 分模块
//   }
// })
// 三个模块
import cart from '@/store/modules/cart'
import user from '@/store/modules/user'
import category from '@/store/modules/category'
// 持久化处理 - 插件处理
import createPresistedState from 'vuex-persistedstate'

export default createStore({
  // 根模块
  modules: {
    cart,
    category,
    user
  },
  // 配置插件 默认存储到localstorage
  plugins: [
    createPresistedState({
      // 本地存储的key
      key: 'local-store',
      // 存储那些modules
      paths: ['cart', 'user']
    })
  ]
})
