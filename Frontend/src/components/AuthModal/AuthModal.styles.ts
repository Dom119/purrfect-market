import styled from 'styled-components'
import { theme } from '../../theme'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadows.lg};

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${theme.colors.navy};
    margin-bottom: 1.5rem;
  }
`

export const Brand = styled.span`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
`

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.grey};
  background: transparent;
  border-radius: ${theme.radius.full};
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: ${theme.colors.charcoal};
    background: ${theme.colors.greyBg};
  }
`

export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.grey)};
  background: ${({ $active }) => ($active ? `${theme.colors.primary}20` : 'transparent')};
  border: 2px solid ${({ $active }) => ($active ? theme.colors.primary : 'transparent')};
  border-radius: ${theme.radius.md};
  transition: all 0.2s;

  &:hover {
    color: ${theme.colors.primary};
    background: ${({ $active }) => ($active ? `${theme.colors.primary}20` : theme.colors.greyBg)};
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Input = styled.input`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid ${theme.colors.greyBg};
  border-radius: ${theme.radius.md};
  transition: border-color 0.2s;

  &::placeholder {
    color: ${theme.colors.greyLight};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`

export const SubmitButton = styled.button`
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: ${theme.colors.primary};
  border-radius: ${theme.radius.md};
  margin-top: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.primaryDark};
  }
`

export const ErrorMessage = styled.p`
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #b91c1c;
  background: #fef2f2;
  border-radius: ${theme.radius.sm};
`

export const SwitchPrompt = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${theme.colors.grey};
  text-align: center;
`

export const SwitchLink = styled.button`
  font-weight: 600;
  color: ${theme.colors.primary};
  background: none;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.primaryDark};
  }
`
