export async function generate(prompt, model) {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false }),
  })

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.response
}

export async function checkReachable() {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`)
    if (!response.ok) {
      return { reachable: false, models: [] }
    }
    const data = await response.json()
    return { reachable: true, models: (data.models || []).map((m) => m.name) }
  } catch {
    return { reachable: false, models: [] }
  }
}
