import { isObject } from "@vue/shared"
import { createVNode, isVNode } from "./vnode"

export function h(type, propsOrchildren, children) {
  // 参数
  const i = arguments.length // 获取到参数的个数

  if (i == 2) {
    // 元素 + 属性 / 元素 + children
    if (isObject(propsOrchildren)) {
      if (isVNode(propsOrchildren)) {
        // h('div', vnode)
        return createVNode(type, null, [propsOrchildren])
      } else {
        // h('div', null)
        return createVNode(type, propsOrchildren) // 没有子元素
      }
    } else {
      // 就是子元素
      return createVNode(type, null, propsOrchildren)
    }
  } else {
    if (i > 3) {
      // h('div',{},'1','2','3')
      children = Array.prototype.slice.call(arguments, 2)
    } else if (i === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrchildren, children)
  }
}

// h函数的作用变成虚拟DOM
