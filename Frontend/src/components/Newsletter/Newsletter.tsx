import { useState, useEffect, FormEvent } from 'react'
import { subscribeNewsletter, checkSubscription, unsubscribeNewsletter } from '../../api/newsletter'
import type { AuthResponse } from '../../api/auth'
import {
  Section,
  Inner,
  Content,
  Title,
  Description,
  Form,
  Input,
  Button,
  FormMessage,
} from './Newsletter.styles'

interface NewsletterProps {
  user?: AuthResponse | null
}

export function Newsletter({ user }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)

  useEffect(() => {
    setMessage(null)
    setStatus('idle')
    setEmail('')
    setSubscribed(false)
    if (!user?.email) return
    setCheckingStatus(true)
    checkSubscription(user.email)
      .then(setSubscribed)
      .finally(() => setCheckingStatus(false))
  }, [user?.email])

  const handleGuestSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setStatus('loading')
    try {
      const msg = await subscribeNewsletter(email)
      setMessage(msg)
      setStatus('success')
      setEmail('')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Subscription failed')
      setStatus('error')
    }
  }

  const handleLoggedInSubscribe = async () => {
    if (!user?.email) return
    setStatus('loading')
    setMessage(null)
    try {
      const msg = await subscribeNewsletter(user.email)
      setMessage(msg)
      setStatus('success')
      setSubscribed(true)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Subscription failed')
      setStatus('error')
    }
  }

  const handleUnsubscribe = async () => {
    if (!user?.email) return
    setStatus('loading')
    setMessage(null)
    try {
      await unsubscribeNewsletter(user.email)
      setSubscribed(false)
      setStatus('idle')
      setMessage('You have been unsubscribed.')
    } catch {
      setStatus('error')
      setMessage('Could not unsubscribe. Please try again.')
    }
  }

  if (checkingStatus) return null

  // Logged-in + already subscribed
  if (user && subscribed) {
    return (
      <Section>
        <Inner>
          <Content>
            <Title>You're in the Purrfect Club!</Title>
            <Description>
              You're subscribed to our newsletter at <strong>{user.email}</strong>. We'll keep you posted on new arrivals and exclusive offers.
            </Description>
          </Content>
          <Form as="div">
            <Button type="button" onClick={handleUnsubscribe} disabled={status === 'loading'}
              style={{ background: 'transparent', border: '1px solid currentColor', opacity: 0.7 }}>
              {status === 'loading' ? 'Unsubscribing…' : 'Unsubscribe'}
            </Button>
            {message && (
              <FormMessage $variant={status === 'error' ? 'error' : 'success'}>{message}</FormMessage>
            )}
          </Form>
        </Inner>
      </Section>
    )
  }

  // Logged-in + not subscribed
  if (user) {
    return (
      <Section>
        <Inner>
          <Content>
            <Title>Join Our Purrfect Club</Title>
            <Description>
              Subscribe for 15% off your first order and get exclusive tips, new arrivals, and special offers — we'll use <strong>{user.email}</strong>.
            </Description>
          </Content>
          <Form as="div">
            <Button type="button" onClick={handleLoggedInSubscribe} disabled={status === 'loading'}>
              {status === 'loading' ? 'Subscribing…' : 'Subscribe Now'}
            </Button>
            {message && (
              <FormMessage id="newsletter-feedback" $variant={status === 'error' ? 'error' : 'success'}>
                {message}
              </FormMessage>
            )}
          </Form>
        </Inner>
      </Section>
    )
  }

  // Guest
  return (
    <Section>
      <Inner>
        <Content>
          <Title>Join Our Purrfect Club</Title>
          <Description>
            Subscribe for 15% off your first order and get exclusive tips, new arrivals, and special offers.
          </Description>
        </Content>
        <Form onSubmit={handleGuestSubmit} noValidate>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'success' || status === 'error') {
                setStatus('idle')
                setMessage(null)
              }
            }}
            required
            aria-label="Email"
            aria-invalid={status === 'error'}
            aria-describedby={message ? 'newsletter-feedback' : undefined}
            disabled={status === 'loading'}
            autoComplete="email"
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Subscribing…' : 'Subscribe Now'}
          </Button>
          {message && (
            <FormMessage id="newsletter-feedback" $variant={status === 'error' ? 'error' : 'success'}>
              {message}
            </FormMessage>
          )}
        </Form>
      </Inner>
    </Section>
  )
}
