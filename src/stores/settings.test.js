import { beforeEach, describe, it, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from './settings.js'

function stubLocalStorage() {
  const store = {}
  global.localStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: (key) => { delete store[key] },
    clear: () => { for (const key of Object.keys(store)) delete store[key] },
  }
}

beforeEach(() => {
  stubLocalStorage()
  setActivePinia(createPinia())
})

describe('llm state shape', () => {
  it('has no apiKey field on gemini/openai/anthropic', () => {
    const store = useSettingsStore()
    expect(store.llm.gemini.apiKey).toBeUndefined()
    expect(store.llm.openai.apiKey).toBeUndefined()
    expect(store.llm.anthropic.apiKey).toBeUndefined()
  })

  it('has no url field on ollama (moved server-side)', () => {
    const store = useSettingsStore()
    expect(store.llm.ollama.url).toBeUndefined()
  })

  it('has a proxy config with a default url and an empty secret', () => {
    const store = useSettingsStore()
    expect(store.llm.proxy.url).toBe('http://localhost:4000')
    expect(store.llm.proxy.secret).toBe('')
  })

  it('updateLLMConfig updates the proxy config and persists it', () => {
    const store = useSettingsStore()
    store.updateLLMConfig('proxy', { secret: 'my-secret' })
    expect(store.llm.proxy.secret).toBe('my-secret')
    expect(store.llm.proxy.url).toBe('http://localhost:4000')
  })
})

describe('llm.verify config', () => {
  it('has a default url and empty secret', () => {
    const store = useSettingsStore()
    expect(store.llm.verify.url).toBe('http://localhost:4100')
    expect(store.llm.verify.secret).toBe('')
  })

  it('updateLLMConfig updates the verify config and persists it', () => {
    const store = useSettingsStore()
    store.updateLLMConfig('verify', { secret: 'my-secret' })
    expect(store.llm.verify.secret).toBe('my-secret')
    expect(store.llm.verify.url).toBe('http://localhost:4100')
  })

  it('backfills verify defaults for an old-shape saved blob with no verify key', () => {
    // beforeEach already ran stubLocalStorage() + setActivePinia(createPinia()) for this test —
    // just seed the fresh stub directly, no need to redo either.
    localStorage.setItem('sceditor-settings', JSON.stringify({
      llm: { provider: 'ollama', ollama: { model: 'llama3' }, proxy: { url: 'http://localhost:4000', secret: 'x' } },
    }))
    const store = useSettingsStore()
    expect(store.llm.verify.url).toBe('http://localhost:4100')
    expect(store.llm.verify.secret).toBe('')
  })
})

describe('migration from old-shape localStorage', () => {
  it('backfills llm.proxy defaults and drops stale apiKey/ollama.url fields', () => {
    const oldShapeBlob = {
      llm: {
        provider: 'openai',
        gemini: { apiKey: 'old-gemini-key', model: 'gemini-pro' },
        openai: { apiKey: 'old-openai-key', model: 'gpt-4' },
        anthropic: { apiKey: 'old-anthropic-key', model: 'claude-3-5-sonnet-20241022' },
        ollama: { url: 'http://localhost:11434', model: 'llama3' },
      },
      editor: {
        autosaveEnabled: true,
        autosaveInterval: 30000,
        gridEnabled: true,
        snapToGrid: false,
        gridSize: 20,
        theme: 'light',
      },
      general: { language: 'en', showWelcome: true },
    }
    localStorage.setItem('sceditor-settings', JSON.stringify(oldShapeBlob))

    const store = useSettingsStore()

    // proxy config must be backfilled with proper defaults, not left undefined
    expect(store.llm.proxy).toBeDefined()
    expect(store.llm.proxy.url).toBe('http://localhost:4000')
    expect(store.llm.proxy.secret).toBe('')

    // stale apiKey fields and ollama.url must not survive into the loaded state
    expect(store.llm.gemini.apiKey).toBeUndefined()
    expect(store.llm.openai.apiKey).toBeUndefined()
    expect(store.llm.anthropic.apiKey).toBeUndefined()
    expect(store.llm.ollama.url).toBeUndefined()

    // fields that do still exist in the new shape should be preserved from the saved blob
    expect(store.llm.provider).toBe('openai')
    expect(store.llm.ollama.model).toBe('llama3')
  })
})

describe('testLLMConnection', () => {
  it('reports proxy authentication failure on a 401', async () => {
    const store = useSettingsStore()
    global.fetch = vi.fn().mockResolvedValue({ status: 401, ok: false })
    const result = await store.testLLMConnection()
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/authentication failed/i)
  })

  it('reports ollama reachable with a model count', async () => {
    const store = useSettingsStore()
    store.llm.provider = 'ollama'
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ollama: { reachable: true, models: ['llama3', 'mistral'] } }),
    })
    const result = await store.testLLMConnection()
    expect(result.success).toBe(true)
    expect(result.message).toMatch(/2 models/)
  })

  it('reports ollama unreachable', async () => {
    const store = useSettingsStore()
    store.llm.provider = 'ollama'
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ollama: { reachable: false, models: [] } }),
    })
    const result = await store.testLLMConnection()
    expect(result.success).toBe(false)
  })

  it('reports a cloud provider as configured', async () => {
    const store = useSettingsStore()
    store.llm.provider = 'anthropic'
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ anthropic: { configured: true } }),
    })
    const result = await store.testLLMConnection()
    expect(result.success).toBe(true)
  })

  it('reports a cloud provider as not configured', async () => {
    const store = useSettingsStore()
    store.llm.provider = 'openai'
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ openai: { configured: false } }),
    })
    const result = await store.testLLMConnection()
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/not configured/)
  })

  it('reports an unreachable proxy', async () => {
    const store = useSettingsStore()
    global.fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'))
    const result = await store.testLLMConnection()
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/reach the proxy server/i)
  })
})
