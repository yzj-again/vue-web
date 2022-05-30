// 用户模块
export default {
  namespaced: true,
  state () {
    // 函数化
    return {
      // 用户信息
      profile: {
        id: '',
        account: '',
        avatar: '',
        mobile: '',
        nickname: '',
        token: ''
      }
    }
  },
  mutations: {
    // 修改用户信息
    setUser (state, payload) {
      state.profile = payload
    }
  }
}
