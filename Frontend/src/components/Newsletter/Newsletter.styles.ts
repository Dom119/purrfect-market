import styled from 'styled-components'
import { theme } from '../../theme'

export const Section = styled.section`
  padding: 4rem 1.5rem;
`

export const Inner = styled.div`
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: 3rem 4rem;
  background: #2d2d44;
  border-radius: ${theme.radius.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2rem 1.5rem;
    text-align: center;
  }
`

export const Content = styled.div`
  max-width: 400px;
`

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`

export const Description = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
  max-width: 450px;
  width: 100%;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 100%;
  }
`

export const Input = styled.input`
  flex: 1;
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
  border: none;
  border-radius: ${theme.radius.md};
  background: white;

  &::placeholder {
    color: ${theme.colors.greyLight};
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.85;
  }
`

export const Button = styled.button`
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.radius.md};
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }
`

export const FormMessage = styled.p<{ $variant: 'success' | 'error' }>`
  flex-basis: 100%;
  margin: 0;
  padding-top: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.4;
  color: ${(p) => (p.$variant === 'error' ? '#fecaca' : '#bbf7d0')};
`
