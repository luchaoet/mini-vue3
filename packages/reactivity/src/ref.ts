import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { hasChanged } from '@vue/shared'

export function toRefs(object: object) {
  return {}
}

export function ref(value) {
  return createRef(value, true)
}

// 浅响应
export function shallowRef(value) {
  return createRef(value, false)
}

export function isRef(r: any) {
  return !!(r && r.__v_isRef === true)
}

function createRef(rawValue, shallow: boolean = false) {
  return new RefImpl(rawValue, shallow)
}

class RefImpl {
  private _rawValue;
  private _value;
  public readonly __v_isRef = true

  constructor(value, shallow) {
    // this._rawValue = shallow ? value : toRaw(value)
    this._value = value
  }

  get value() {
    // 收集 effect
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }
  set value(newVal) {
    if (hasChanged(newVal, this._value)) {
      this._value = newVal;
      this._rawValue = newVal;
      trigger(this, TriggerOpTypes.SET, 'value', newVal)
    }

  }
}