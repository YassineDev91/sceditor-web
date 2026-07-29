export function isConfigured() {
  return !!process.env.OPENAI_API_KEY
}

export async function generate(prompt, model) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OpenAI is not configured on the server')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content
}
