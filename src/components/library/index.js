// 插件,扩展原有功能叫插件 全局组件 自定义指令 挂载原型方法 过滤器(vue3没有)
// vue2写法:导出一个对象,有install函数,默认传入了Vue的构造函数,在Vue基础上扩展
// vue3写法:导出一个对象,有install函数,默认传入了App(createApp(App)),在app实例上扩展
// import WebSkeleton from '@/components/library/web-skeleton'
// import WebCarousel from '@/components/library/web-carousel'
// import WebMore from '@/components/library/web-more'
// import WebBread from '@/components/library/web-bread'
// import WebBreadItem from '@/components/library/web-bread-item'
import defaultImg from '@/assets/images/200.png'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'
// 1.使用require提供的函数context加载某一个目录下的所有.vue后缀的文件
// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
const importFn = require.context('./', false, /\.vue$/)
export default {
  install (app) {
    // 在app上进行扩展,app提供 component directive 函数
    // 挂原型方法:app.config.globalProperties.$http
    // app.component(WebSkeleton.name, WebSkeleton)
    // app.component(WebCarousel.name, WebCarousel)
    // app.component(WebMore.name, WebMore)
    // app.component(WebBread.name, WebBread)
    // app.component(WebBreadItem.name, WebBreadItem)
    // 根据keys批量注册
    importFn.keys().forEach(path => {
      // 导入组件
      const component = importFn(path).default
      // 注册组件
      app.component(component.name, component)
    })
    // 定义指令
    defineDirective(app)
    // 定义一个原型函数
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}
// require.context() 是webpack提供的一个自动导入的API
// 参数1:加载的文件目录
// 参数2:是否加载子目录
// 参数3:正则,匹配文件
// 返回值:导入函数 fn
// keys() 获取读取到的所有文件列表
// 创建观察对象实例
// const observer = new IntersectionObserver(callback[, options])
// callback 被观察dom进入可视区离开可视区都会触发
// - 两个回调参数 entries , observer
// - entries 被观察的元素信息对象的数组 [{元素信息},{}]，信息中isIntersecting判断进入或离开
// - observer 就是观察实例
// options 配置参数
// - 三个配置属性 root rootMargin threshold
// - root 基于的滚动容器，默认是document
// - rootMargin 容器有没有外边距
// - threshold 交叉的比例

// 实例提供两个方法
// observe(dom) 观察哪个dom
// unobserve(dom) 停止观察那个dom
// 定义指令 - 在方法中定义自定义指令
const defineDirective = (app) => {
  // 1.图片懒加载指令
  // 先存储图片地址不能在src上,
  // 当图片进入可视区,将你存储的图片地址设置给图片元素(操作DOM)即可
  app.directive('lazy', {
    // vue2 监听DOM是否被创建好,钩子函数:inserted定义指令提供
    // vue3 监听DOM是否被创建好,钩子函数:mounted(生命周期函数,非组合api的onX)
    mounted (el, binding) {
      // 2.观察加上指令的DOM元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 停止观察
          observe.unobserve(el)
          // 3.把指令的值设置给el的src属性  banding.value就是指令的值
          // 4.处理图片失败onerror,成功onload
          el.onerror = () => {
            // 加载失败
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0.1
      })
      // 开启观察
      observe.observe(el)
    }
  })
}
