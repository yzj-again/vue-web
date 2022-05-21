import { createRouter, createWebHashHistory } from 'vue-router'
// 按需导入
<<<<<<< HEAD
const Layout = () => import('@/views/Layout')
=======
const Layout = () => import('@/views/VueLayout')
>>>>>>> ba06a60 (城市组件)
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
// 路由规则
const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/category/:id',
        component: TopCategory
      },
      {
        path: '/category/sub/:id',
        component: SubCategory
      },
      {
        path: '/product/:id',
        component: Goods
      }
    ]
  }
]
// vue2 new VueRouter({})
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由滚动到页面顶部
  scrollBehavior () {
    return {
      // vue2 为x,y
      // vue3 为top,left
      left: 0,
      top: 0
    }
  }
})

export default router
