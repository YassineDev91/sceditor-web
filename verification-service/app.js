import express from 'express'
import cors from 'cors'

export function createApp(adapters) {
  const app = express()
  app.use(cors())
  app.use(express.json({ limit: '2mb' }))

  app.use((req, res, next) => {
    const expected = process.env.VERIFY_SHARED_SECRET
    if (!expected) {
      return res.status(503).json({ error: 'Verification service is not configured with a shared secret (VERIFY_SHARED_SECRET) — refusing all requests.' })
    }
    if (req.header('X-Verify-Secret') !== expected) {
      return res.status(401).json({ error: 'Invalid or missing verify secret' })
    }
    next()
  })

  app.post('/api/verify', async (req, res) => {
    const { language, code } = req.body || {}
    const adapter = adapters[language]
    if (!adapter) {
      return res.status(400).json({ error: `Unsupported language: ${language}` })
    }
    try {
      const result = await adapter.compile(code)
      res.json(result)
    } catch (err) {
      res.status(502).json({ error: err.message })
    }
  })

  return app
}
