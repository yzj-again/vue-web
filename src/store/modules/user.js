// 用户模块
export default {
  namespaced: true,
  state () {
    // 函数化
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
    }
  },
  mutations: {
    // 修改用户信息
    steUser (state, payload) {
      state.profile = payload
    }
  }
}
