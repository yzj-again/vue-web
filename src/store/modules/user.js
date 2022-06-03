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
      },
      // 登陆后回跳路径
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息
    setUser (state, payload) {
      state.profile = payload
    },
    // 修改回跳地址
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
