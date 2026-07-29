import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generate, isConfigured } from './openai.js'

beforeEach(() => {
  vi.restoreAllMocks()
  vi.stubEnv('OPENAI_API_KEY', 'test-key')
})

describe('openai adapter isConfigured', () => {
  it('is true when OPENAI_API_KEY is set', () => {
    expect(isConfigured()).toBe(true)
  })

  it('is false when OPENAI_API_KEY is empty', () => {
    vi.stubEnv('OPENAI_API_KEY', '')
    expect(isConfigured()).toBe(false)
  })
})

describe('openai adapter generate', () => {
  it('posts to the chat completions endpoint with a bearer token and returns the content', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'generated code' } }] }),
    })
    const result = await generate('a prompt', 'gpt-4')
    expect(result).toBe('generated code')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key',
        },
        body: JSON.stringify({ model: 'gpt-4', messages: [{ role: 'user', content: 'a prompt' }] }),
      })
    )
  })

  it('throws when no key is configured', async () => {
    vi.stubEnv('OPENAI_API_KEY', '')
    await expect(generate('p', 'gpt-4')).rejects.toThrow(/not configured/i)
  })

  it('throws a clear error on a non-OK response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401, statusText: 'Unauthorized' })
    await expect(generate('p', 'gpt-4')).rejects.toThrow(/OpenAI request failed: 401/)
  })
})
