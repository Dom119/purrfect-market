import { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { theme } from '../../theme'

const slideIn = keyframes`
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`

const slideOut = keyframes`
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(110%); opacity: 0; }
`

const Wrap = styled.div<{ $leaving: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #166534;
  color: #fff;
  padding: 0.75rem 1.25rem;
  border-radius: ${theme.radius.md};
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  font-size: 0.95rem;
  font-weight: 500;
  max-width: 320px;
  animation: ${({ $leaving }) => ($leaving ? slideOut : slideIn)} 0.3s ease forwards;
`

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

interface CartToastProps {
  message: string | null
  leaving: boolean
  onDismiss: () => void
}

export function CartToast({ message, leaving, onDismiss }: CartToastProps) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 2500)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <Wrap $leaving={leaving}>
      <CheckIcon />
      {message}
    </Wrap>
  )
}
