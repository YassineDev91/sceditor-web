import { describe, it, expect } from 'vitest'
import { primitiveType, arrayType, associativeType, referenceType } from './types.js'

describe('primitiveType', () => {
  it('creates a primitive with just a name', () => {
    expect(primitiveType('bool')).toEqual({ kind: 'primitive', name: 'bool' })
  })

  it('creates a numeric primitive with a bit-width size', () => {
    expect(primitiveType('uint', { size: 256 })).toEqual({ kind: 'primitive', name: 'uint', size: 256 })
  })

  it('creates a fixed-length bytes primitive with a byte-length size', () => {
    expect(primitiveType('bytes', { size: 32 })).toEqual({ kind: 'primitive', name: 'bytes', size: 32 })
  })

  it('creates a payable address', () => {
    expect(primitiveType('address', { payable: true })).toEqual({ kind: 'primitive', name: 'address', payable: true })
  })

  it('rejects an unknown primitive name', () => {
    expect(() => primitiveType('mapping')).toThrow(/Unknown primitive type "mapping"/)
  })

  it('rejects payable on a non-address primitive', () => {
    expect(() => primitiveType('uint', { payable: true })).toThrow(/"payable" is only valid on the "address" primitive/)
  })

  it('rejects size on a primitive that does not support it', () => {
    expect(() => primitiveType('bool', { size: 8 })).toThrow(/"size" is only valid on "uint", "int", or "bytes"/)
  })
})

describe('arrayType', () => {
  it('defaults to a dynamic array (size: null)', () => {
    const el = primitiveType('uint')
    expect(arrayType(el)).toEqual({ kind: 'array', element: el, size: null })
  })

  it('creates a fixed-size array', () => {
    const el = primitiveType('address')
    expect(arrayType(el, 5)).toEqual({ kind: 'array', element: el, size: 5 })
  })
})

describe('associativeType', () => {
  it('creates a key/value associative type', () => {
    const key = primitiveType('address')
    const value = primitiveType('uint')
    expect(associativeType(key, value)).toEqual({ kind: 'associative', key, value })
  })

  it('composes with arrayType to express mapping(address => uint[])', () => {
    const key = primitiveType('address')
    const value = arrayType(primitiveType('uint'))
    const result = associativeType(key, value)
    expect(result.value.kind).toBe('array')
  })
})

describe('referenceType', () => {
  it('creates a reference to another element by id', () => {
    expect(referenceType('enum_abc123')).toEqual({ kind: 'reference', ref: 'enum_abc123' })
  })

  it('rejects an empty ref', () => {
    expect(() => referenceType('')).toThrow(/requires a non-empty element id/)
  })
})
