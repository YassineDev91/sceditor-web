import { fileURLToPath } from 'node:url'
import path from 'node:path'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

import { createApp } from './app.js'
import * as ollama from './adapters/ollama.js'
import * as gemini from './adapters/gemini.js'
import * as openai from './adapters/openai.js'
import * as anthropic from './adapters/anthropic.js'

const app = createApp({ ollama, gemini, openai, anthropic })
const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`LLM proxy listening on http://localhost:${port}`)
})
