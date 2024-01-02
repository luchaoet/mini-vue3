import { isFunction } from '@vue/shared'
import { effect } from './effect'

export function computed(getterOrOptions) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = () => {
      console.warn('Write operation failed: computed value is readonly')
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  const cRef = new ComputedRefImpl(getter, setter)
  return cRef
}

class ComputedRefImpl {
  public _dirty = true
  private _value
  public readonly effect
  constructor(getter, private readonly _setter) {
    this.effect = effect(getter, { lazy: true })
  }
  get value() {
    if (this._dirty) {
      this._value = this.effect()
    }
    return this._value
  }
  set value(newVal) {
    this._setter(newVal)
  }
}