import { describe, it, expect } from 'vitest'
import { createEmitStatement, createRevertStatement } from './statements.js'

describe('createEmitStatement', () => {
  it('references an event with no args', () => {
    expect(createEmitStatement('event_abc')).toEqual({
      cmp_type: 'EmitStatement',
      eventRef: 'event_abc',
      args: [],
      description: '',
    })
  })

  it('references an event with args', () => {
    expect(createEmitStatement('event_abc', ['msg.sender'])).toEqual({
      cmp_type: 'EmitStatement',
      eventRef: 'event_abc',
      args: ['msg.sender'],
      description: '',
    })
  })

  it('rejects a missing event id', () => {
    expect(() => createEmitStatement('')).toThrow(/requires an event id/)
  })
})

describe('createRevertStatement', () => {
  it('references an error declaration with no args', () => {
    expect(createRevertStatement('errordeclaration_abc')).toEqual({
      cmp_type: 'RevertStatement',
      errorRef: 'errordeclaration_abc',
      args: [],
      description: '',
    })
  })

  it('references an error declaration with args', () => {
    expect(createRevertStatement('errordeclaration_abc', ['value'])).toEqual({
      cmp_type: 'RevertStatement',
      errorRef: 'errordeclaration_abc',
      args: ['value'],
      description: '',
    })
  })

  it('rejects a missing error id', () => {
    expect(() => createRevertStatement('')).toThrow(/requires an error declaration id/)
  })
})
