import { createVNode, render } from 'vue'
import WebConfirm from '@/components/library/web-confirm'
// 准备dom
const div = document.createElement('div')
div.setAttribute('class', 'web-confirm-container')
document.body.appendChild(div)

// 将来要返回一个promise对象,且最终都会被销毁
export default ({ title, text }) => {
  // 1.导入被创建的组件
  // 2.使用createVNode创建虚拟节点
  // 3.准备一个dom容器装载组件
  // 4.使用render函数渲染组件到容器
  return new Promise((resolve, reject) => {
    // 取消
    const cancelCallback = () => {
      // 销毁
      render(null, div)
      reject(new Error('点击取消'))
    }
    // 确认
    const submitCallback = () => {
      // 销毁
      render(null, div)
      resolve()
    }
    const VNode = createVNode(WebConfirm, { title, text, cancelCallback, submitCallback })

    render(VNode, div)
  })
}
