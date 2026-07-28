import { describe, it, expect } from 'vitest'
import { withPlatformHints } from './platformHints.js'

describe('withPlatformHints', () => {
  it('attaches hints for a target on an element with no existing hints', () => {
    const element = { id: 'function_1', cmp_type: 'Function' }
    const result = withPlatformHints(element, 'solidity', { visibility: 'external' })
    expect(result.platformHints).toEqual({ solidity: { visibility: 'external' } })
  })

  it('does not mutate the original element', () => {
    const element = { id: 'function_1', cmp_type: 'Function' }
    withPlatformHints(element, 'solidity', { visibility: 'external' })
    expect(element.platformHints).toBeUndefined()
  })

  it('merges new keys into an existing target hint object', () => {
    const element = { platformHints: { solidity: { visibility: 'external' } } }
    const result = withPlatformHints(element, 'solidity', { inline: true })
    expect(result.platformHints).toEqual({ solidity: { visibility: 'external', inline: true } })
  })

  it('preserves other targets when adding a new one', () => {
    const element = { platformHints: { solidity: { visibility: 'external' } } }
    const result = withPlatformHints(element, 'vyper', { decorator: "@nonreentrant('lock')" })
    expect(result.platformHints).toEqual({
      solidity: { visibility: 'external' },
      vyper: { decorator: "@nonreentrant('lock')" },
    })
  })

  it('rejects an unknown target', () => {
    const element = {}
    expect(() => withPlatformHints(element, 'cardano', {})).toThrow(/Unknown platform target "cardano"/)
  })
})
