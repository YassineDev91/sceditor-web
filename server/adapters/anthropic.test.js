import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generate, isConfigured } from './anthropic.js'

beforeEach(() => {
  vi.restoreAllMocks()
  vi.stubEnv('ANTHROPIC_API_KEY', 'test-key')
})

describe('anthropic adapter isConfigured', () => {
  it('is true when ANTHROPIC_API_KEY is set', () => {
    expect(isConfigured()).toBe(true)
  })

  it('is false when ANTHROPIC_API_KEY is empty', () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    expect(isConfigured()).toBe(false)
  })
})

describe('anthropic adapter generate', () => {
  it('posts to the messages endpoint with x-api-key and returns the text', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'generated code' }] }),
    })
    const result = await generate('a prompt', 'claude-3-5-sonnet-20241022')
    expect(result).toBe('generated code')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-key',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: 'a prompt' }],
        }),
      })
    )
  })

  it('throws when no key is configured', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    await expect(generate('p', 'claude-3-5-sonnet-20241022')).rejects.toThrow(/not configured/i)
  })

  it('throws a clear error on a non-OK response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 529, statusText: 'Overloaded' })
    await expect(generate('p', 'claude-3-5-sonnet-20241022')).rejects.toThrow(/Anthropic request failed: 529/)
  })
})
