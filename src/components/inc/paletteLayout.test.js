import { describe, it, expect } from 'vitest'
import { nextPalettePosition } from './paletteLayout.js'

function emptyContract() {
  return { variables: [], structs: [], functions: [], enums: [], guards: [], errorDeclarations: [], events: [] }
}

describe('nextPalettePosition', () => {
  it('places the first element at the base position', () => {
    expect(nextPalettePosition(emptyContract())).toEqual({ x: 100, y: 100 })
  })

  it('offsets the second element so it does not overlap the first', () => {
    const contract = emptyContract()
    contract.structs.push({ name: 'a' })
    const pos = nextPalettePosition(contract)
    expect(pos).not.toEqual({ x: 100, y: 100 })
  })

  it('counts elements across all structural types, not just one', () => {
    const contract = emptyContract()
    contract.variables.push({ name: 'v1' })
    contract.functions.push({ name: 'f1' })
    const pos = nextPalettePosition(contract)
    // 2 existing elements -> same offset regardless of which arrays they came from
    const contract2 = emptyContract()
    contract2.structs.push({ name: 's1' }, { name: 's2' })
    expect(pos).toEqual(nextPalettePosition(contract2))
  })

  it('wraps to a new row after filling a row of columns', () => {
    const contract = emptyContract()
    for (let i = 0; i < 8; i++) contract.structs.push({ name: `s${i}` })
    const pos = nextPalettePosition(contract)
    expect(pos.x).toBe(100)
    expect(pos.y).toBeGreaterThan(100)
  })
})
