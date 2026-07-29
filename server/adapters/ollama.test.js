import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generate, checkReachable } from './ollama.js'

beforeEach(() => {
  vi.restoreAllMocks()
  vi.stubEnv('OLLAMA_URL', 'http://localhost:11434')
})

describe('ollama adapter generate', () => {
  it('posts to /api/generate with the model and prompt, stream disabled', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: 'generated code' }),
    })
    const result = await generate('a prompt', 'llama3')
    expect(result).toBe('generated code')
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:11434/api/generate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama3', prompt: 'a prompt', stream: false }),
      })
    )
  })

  it('throws a clear error on a non-OK response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Internal Server Error' })
    await expect(generate('p', 'llama3')).rejects.toThrow(/Ollama request failed: 500/)
  })
})

describe('ollama adapter checkReachable', () => {
  it('reports reachable with model names on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ models: [{ name: 'llama3' }, { name: 'mistral' }] }),
    })
    const result = await checkReachable()
    expect(result).toEqual({ reachable: true, models: ['llama3', 'mistral'] })
  })

  it('reports unreachable when the request fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'))
    const result = await checkReachable()
    expect(result).toEqual({ reachable: false, models: [] })
  })

  it('reports unreachable on a non-OK response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false })
    const result = await checkReachable()
    expect(result).toEqual({ reachable: false, models: [] })
  })
})
