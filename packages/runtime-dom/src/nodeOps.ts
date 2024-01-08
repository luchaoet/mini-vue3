
export const nodeOps = {
  // 创建元素
  createElement: (tag, isSvg, is, props) => {
    return document.createElement(tag)
  },
  // 删除元素
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child)
    }
  },
  // 插入元素
  insert: (child, parent, anchor) => {
    // 定位节点anchor的前面
    parent.insertBefore(child, anchor || null)
  },
  // 选择元素
  querySelector: selector => document.querySelector(selector),
  // 设置文本
  setElementText: (el, text) => {
    el.textContent = text
  },
  // 创建文本
  createText: text => document.createTextNode(text),
  // 设置文本
  setText: (node, text) => {
    node.nodeValue = text
  },
}