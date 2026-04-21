import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentPage } from './ContentPage'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <ContentPage
      title="Contact us"
      lead="We'd love to hear from you—whether it's a product question, order issue, or just a cute cat photo."
    >
      <p>
        <strong>Hours:</strong> Monday–Friday, 9am–5pm. We aim to reply within one business day.
      </p>
      <p>
        For order help, include your order number from <Link to="/orders">My orders</Link> so we can assist faster.
      </p>

      {status === 'sent' ? (
        <p style={{ color: '#27ae60', fontWeight: 600, marginTop: '1.5rem' }}>
          ✓ Message sent! We'll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
          {status === 'error' && (
            <p style={{ color: '#e74c3c' }}>Something went wrong. Please try again.</p>
          )}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontWeight: 600 }}>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontWeight: 600 }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontWeight: 600 }}>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical' }}
            />
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#1e3a5f',
              color: 'white',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </ContentPage>
  )
}
