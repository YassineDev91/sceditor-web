import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { createApp } from './app.js'

let server
let baseUrl

const mockAdapters = {
  fake: {
    compile: vi.fn(async () => ({ success: true, errors: null })),
  },
}

beforeAll(() => new Promise((resolve) => {
  process.env.VERIFY_SHARED_SECRET = 'test-secret'
  const app = createApp(mockAdapters)
  server = app.listen(0, () => {
    baseUrl = `http://localhost:${server.address().port}`
    resolve()
  })
}))

afterAll(() => new Promise((resolve) => server.close(resolve)))

describe('POST /api/verify', () => {
  it('rejects requests missing the shared secret', async () => {
    const res = await fetch(`${baseUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'fake', code: 'x' }),
    })
    expect(res.status).toBe(401)
  })

  it('rejects an unsupported language', async () => {
    const res = await fetch(`${baseUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Verify-Secret': 'test-secret' },
      body: JSON.stringify({ language: 'cobol', code: 'x' }),
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/Unsupported language/)
  })

  it('dispatches to the matching adapter and returns its result', async () => {
    const res = await fetch(`${baseUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Verify-Secret': 'test-secret' },
      body: JSON.stringify({ language: 'fake', code: 'contract X {}' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  it('returns 502 when the adapter throws', async () => {
    mockAdapters.fake.compile.mockRejectedValueOnce(new Error('compiler crashed'))
    const res = await fetch(`${baseUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Verify-Secret': 'test-secret' },
      body: JSON.stringify({ language: 'fake', code: 'x' }),
    })
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('compiler crashed')
  })
})
