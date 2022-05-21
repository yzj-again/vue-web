// 提供服用逻辑的函数(钩子)
// stop 是停止观察是否进入或移出可视区域的行为
/*
const { stop } = useIntersectionObserver(
  // target 是观察的目标dom容器，必须是dom容器，而且是vue3.0方式绑定的dom对象
  target,
  // isIntersecting 是否进入可视区域，true是进入 false是移出
  // observerElement 被观察的dom
  ([{ isIntersecting }], observerElement) => {
    // 在此处可根据isIntersecting来判断，然后做业务
  },
)
*/
/**
 * @param {Element} target -DOM对象
 * @param {Function} apiFn -API函数
 */
import { useIntersectionObserver } from '@vueuse/core/index'
import { ref } from 'vue'

export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        // 进入可视区,停止观察
        stop()
        // 调用API返回数据
        apiFn().then(data => {
          result.value = data.result.filter((item) => (item.desc !== null))
        })
      }
    },
    // 配置选项
    // 盒子与可视区相交一定比例,就触发加载
    // 现在盒子太大,比例区域就越大
    {
      threshold: 0
    }
  )
  // 返回--->数据（dom,后台数据）
  return { target, result }
}
