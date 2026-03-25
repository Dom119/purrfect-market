const API_BASE = '/api'

export async function subscribeNewsletter(email: string): Promise<string> {
  const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = (await res.json().catch(() => ({}))) as { message?: string }
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.')
  }
  return data.message ?? 'Thanks for subscribing!'
}
