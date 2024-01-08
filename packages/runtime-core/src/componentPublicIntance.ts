import { hasOwn } from "@vue/shared"

// 处理代理
export const componentPublicIntance: ProxyHandler<any> = {
  get({ _: instance }, key) {
    // 获取值 props children data
    const { props, data, setupState } = instance
    // 属性$开头不能获取
    if (key[0] == "$") return;
    if (hasOwn(props, key)) {
      return props[key]
    } else if (hasOwn(setupState, key)) {
      return setupState[key]
    } else {
      return instance[key]
    }
  },
  set({ _: instance }, key, value) {
    const { props, data, setupState } = instance
    if (hasOwn(props, key)) {
      props[key] = value
    } else if (hasOwn(setupState, key)) {
      setupState[key] = value
    }
    return true
  },
}
