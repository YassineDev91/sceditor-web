const NUMERIC_PRIMITIVES = ['uint', 'int']
const PRIMITIVE_NAMES = ['address', 'bool', 'string', 'bytes', 'uint', 'int', 'timestamp', 'decimal']

export function primitiveType(name, { size, payable } = {}) {
  if (!PRIMITIVE_NAMES.includes(name)) {
    throw new Error(`Unknown primitive type "${name}". Expected one of: ${PRIMITIVE_NAMES.join(', ')}`)
  }
  if (payable && name !== 'address') {
    throw new Error(`"payable" is only valid on the "address" primitive, got "${name}"`)
  }
  if (size !== undefined && !NUMERIC_PRIMITIVES.includes(name) && name !== 'bytes') {
    throw new Error(`"size" is only valid on "uint", "int", or "bytes" primitives, got "${name}"`)
  }

  const node = { kind: 'primitive', name }
  if (size !== undefined) node.size = size
  if (payable) node.payable = true
  return node
}

export function arrayType(element, size = null) {
  return { kind: 'array', element, size }
}

export function associativeType(key, value) {
  return { kind: 'associative', key, value }
}

export function referenceType(ref) {
  if (!ref) {
    throw new Error('referenceType requires a non-empty element id')
  }
  return { kind: 'reference', ref }
}
