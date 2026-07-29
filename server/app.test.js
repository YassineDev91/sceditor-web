import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { createApp } from './app.js'

let server
let baseUrl

const mockAdapters = {
  fake: {
    generate: vi.fn(async (prompt, model) => `generated:${model}:${prompt}`),
    isConfigured: vi.fn(() => true),
  },
  unconfigured: {
    generate: vi.fn(),
    isConfigured: vi.fn(() => false),
  },
  ollamaLike: {
    generate: vi.fn(async () => 'ollama code'),
    checkReachable: vi.fn(async () => ({ reachable: true, models: ['llama3'] })),
  },
}

beforeAll(() => new Promise((resolve) => {
  process.env.PROXY_SHARED_SECRET = 'test-secret'
  const app = createApp(mockAdapters)
  server = app.listen(0, () => {
    baseUrl = `http://localhost:${server.address().port}`
    resolve()
  })
}))

afterAll(() => new Promise((resolve) => server.close(resolve)))

describe('POST /api/generate', () => {
  it('rejects requests missing the shared secret', async () => {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'fake', model: 'x', prompt: 'y' }),
    })
    expect(res.status).toBe(401)
  })

  it('rejects requests with the wrong shared secret', async () => {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Proxy-Secret': 'wrong' },
      body: JSON.stringify({ provider: 'fake', model: 'x', prompt: 'y' }),
    })
    expect(res.status).toBe(401)
  })

  it('rejects an unknown provider', async () => {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Proxy-Secret': 'test-secret' },
      body: JSON.stringify({ provider: 'nope', model: 'x', prompt: 'y' }),
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Unknown provider/)
  })

  it('rejects a provider that is not configured', async () => {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Proxy-Secret': 'test-secret' },
      body: JSON.stringify({ provider: 'unconfigured', model: 'x', prompt: 'y' }),
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/not configured/)
  })

  it('dispatches to the matching adapter and returns its generated code', async () => {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Proxy-Secret': 'test-secret' },
      body: JSON.stringify({ provider: 'fake', model: 'test-model', prompt: 'test-prompt' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.code).toBe('generated:test-model:test-prompt')
  })

  it('returns 502 with the error message when the adapter throws', async () => {
    mockAdapters.fake.generate.mockRejectedValueOnce(new Error('upstream exploded'))
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Proxy-Secret': 'test-secret' },
      body: JSON.stringify({ provider: 'fake', model: 'x', prompt: 'y' }),
    })
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('upstream exploded')
  })
})

describe('GET /api/status', () => {
  it('reports configured/reachable state per adapter', async () => {
    const res = await fetch(`${baseUrl}/api/status`, {
      headers: { 'X-Proxy-Secret': 'test-secret' },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.fake).toEqual({ configured: true })
    expect(body.unconfigured).toEqual({ configured: false })
    expect(body.ollamaLike).toEqual({ reachable: true, models: ['llama3'] })
  })

  it('is also gated by the shared secret', async () => {
    const res = await fetch(`${baseUrl}/api/status`)
    expect(res.status).toBe(401)
  })
})
