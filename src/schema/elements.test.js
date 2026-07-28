import { describe, it, expect } from 'vitest'
import { primitiveType } from './types.js'
import {
  createParameter,
  createVariable,
  createStructField,
  createStruct,
  createEnumValue,
  createEnum,
  createGuard,
  createGuardRef,
} from './elements.js'

describe('createParameter', () => {
  it('pairs a name with a type', () => {
    const type = primitiveType('uint')
    expect(createParameter('amount', type)).toEqual({ name: 'amount', type })
  })
})

describe('createVariable', () => {
  it('creates a variable with defaults', () => {
    const type = primitiveType('address')
    const v = createVariable('seller', type)
    expect(v.cmp_type).toBe('Variable')
    expect(v.name).toBe('seller')
    expect(v.type).toBe(type)
    expect(v.visibility).toBe('public')
    expect(v.x).toBe(0)
    expect(v.y).toBe(0)
    expect(v.description).toBe('')
    expect(typeof v.id).toBe('string')
    expect(v.id).toMatch(/^variable_/)
  })

  it('accepts x, y, and visibility overrides', () => {
    const v = createVariable('balance', primitiveType('uint'), { x: 10, y: 20, visibility: 'private' })
    expect(v.x).toBe(10)
    expect(v.y).toBe(20)
    expect(v.visibility).toBe('private')
  })

  it('gives two variables distinct ids', () => {
    const a = createVariable('a', primitiveType('bool'))
    const b = createVariable('b', primitiveType('bool'))
    expect(a.id).not.toBe(b.id)
  })
})

describe('createStructField', () => {
  it('pairs a name with a type', () => {
    const type = primitiveType('string')
    expect(createStructField('label', type)).toEqual({ name: 'label', type })
  })
})

describe('createStruct', () => {
  it('creates a struct with defaults', () => {
    const s = createStruct('Order')
    expect(s.cmp_type).toBe('Struct')
    expect(s.name).toBe('Order')
    expect(s.literals).toEqual([])
    expect(typeof s.id).toBe('string')
    expect(s.id).toMatch(/^struct_/)
  })

  it('accepts literals', () => {
    const field = createStructField('qty', primitiveType('uint'))
    const s = createStruct('Order', { literals: [field] })
    expect(s.literals).toEqual([field])
  })
})

describe('createEnumValue', () => {
  it('wraps a name', () => {
    expect(createEnumValue('Created')).toEqual({ name: 'Created' })
  })
})

describe('createEnum', () => {
  it('creates an enum with defaults', () => {
    const e = createEnum('State')
    expect(e.cmp_type).toBe('Enum')
    expect(e.values).toEqual([])
    expect(typeof e.id).toBe('string')
    expect(e.id).toMatch(/^enum_/)
  })

  it('accepts values', () => {
    const e = createEnum('State', { values: [createEnumValue('Created'), createEnumValue('Locked')] })
    expect(e.values).toEqual([{ name: 'Created' }, { name: 'Locked' }])
  })
})

describe('createGuard', () => {
  it('creates a guard with defaults', () => {
    const g = createGuard('OnlySeller')
    expect(g.cmp_type).toBe('Guard')
    expect(g.name).toBe('OnlySeller')
    expect(g.parameters).toEqual([])
    expect(g.body).toEqual({ type: 'Block', statements: [] })
    expect(typeof g.id).toBe('string')
    expect(g.id).toMatch(/^guard_/)
  })

  it('accepts parameters and a body', () => {
    const param = createParameter('state_', primitiveType('uint'))
    const body = { type: 'Block', statements: [{ cmp_type: 'ConditionStatement' }] }
    const g = createGuard('InState', { parameters: [param], body })
    expect(g.parameters).toEqual([param])
    expect(g.body).toEqual(body)
  })
})

describe('createGuardRef', () => {
  it('references a guard by id with no args', () => {
    expect(createGuardRef('guard_abc')).toEqual({ ref: 'guard_abc', args: [] })
  })

  it('references a guard by id with args', () => {
    expect(createGuardRef('guard_abc', ['State.Created'])).toEqual({ ref: 'guard_abc', args: ['State.Created'] })
  })

  it('rejects a missing guard id', () => {
    expect(() => createGuardRef('')).toThrow(/requires a guard id/)
  })
})
