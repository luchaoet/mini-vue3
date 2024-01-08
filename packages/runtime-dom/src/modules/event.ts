// 事件
// addEventListener
export const patchEvent = (el, key, value) => {
  const invokers = el._vei || (el._vei = {})
  const exists = invokers[key]
  if (exists && value) {
    exists.value = value
  } else {
    const eventName = key.slice(2).toLowerCase()
    if (value) {
      let invoker = invokers[eventName] = createInvoker(value)
      el.addEventListener(eventName, invoker)
    } else {
      el.removeEventListener(eventName, exists)
      invokers[eventName] = undefined
    }
  }
}

function createInvoker(value) {
  const invoker = (e) => {
    invoker.value(e)
  }
  invoker.value = value
  return invoker
}

// 给元素缓存一个绑定的事件
// 三种情况
// 1如果旧值没有值 新值有 添加值, 缓存
// 2如果旧值有  新值没有 删除值 删除缓存
// 3旧值和新值都有 将新值覆盖旧值