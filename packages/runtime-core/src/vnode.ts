// 
import { ShapeFlags, isString, isObject, isArray } from '@vue/shared'

// 判断是不是一个vnode
export function isVNode(vnode) {
  return vnode._v_isVNode
}

export const createVNode = (type, props, children = null) => {
  let shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
      ? ShapeFlags.STATEFUL_COMPONENT
      : 0
  const vnode = {
    _v_isVNode: true,
    type,
    props,
    children,
    key: props && props.key,
    el: null, // 对应的真实dom
    shapeFlag,
  }
  // 儿子标识
  normalizeChildren(vnode, children)
  return vnode
}

function normalizeChildren(vnode, children) {
  let type = 0
  if (children == null) {
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else {
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.shapeFlag = vnode.shapeFlag | type
}

// 元素的children 变成vnode
export const TEXT = Symbol("text")
export function CVnode(child) {
  // ['text'] [h()]
  if (isObject(child)) return child
  return createVNode(TEXT, null, String(child))
}