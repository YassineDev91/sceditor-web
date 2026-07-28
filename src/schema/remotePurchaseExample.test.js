import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const contract = JSON.parse(readFileSync(resolve(__dirname, '..', '..', 'remote_purchase.json'), 'utf-8'))

function collectIds(contract) {
  const ids = [
    contract.id,
    ...contract.variables.map(v => v.id),
    ...contract.structs.map(s => s.id),
    ...contract.functions.map(f => f.id),
    ...contract.enums.map(e => e.id),
    ...contract.guards.map(g => g.id),
    ...contract.errorDeclarations.map(e => e.id),
    ...contract.events.map(e => e.id),
  ]
  if (contract._constructor) ids.push(contract._constructor.id)
  return ids
}

describe('remote_purchase.json (schema v2)', () => {
  it('declares schemaVersion 2', () => {
    expect(contract.schemaVersion).toBe(2)
  })

  it('has no "modifiers" field (renamed to "guards")', () => {
    expect(contract.modifiers).toBeUndefined()
    expect(Array.isArray(contract.guards)).toBe(true)
    expect(contract.guards.length).toBeGreaterThan(0)
  })

  it('gives every top-level element a unique id', () => {
    const ids = collectIds(contract)
    expect(ids.every(id => typeof id === 'string' && id.length > 0)).toBe(true)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every function guard ref resolves to a declared guard id', () => {
    const guardIds = new Set(contract.guards.map(g => g.id))
    for (const fn of contract.functions) {
      for (const guardRef of fn.guards) {
        expect(guardIds.has(guardRef.ref)).toBe(true)
      }
    }
  })

  it('every function declares mutability and visibility', () => {
    for (const fn of contract.functions) {
      expect(['pure', 'view', 'write']).toContain(fn.mutability)
      expect(['external', 'internal']).toContain(fn.visibility)
    }
  })

  it('every EmitStatement eventRef resolves to a declared event id', () => {
    const eventIds = new Set(contract.events.map(e => e.id))
    const emits = contract.functions.flatMap(f => f.body.statements.filter(s => s.cmp_type === 'EmitStatement'))
    expect(emits.length).toBeGreaterThan(0)
    for (const emit of emits) {
      expect(eventIds.has(emit.eventRef)).toBe(true)
    }
  })

  it('every RevertStatement errorRef resolves to a declared error id', () => {
    const errorIds = new Set(contract.errorDeclarations.map(e => e.id))
    const constructorReverts = contract._constructor.body.statements
      .flatMap(s => (s.cmp_type === 'ConditionStatement' ? s.body : []))
      .filter(s => s.cmp_type === 'RevertStatement')
    expect(constructorReverts.length).toBeGreaterThan(0)
    for (const revert of constructorReverts) {
      expect(errorIds.has(revert.errorRef)).toBe(true)
    }
  })

  it('the "state" variable is a reference type to the State enum, not a bare string', () => {
    const stateVar = contract.variables.find(v => v.name === 'state')
    const stateEnum = contract.enums.find(e => e.name === 'State')
    expect(stateVar.type).toEqual({ kind: 'reference', ref: stateEnum.id })
  })

  it('the constructor is stored under "_constructor", and "constructor" is not an own property', () => {
    expect(contract._constructor).toBeTruthy()
    expect(Object.prototype.hasOwnProperty.call(contract, 'constructor')).toBe(false)
  })
})
