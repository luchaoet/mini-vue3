// 操作dom 节点与属性

import { extend } from "@vue/shared"
import { nodeOps } from "./nodeOps"
import { patchProp } from "./patchProp"
import { createRender } from "@vue/runtime-core"

const renderOptionDom = extend({ patchProp }, nodeOps)

// export {
//   renderOptionDom
// }

export const createApp = (rootComponent, rootProps) => {
  let app = createRender(renderOptionDom).createApp(rootComponent, rootProps)
  let { mount } = app

  app.mount = (container) => {
    // 清空
    container = nodeOps.querySelector(container)
    container.innerHTML = ''
    // 重新挂载
    mount(container)
  }
  return app
}

export * from "@vue/runtime-core"