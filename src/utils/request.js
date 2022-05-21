// 1.创建一个新的axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 响应拦截器：1. 剥离无效数据  2. 处理token失效
// 4. 导出一个函数，调用当前的axios实例发请求，返回值promise
import axios from 'axios'
// 导出基准地址，原因：其他地方不是通过axios发请求的地方用上基准地址
import store from '@/store'
import router from '@/router'

<<<<<<< HEAD
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
=======
export const baseURL = 'https://apipc-xiaotuxian-front.itheima.net/'
>>>>>>> ba06a60 (城市组件)
const instance = axios.create({
  // axios的一些配置 baseUrl，timeout
  baseURL,
  timeout: 5000
})
instance.interceptors.request.use(config => {
  // 拦截业务
  // 进行请求配置的修改
  // 如果本地有token就在头部携带 token 在vuex
  const { profile } = store.state.user
  // 判断是否有token
  if (profile.token) {
    // 设置token
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})
// 取出data数据,将来拿到的就就是后台数据
instance.interceptors.response.use(res => {
  return res.data
}, err => {
  // 401 失败,进去该函数
  // 判断响应状态码 先排除无响应状态 再判断响应码
  if (err.response && err.response.status === 401) {
    // 1.清除本地无效用户信息 传入空对象
    store.commit('user/steUser', {})
    // 2.跳转到登录页 需要携带当前路由页, 需要返回到之前的页面
    // 当前路由地址 /user?a=10
    // 组件里头:$route.path 还得拿?后参数
    // 用$route.fullPath=== ''
    // js模块中: router.currentRoute.(当前路由对象)fullPath
    // router.currentRoute是ref包装的响应式数据
    // encodeURIComponent 转换uri编码，防止解析地址出问题
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})

// 导出请求工具函数
export default (url, method, submitData) => {
  // 负责发请求,需要参数-请求地址,请求方式,提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求  需要使用params来传递submitData   ?a=10&c=10
    // 2. 如果不是get请求  需要使用data来传递submitData   请求体传参
    // [] 设置一个动态的key, 写js表达式,js表达式的执行结果当作KEY
    // method参数：get,Get,GET  转换成大写再来判断
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    // 动态插入
    // const a ={name:100} const key = 'name' a.name
    // a[10>9?'name':'age'] a[key]
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
