import { describe, it, expect } from 'vitest'
import { isMultiSelectModifier } from './canvasEvents.js'

describe('isMultiSelectModifier', () => {
  it('is true when shiftKey is set', () => {
    expect(isMultiSelectModifier({ evt: { shiftKey: true } })).toBe(true)
  })
  it('is true when ctrlKey is set', () => {
    expect(isMultiSelectModifier({ evt: { ctrlKey: true } })).toBe(true)
  })
  it('is true when metaKey is set', () => {
    expect(isMultiSelectModifier({ evt: { metaKey: true } })).toBe(true)
  })
  it('is false with no modifier held', () => {
    expect(isMultiSelectModifier({ evt: {} })).toBe(false)
  })
  it('is false with no native event at all', () => {
    expect(isMultiSelectModifier({})).toBe(false)
  })
})
