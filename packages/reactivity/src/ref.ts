import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { hasChanged, isArray } from '@vue/shared'

export function toRef(
  source: Record<string, any>,
  key?: string,
  defaultValue?: unknown) {
  return new ObjectRefImpl(source, key, defaultValue)
}

export function toRefs(object) {
  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = propertyToRef(object, key)
  }
  return ret
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

function propertyToRef(
  source: Record<string, any>,
  key: string,
  defaultValue?: unknown
) {
  const val = source[key]
  return isRef(val)
    ? val
    : (new ObjectRefImpl(source, key, defaultValue) as any)
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

class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor(
    private readonly _object: T,
    private readonly _key: K,
    private readonly _defaultValue?: T[K]
  ) { }

  get value() {
    const val = this._object[this._key]
    return val === undefined ? this._defaultValue! : val
  }

  set value(newVal) {
    this._object[this._key] = newVal
  }
}