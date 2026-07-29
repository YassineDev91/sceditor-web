export function isConfigured() {
  return !!process.env.ANTHROPIC_API_KEY
}

export async function generate(prompt, model) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Anthropic is not configured on the server')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.content[0]?.text
}
