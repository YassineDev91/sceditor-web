// src/composables/useFunctionLayerConnectors.test.js
import { describe, it, expect } from 'vitest'
import { keepWithinBounds } from './useFunctionLayerConnectors.js'

describe('keepWithinBounds', () => {
  it('leaves a fully-in-bounds position unchanged', () => {
    expect(keepWithinBounds(50, 50, 100, 100, 800, 600)).toEqual({ x: 50, y: 50 })
  })

  it('clamps a position past the right/bottom edge', () => {
    expect(keepWithinBounds(1000, 1000, 100, 100, 800, 600)).toEqual({ x: 700, y: 500 })
  })

  it('clamps a negative position to 0', () => {
    expect(keepWithinBounds(-50, -50, 100, 100, 800, 600)).toEqual({ x: 0, y: 0 })
  })
})
