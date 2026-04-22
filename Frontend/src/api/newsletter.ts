const API_BASE = '/api'

export async function checkSubscription(email: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/newsletter/status?email=${encodeURIComponent(email)}`)
  if (!res.ok) return false
  const data = (await res.json().catch(() => ({}))) as { subscribed?: boolean }
  return data.subscribed ?? false
}

export async function unsubscribeNewsletter(email: string): Promise<void> {
  await fetch(`${API_BASE}/newsletter/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}

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
