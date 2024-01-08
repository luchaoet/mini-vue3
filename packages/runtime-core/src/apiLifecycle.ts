import { currentInstance, setCurrentInstance } from "./component"

// 枚举
const enum lifeCycle {
  BEFORE_MOUNT = "bm",
  MOUNTED = "m",
  BEFORE_UPDATE = "bu",
  UPDATED = "u",
}

export const onBeforeMount = createHook(lifeCycle.BEFORE_MOUNT)
export const onMounted = createHook(lifeCycle.MOUNTED)
export const onBeforeUpdate = createHook(lifeCycle.BEFORE_UPDATE)
export const onUpdated = createHook(lifeCycle.UPDATED)

function createHook(type) {
  return (hook, target = currentInstance) => {
    // 获取到当前组件的实例 和生命周期产生关联
    injectHook(type, hook, target)
  }
}

function injectHook(type, hook, target) {
  // 注意 vue3中的生命周期都是在setup中使用
  if (!target) {
    return
  }
  // 给这个实例添加生命周期
  const hooks = target[type] || (target[type] = [])
  // vue3源码 用了一个切片
  const rap = () => {
    setCurrentInstance(target)
    hook() // 执行生命周期前存放一个当前的实例
    setCurrentInstance(null)
  }
  hooks.push(rap) // hook就是你生命周期中的方法
}

// 生命周期的执行
export function invokeArrayFns(fnArr) {
  // 遍历
  fnArr.forEach((fn) => fn())
}