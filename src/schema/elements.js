import { createId } from './id.js'

function baseElement(cmp_type, name, x, y, extra = {}) {
  return {
    id: createId(cmp_type.toLowerCase()),
    cmp_type,
    name,
    x,
    y,
    description: '',
    ...extra,
  }
}

export function createParameter(name, type) {
  return { name, type }
}

export function createVariable(name, type, { x = 0, y = 0, visibility = 'public' } = {}) {
  return baseElement('Variable', name, x, y, { type, visibility })
}

export function createStructField(name, type) {
  return { name, type }
}

export function createStruct(name, { x = 0, y = 0, literals = [] } = {}) {
  return baseElement('Struct', name, x, y, { literals })
}

export function createEnumValue(name) {
  return { name }
}

export function createEnum(name, { x = 0, y = 0, values = [] } = {}) {
  return baseElement('Enum', name, x, y, { values })
}
