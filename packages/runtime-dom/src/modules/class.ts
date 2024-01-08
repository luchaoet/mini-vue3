export const patchClass = (el, value) => {
  if (value === null) {
    value = ''
  }
  // 对标签 class 赋值
  el.className = value
}