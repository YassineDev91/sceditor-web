import { describe, it, expect } from 'vitest'
import { snapValue } from './snapToGrid.js'

describe('snapValue', () => {
  it('rounds to the nearest multiple of the grid size', () => {
    expect(snapValue(0, 20)).toBe(0)
    expect(snapValue(9, 20)).toBe(0)
    expect(snapValue(11, 20)).toBe(20)
    expect(snapValue(30, 20)).toBe(40)
  })

  it('handles negative values', () => {
    expect(snapValue(-11, 20)).toBe(-20)
    expect(snapValue(-9, 20)).toBe(0)
  })
})
