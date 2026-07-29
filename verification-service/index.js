import { fileURLToPath } from 'node:url'
import path from 'node:path'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

import { createApp } from './app.js'
import * as solidity from './adapters/solidity.js'
import * as ink from './adapters/ink.js'
import * as solana from './adapters/solana.js'

const app = createApp({ solidity, ink, solana })
const port = process.env.PORT || 4100

app.listen(port, () => {
  console.log(`Verification service listening on http://localhost:${port}`)
})
