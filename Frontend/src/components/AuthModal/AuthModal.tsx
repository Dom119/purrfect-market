import { useState, useEffect } from 'react'
import {
  Overlay,
  Modal,
  Brand,
  CloseButton,
  Tabs,
  Tab,
  Form,
  Input,
  SubmitButton,
  SwitchPrompt,
  SwitchLink,
  ErrorMessage,
} from './AuthModal.styles'
import { authApi, type AuthResponse } from '../../api/auth'
import { DEV_AUTH_AUTOFILL } from '../../config/devAutofill'

type AuthMode = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (user: AuthResponse) => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && DEV_AUTH_AUTOFILL) {
      setEmail(DEV_AUTH_AUTOFILL.email)
      setPassword(DEV_AUTH_AUTOFILL.password)
    }
  }, [isOpen])

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let response: AuthResponse
      if (mode === 'login') {
        response = await authApi.login({ email, password })
      } else {
        response = await authApi.register({ name, email, password })
      }
      resetForm()
      onClose()
      onSuccess?.(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </CloseButton>

        <Brand>Purrfect Market</Brand>

        <Tabs>
          <Tab $active={mode === 'login'} onClick={() => setMode('login')}>
            Login
          </Tab>
          <Tab $active={mode === 'register'} onClick={() => setMode('register')}>
            Register
          </Tab>
        </Tabs>

        <h2 id="auth-modal-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {mode === 'register' && (
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </SubmitButton>
        </Form>

        <SwitchPrompt>
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <SwitchLink type="button" onClick={() => setMode('register')}>
                Register
              </SwitchLink>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <SwitchLink type="button" onClick={() => setMode('login')}>
                Login
              </SwitchLink>
            </>
          )}
        </SwitchPrompt>
      </Modal>
    </Overlay>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
