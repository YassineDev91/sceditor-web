import { describe, it, expect, vi } from 'vitest'
import { runVerificationLoop } from './verificationLoop.js'

describe('runVerificationLoop', () => {
  it('succeeds on the first attempt', async () => {
    const generate = vi.fn(async () => 'good code')
    const verify = vi.fn(async () => ({ success: true, errors: null }))
    const result = await runVerificationLoop({
      language: 'solidity',
      buildPrompt: () => 'initial prompt',
      buildFixPrompt: () => 'fix prompt',
      generate,
      verify,
    })
    expect(result.success).toBe(true)
    expect(result.code).toBe('good code')
    expect(result.attempts).toHaveLength(1)
    expect(generate).toHaveBeenCalledTimes(1)
  })

  it('retries with a fix prompt after a compile failure, then succeeds', async () => {
    const generate = vi.fn()
      .mockResolvedValueOnce('broken code')
      .mockResolvedValueOnce('fixed code')
    const verify = vi.fn()
      .mockResolvedValueOnce({ success: false, errors: 'syntax error on line 3' })
      .mockResolvedValueOnce({ success: true, errors: null })
    const buildFixPrompt = vi.fn((code, error) => `fix: ${code} because ${error}`)

    const result = await runVerificationLoop({
      language: 'solidity',
      buildPrompt: () => 'initial prompt',
      buildFixPrompt,
      generate,
      verify,
    })

    expect(result.success).toBe(true)
    expect(result.code).toBe('fixed code')
    expect(result.attempts).toHaveLength(2)
    expect(buildFixPrompt).toHaveBeenCalledWith('broken code', 'syntax error on line 3')
    expect(generate).toHaveBeenNthCalledWith(2, 'fix: broken code because syntax error on line 3')
  })

  it('gives up after maxAttempts and reports the final error', async () => {
    const generate = vi.fn(async () => 'still broken')
    const verify = vi.fn(async () => ({ success: false, errors: 'still broken error' }))

    const result = await runVerificationLoop({
      language: 'solidity',
      buildPrompt: () => 'initial prompt',
      buildFixPrompt: () => 'fix prompt',
      generate,
      verify,
      maxAttempts: 3,
    })

    expect(result.success).toBe(false)
    expect(result.attempts).toHaveLength(3)
    expect(result.finalError).toBe('still broken error')
    expect(generate).toHaveBeenCalledTimes(3)
  })

  it('aborts immediately without retrying when generate throws (infra failure, not a compile failure)', async () => {
    const generate = vi.fn(async () => { throw new Error('proxy unreachable') })
    const verify = vi.fn()

    const result = await runVerificationLoop({
      language: 'solidity',
      buildPrompt: () => 'initial prompt',
      buildFixPrompt: () => 'fix prompt',
      generate,
      verify,
    })

    expect(result.success).toBe(false)
    expect(result.attempts).toHaveLength(0)
    expect(result.finalError).toContain('proxy unreachable')
    expect(verify).not.toHaveBeenCalled()
  })

  it('aborts immediately without retrying when verify throws (verification service unreachable)', async () => {
    const generate = vi.fn(async () => 'some code')
    const verify = vi.fn(async () => { throw new Error('verification service unreachable') })

    const result = await runVerificationLoop({
      language: 'solidity',
      buildPrompt: () => 'initial prompt',
      buildFixPrompt: () => 'fix prompt',
      generate,
      verify,
    })

    expect(result.success).toBe(false)
    expect(result.attempts).toHaveLength(0)
    expect(result.finalError).toContain('verification service unreachable')
    expect(generate).toHaveBeenCalledTimes(1)
  })
})
