export function ref(value) {
  return createRef(value, false)
}

function createRef(value, s) {
  return {
    value
  }
}