import express from 'express'
import cors from 'cors'

export function createApp(adapters) {
  const app = express()
  app.use(cors())
  app.use(express.json({ limit: '2mb' }))

  app.use((req, res, next) => {
    const expected = process.env.PROXY_SHARED_SECRET
    if (expected && req.header('X-Proxy-Secret') !== expected) {
      return res.status(401).json({ error: 'Invalid or missing proxy secret' })
    }
    next()
  })

  app.post('/api/generate', async (req, res) => {
    const { provider, model, prompt } = req.body || {}
    const adapter = adapters[provider]
    if (!adapter) {
      return res.status(400).json({ error: `Unknown provider: ${provider}` })
    }
    if (typeof adapter.isConfigured === 'function' && !adapter.isConfigured()) {
      return res.status(400).json({ error: `${provider} is not configured on the server` })
    }
    try {
      const code = await adapter.generate(prompt, model)
      res.json({ code })
    } catch (err) {
      res.status(502).json({ error: err.message })
    }
  })

  app.get('/api/status', async (req, res) => {
    const status = {}
    for (const [name, adapter] of Object.entries(adapters)) {
      if (typeof adapter.checkReachable === 'function') {
        status[name] = await adapter.checkReachable()
      } else if (typeof adapter.isConfigured === 'function') {
        status[name] = { configured: adapter.isConfigured() }
      } else {
        status[name] = {}
      }
    }
    res.json(status)
  })

  return app
}
