import { isObject } from '@vue/shared'
import { reactiveHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from './baseHandlers'

function createReactiveObject(target, isReadonly, baseHandlers, proxyMap) {
  if (!isObject(target)) return target;
  const existingProxy = proxyMap.get(target);
  if (existingProxy) return existingProxy;

  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}

// 缓存
export const reactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()
export const shallowReactiveMap = new WeakMap()
export const shallowReadonlyMap = new WeakMap()

export const reactive = (target) => createReactiveObject(target, false, reactiveHandlers, reactiveMap)
export const shallowReactive = (target) => createReactiveObject(target, false, shallowReactiveHandlers, shallowReactiveMap)
export const readonly = (target) => createReactiveObject(target, true, readonlyHandlers, readonlyMap)
export const shallowReadonly = (target) => createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyMap)