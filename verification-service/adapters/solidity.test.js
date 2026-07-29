import { describe, it, expect } from 'vitest'
import { compile } from './solidity.js'

describe('solidity adapter', () => {
  it('reports success for a valid contract', async () => {
    const result = await compile(`
      // SPDX-License-Identifier: MIT
      pragma solidity ^0.8.0;
      contract Simple {
        uint256 public value;
        function setValue(uint256 v) public { value = v; }
      }
    `)
    expect(result.success).toBe(true)
    expect(result.errors).toBeNull()
  })

  it('reports failure with a real compiler error for broken syntax', async () => {
    const result = await compile(`
      pragma solidity ^0.8.0;
      contract Broken {
        uint256 public value
        function setValue(uint256 v) public { value = v; }
      }
    `)
    expect(result.success).toBe(false)
    expect(result.errors).toContain('ParserError')
  })

  it('reports failure for a type error, not just syntax errors', async () => {
    const result = await compile(`
      pragma solidity ^0.8.0;
      contract TypeError {
        function bad() public pure returns (uint256) {
          return "not a number";
        }
      }
    `)
    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})
