import { createVNode } from './vnode'

export const apiCreateApp = (render) => {
  return function createApp(rootComponent, rootProps = {}) {
    const app = {
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      mount(container) {
        // 虚拟节点
        const vnode = createVNode(rootComponent, rootProps)
        render(vnode, container)
        app._container = container
      }
    }
    return app
  }
}