import { describe, it, expect } from 'vitest'
import { primitiveType, arrayType, associativeType, referenceType } from './types.js'
import { formatTypeNode } from './typeFormat.js'

describe('formatTypeNode', () => {
  it('formats a plain primitive', () => {
    expect(formatTypeNode(primitiveType('bool'))).toBe('bool')
  })

  it('formats a sized numeric primitive', () => {
    expect(formatTypeNode(primitiveType('uint', { size: 256 }))).toBe('uint256')
  })

  it('formats a sized bytes primitive', () => {
    expect(formatTypeNode(primitiveType('bytes', { size: 32 }))).toBe('bytes32')
  })

  it('formats a payable address', () => {
    expect(formatTypeNode(primitiveType('address', { payable: true }))).toBe('address payable')
  })

  it('formats a dynamic array', () => {
    expect(formatTypeNode(arrayType(primitiveType('uint')))).toBe('uint[]')
  })

  it('formats a fixed-size array', () => {
    expect(formatTypeNode(arrayType(primitiveType('address'), 5))).toBe('address[5]')
  })

  it('formats an associative type', () => {
    const t = associativeType(primitiveType('address'), primitiveType('uint', { size: 256 }))
    expect(formatTypeNode(t)).toBe('address => uint256')
  })

  it('formats a composed associative-of-array type', () => {
    const t = associativeType(primitiveType('address'), arrayType(primitiveType('uint')))
    expect(formatTypeNode(t)).toBe('address => uint[]')
  })

  it('formats a reference using the resolveRef callback', () => {
    const t = referenceType('enum_abc123')
    expect(formatTypeNode(t, { resolveRef: (id) => (id === 'enum_abc123' ? 'State' : id) })).toBe('State')
  })

  it('falls back to the raw id when no resolveRef is given', () => {
    expect(formatTypeNode(referenceType('enum_abc123'))).toBe('ref:enum_abc123')
  })
})
