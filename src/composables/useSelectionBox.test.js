// src/composables/useSelectionBox.test.js
import { describe, it, expect } from 'vitest'
import { getIntersectingElements } from './useSelectionBox.js'

describe('getIntersectingElements', () => {
  it('returns elements whose 160x100 box overlaps the selection box', () => {
    const elements = [
      { name: 'inside', x: 50, y: 50 },
      { name: 'far-away', x: 1000, y: 1000 },
    ]
    const box = { x: 0, y: 0, width: 300, height: 300 }
    const result = getIntersectingElements(elements, box)
    expect(result.map(e => e.name)).toEqual(['inside'])
  })

  it('excludes elements with undefined x or y', () => {
    const elements = [{ name: 'no-position' }, { name: 'no-y', x: 10 }]
    const box = { x: 0, y: 0, width: 100, height: 100 }
    expect(getIntersectingElements(elements, box)).toEqual([])
  })

  it('includes an element whose box only partially overlaps the selection box', () => {
    // element spans x:140-300 (160 wide), y:0-100; box spans x:0-150, y:0-100 -> overlap in x:140-150
    const elements = [{ name: 'partial-overlap', x: 140, y: 0 }]
    const box = { x: 0, y: 0, width: 150, height: 100 }
    const result = getIntersectingElements(elements, box)
    expect(result.map(e => e.name)).toEqual(['partial-overlap'])
  })

  it('excludes an element fully to the right of the selection box', () => {
    // element spans x:400-560; box spans x:0-150 -> no overlap
    const elements = [{ name: 'no-overlap', x: 400, y: 0 }]
    const box = { x: 0, y: 0, width: 150, height: 100 }
    expect(getIntersectingElements(elements, box)).toEqual([])
  })
})
