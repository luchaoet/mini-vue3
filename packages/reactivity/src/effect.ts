
import { isArray, isIntegerKey } from '@vue/shared'
import { TriggerOpTypes } from './operations'

export function effect(fn, options: any = {}) {
  const e = createReactiveEffect(fn, options)
  if (!options?.lazy) {
    e()
  }
  return e
}

let uid = 0
let activeEffect // 保存当前 effect
let effectStack = []

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect)
        activeEffect = effect
        fn()
      } finally {
        /**
         * 每个effect函数执行fn，如果fn中有数据get，则会调用Track收集activeEffect
         * 执行fn完毕，删除当前的 activeEffect， 并将 activeEffect 回退到前一个，处理用户的effect函数中再嵌套effect函数的问题
         * 如下示例
          effect(() => { // effect1
            // effectStack 为 [effect1]
            // activeEffect 为 effect1
            state.name
            effect(() => { // effect2
              effectStack 为 [effect1, effect2]
              activeEffect 为 effect2
              state.info.sex
            })
            移除 effectStack 最后一项
            effectStack 为 [effect1]
            activeEffect 为 effect1
            state.info.age
          })
        */
        effectStack.pop()
        const n = effectStack.length
        activeEffect = n > 0 ? effectStack[n - 1] : undefined
      }
    }
  }
  effect.id = uid++
  effect._isEffect = true
  effect.raw = fn
  effect.options = options
  return effect // 返回 effect，用户可使用 effect.stop 函数
}

const targetMap = new WeakMap()
// 收集依赖 在获取数据get时收集 target 下的 key 所在的 effect
export function track(target, type, key) {
  // console.log({ target, type, key, uid: activeEffect?.id })
  // 数据get 触发 track， activeEffect存在说明key在effect中
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect)
    }
  }
}

// 数据修改触发对应的 effect
export function trigger(target: object, type: TriggerOpTypes, key: any, newValue?: any, oldValue?: any) {
  console.log('trigger', { target, type, key, newValue, oldValue })
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  console.log('trigger', {
    targetMap,
    depsMap
  })

  const dep = depsMap.get(key) || []
  const effectSet = new Set()
  const add = (es) => {
    es.forEach(effect => effectSet.add(effect))
  }
  add(dep)

  // 数组修改长度 length 特殊处理
  if (key === 'length' && isArray(target)) {
    const newLength = Number(newValue)
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= newLength) {
        add(dep)
      }
    })
  } else {
    if (key !== void 0) {
      add(depsMap.get(key))
    }
    switch (type) {
      case TriggerOpTypes.ADD:
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get('length'))
        }
        break;

      default:
        break;
    }
  }

  dep.forEach((effect: any) => effect())
}