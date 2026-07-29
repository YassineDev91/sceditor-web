export function isConfigured() {
  return !!process.env.GEMINI_API_KEY
}

export async function generate(prompt, model) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini is not configured on the server')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.candidates[0]?.content?.parts?.[0]?.text
}
