import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generate, isConfigured } from './gemini.js'

beforeEach(() => {
  vi.restoreAllMocks()
  vi.stubEnv('GEMINI_API_KEY', 'test-key')
})

describe('gemini adapter isConfigured', () => {
  it('is true when GEMINI_API_KEY is set', () => {
    expect(isConfigured()).toBe(true)
  })

  it('is false when GEMINI_API_KEY is empty', () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    expect(isConfigured()).toBe(false)
  })
})

describe('gemini adapter generate', () => {
  it('posts to the Gemini API with the key in the query string and returns the text', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'generated code' }] } }] }),
    })
    const result = await generate('a prompt', 'gemini-pro')
    expect(result).toBe('generated code')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=test-key',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'a prompt' }] }] }),
      })
    )
  })

  it('throws when no key is configured', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    await expect(generate('p', 'gemini-pro')).rejects.toThrow(/not configured/i)
  })

  it('throws a clear error on a non-OK response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429, statusText: 'Too Many Requests' })
    await expect(generate('p', 'gemini-pro')).rejects.toThrow(/Gemini request failed: 429/)
  })
})
