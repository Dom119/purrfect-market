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
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadows.lg};
`

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.75rem;
`

export const Message = styled.p`
  font-size: 1rem;
  color: ${theme.colors.grey};
  margin-bottom: 1.5rem;
  line-height: 1.5;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.charcoal};
  background: transparent;
  border: 2px solid ${theme.colors.charcoal};
  border-radius: ${theme.radius.md};
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.greyBg};
  }
`

export const ConfirmButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: ${theme.colors.primary};
  border-radius: ${theme.radius.md};
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.primaryDark};
  }
`
