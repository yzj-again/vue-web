// 提供一个能够显示web-message组件的函数
// 这个函数将来:导入使用/挂载在vue实例(原型)上使用
// import Message from 'Message.js' Message({type:'error',text:"提示文字"})
// this.$message({type:'error',text:"提示文字"})
import WebMessage from '@/components/library/web-message'
import { createVNode, render } from 'vue'

const div = document.createElement('div')
div.setAttribute('class', 'web-message-container')
document.body.appendChild(div)

// 定时器
let timer = null
export default ({
  type,
  text
}) => {
  // 渲染组件的步骤 js方法
  // 1.导入消息提示组件 未解析(单文件组件)
  // 2.将导入的组件先解析成虚拟DOM
  // createVNode() 参数1:那个组件 参数2:给组件传参
  const virtualNode = createVNode(WebMessage, {
    type,
    text
  })
  // 3.准备一个装载消息提示组件的容器
  // 4.将虚拟节点渲染在容器中
  // render() 参数1:虚拟节点 参数2:DOM容器
  render(virtualNode, div)
  // 三秒后销毁组件
  clearTimeout(timer)
  timer = setInterval(() => {
    render(null, div)
  }, 3000)
}
