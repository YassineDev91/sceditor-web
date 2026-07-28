import { describe, it, expect } from 'vitest'
import { createContract } from './contract.js'

describe('createContract', () => {
  it('creates an empty v2 contract with defaults', () => {
    const c = createContract('Purchase')
    expect(c.schemaVersion).toBe(2)
    expect(c.name).toBe('Purchase')
    expect(c.x).toBe(10)
    expect(c.y).toBe(10)
    expect(c.variables).toEqual([])
    expect(c.structs).toEqual([])
    expect(c.functions).toEqual([])
    expect(c.enums).toEqual([])
    expect(c.guards).toEqual([])
    expect(c.errorDeclarations).toEqual([])
    expect(c.events).toEqual([])
    expect(c._constructor).toBeNull()
    expect(c.description).toBe('')
    expect(typeof c.id).toBe('string')
    expect(c.id).toMatch(/^contract_/)
  })

  it('does not expose a "constructor" field name', () => {
    const c = createContract('Purchase')
    expect(Object.prototype.hasOwnProperty.call(c, 'constructor')).toBe(false)
  })

  it('accepts x, y overrides', () => {
    const c = createContract('Purchase', { x: 100, y: 200 })
    expect(c.x).toBe(100)
    expect(c.y).toBe(200)
  })

  it('gives two contracts distinct ids', () => {
    const a = createContract('A')
    const b = createContract('B')
    expect(a.id).not.toBe(b.id)
  })
})
