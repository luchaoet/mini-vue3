export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';

export const extend = Object.assign;
export const isArray = Array.isArray;
export const isFunction = (v: unknown): v is boolean => typeof v === 'function';
export const isString = (v: unknown): v is string => typeof v === 'string';
// 对象上含有的key 不包含原型上的方法
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

// 正整数
export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key

// 严格相等 注意 Object.is 与 === 的区别
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)