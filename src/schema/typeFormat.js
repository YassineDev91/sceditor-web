export function formatTypeNode(type, { resolveRef } = {}) {
  switch (type.kind) {
    case 'primitive': {
      let base = type.name
      if (type.size !== undefined) base += type.size
      if (type.payable) base += ' payable'
      return base
    }
    case 'array': {
      const size = type.size === null || type.size === undefined ? '' : String(type.size)
      return `${formatTypeNode(type.element, { resolveRef })}[${size}]`
    }
    case 'associative':
      return `${formatTypeNode(type.key, { resolveRef })} => ${formatTypeNode(type.value, { resolveRef })}`
    case 'reference':
      return resolveRef ? resolveRef(type.ref) : `ref:${type.ref}`
    default:
      return String(type)
  }
}
