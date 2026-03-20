import styled from 'styled-components'
import { theme } from '../../theme'

export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  background: ${theme.colors.white};
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`

export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const Icon = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.greyBg};
  color: ${({ $color }) => $color};
`

export const Text = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.charcoal};
`
