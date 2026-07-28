import { describe, it, expect } from 'vitest'
import { createId } from './id.js'

describe('createId', () => {
  it('returns a string', () => {
    expect(typeof createId()).toBe('string')
  })

  it('defaults to the "el" prefix', () => {
    expect(createId()).toMatch(/^el_/)
  })

  it('uses the given prefix', () => {
    expect(createId('variable')).toMatch(/^variable_/)
  })

  it('returns unique ids across many calls', () => {
    const ids = new Set()
    for (let i = 0; i < 1000; i++) {
      ids.add(createId('x'))
    }
    expect(ids.size).toBe(1000)
  })
})
