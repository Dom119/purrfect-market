import { useState, FormEvent } from 'react'
import { subscribeNewsletter } from '../../api/newsletter'
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

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
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

  return (
    <Section>
      <Inner>
        <Content>
          <Title>Join Our Purrfect Club</Title>
          <Description>
            Subscribe for 15% off your first order and get exclusive tips, new arrivals, and special offers.
          </Description>
        </Content>
        <Form onSubmit={handleSubmit} noValidate>
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
