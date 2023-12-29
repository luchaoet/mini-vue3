import { isObject, hasOwn, isArray, isIntegerKey, hasChanged } from '@vue/shared'
import { reactive, readonly } from './reactive';
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'

// get 
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    console.log('createGetter', {
      target, key, receiver
    })
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }
    if (shallow) {
      return res // new Proxy 默认就代理第一层
    }

    if (isObject(res)) {
      // 懒代理 递归 性能优化
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

// set 
function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    console.log('createSetter', {
      target, key, value, receiver
    })
    // 旧值
    const oldValue = target[key];

    const result = Reflect.set(target, key, value, receiver)

    // 当前key是存在的 修改动作
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)

    if (!hadKey) { // 新增
      trigger(target, TriggerOpTypes.ADD, key, value)
    } else if (hasChanged(value, oldValue)) { // 修改
      trigger(target, TriggerOpTypes.SET, key, value, oldValue)
    }
    return result
  }
}

const set = createSetter()
const shallowSet = createSetter(true)
const readonlySet = (target, key, value) => {
  console.log(`readonly: set ${value} on key ${key} is faild`)
}

export const reactiveHandlers = { get, set }
export const readonlyHandlers = { get: readonlyGet, set: readonlySet }
export const shallowReactiveHandlers = { get: shallowGet, set: shallowSet }
export const shallowReadonlyHandlers = { get: shallowReadonlyGet, set: readonlySet }