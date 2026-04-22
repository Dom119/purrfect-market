import styled from 'styled-components'
import { theme } from '../theme'

export const PageContainer = styled.main`
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.5rem;
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${theme.colors.grey};
  margin-bottom: 2rem;
`

export const Section = styled.section`
  margin-bottom: 2.5rem;
`

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.navy};
  margin-bottom: 1rem;
`

export const Field = styled.div`
  margin-bottom: 1rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${theme.colors.charcoal};
  margin-bottom: 0.35rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  font-family: ${theme.fonts.body};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  color: ${theme.colors.navy};
  background: ${theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(242, 163, 101, 0.25);
  }
`

export const ReadOnly = styled.div`
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  color: ${theme.colors.charcoal};
  background: ${theme.colors.greyBg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
`

export const Button = styled.button`
  padding: 0.65rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  background: ${theme.colors.primary};
  border-radius: ${theme.radius.md};
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const Message = styled.p<{ $variant?: 'ok' | 'err' }>`
  font-size: 0.9rem;
  margin-top: 0.75rem;
  color: ${({ $variant }) => ($variant === 'ok' ? theme.colors.green : '#c62828')};
`
