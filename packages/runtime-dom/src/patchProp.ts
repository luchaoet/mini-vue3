// 属性操作
// class style onClick
import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchAttr } from './modules/attr'
import { patchEvent } from './modules/event'

export const patchProp = (
  el,
  key,
  prevValue,
  nextValue,
) => {
  if (key === 'class') {
    patchClass(el, nextValue)
  } else if (key === 'style') {
    patchStyle(el, prevValue, nextValue)
  } else if (/^on[^a-z]*/.test(key)) { // 是不是事件 onClick
    patchEvent(el, key, nextValue)
  } else {
    patchAttr(el, key, nextValue)
  }


}