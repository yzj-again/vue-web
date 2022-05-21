import { createApp } from 'vue'
import App from './App.vue'
// 插件
import router from './router'
import store from './store'
// 首页样式
import 'normalize.css'
// 自己项目的重置样式和公用样式
import '@/assets/styles/common.less'
// 使用插件
import UI from '@/components/library'
createApp(App).use(store).use(router).use(UI).mount('#app')
