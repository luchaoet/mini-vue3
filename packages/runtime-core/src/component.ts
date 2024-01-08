import { ShapeFlags, isFunction, isObject } from "@vue/shared"
import { componentPublicIntance } from "./componentPublicIntance"

export const createComponentInstance = (vnode) => {
  const instance = {
    vnode,
    type: vnode.type, // 组件的类型
    props: {},
    attrs: {},
    setupState: {}, // setup返回值
    ctx: {},
    proxy: {},
    isMounted: false, // 是否挂载
  }
  instance.ctx = { _: instance }
  return instance
}

// 解析数据到组件实例
export const setupComponent = (instance) => {
  const { props, children } = instance.vnode;
  instance.props = props
  instance.children = children
  // 看一下这个组件有没有setup
  let shapeFlag = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
  if (shapeFlag) {
    setupStateComponet(instance)
  }
}

export let currentInstance

function setupStateComponet(instance) {
  instance.proxy = new Proxy(instance.ctx, componentPublicIntance as any)
  // 1 setup返回值是render函数
  // 2 获取创建的类型拿到组件setup方法
  let component = instance.type;
  let { setup } = component;
  if (setup) {
    currentInstance = instance
    let setupContext = createContext(instance)
    const setupResult = setup(instance.props, setupContext)

    currentInstance = null

    // setup函数中的return可能是对象 或 函数（函数则为render） 处理下
    handlerSetupResult(instance, setupResult)
  } else {
    // 调用render
    finishComponentSetup(instance)
  }
  component.render.call(instance.proxy, instance.proxy)
}

function handlerSetupResult(instance, setupResult) {
  // 1对象 2函数
  if (isFunction(setupResult)) {
    instance.render = setupResult // setup返回的函数保存到实例上
  } else if (isObject(setupResult)) {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

function createContext(instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: () => { },
    expose: () => { },
  }
}

export const getCurrentInstance = () => {
  return currentInstance
}

export const setCurrentInstance = (target) => {
  currentInstance = target
}

function finishComponentSetup(instance) {
  // 判断一下组件中有没有这个render
  let Componet = instance.type
  if (!instance.render) {
    // 模板编译 render
    if (!Componet.render && Componet.template) {
      // 模板 => render
      //  Componet.render = 
    }
    instance.render = Componet.render
  }
}