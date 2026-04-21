import styled from 'styled-components'
import { theme } from '../../theme'

export const Card = styled.div<{ $clickable?: boolean }>`
  position: relative;
  display: block;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow 0.2s;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`

export const ProductImage = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const WishlistBtn = styled.button<{ $filled?: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.full};
  color: ${({ $filled }) => ($filled ? '#e74c3c' : theme.colors.grey)};
  box-shadow: ${theme.shadows.sm};
  transition: color 0.2s;

  &:hover {
    color: #e74c3c;
  }
`

export const Badge = styled.span<{ $variant: 'New' | 'Sale' }>`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: ${({ $variant }) =>
    $variant === 'New' ? theme.colors.teal : theme.colors.primary};
  border-radius: ${theme.radius.sm};
`

export const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem 1rem 0;
  font-size: 0.85rem;
  color: ${theme.colors.grey};
`

export const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.navy};
  padding: 0 1rem;
  margin-bottom: 0.25rem;
`

export const Category = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.grey};
  padding: 0 1rem;
  margin-bottom: 0.5rem;
`

export const Price = styled.span`
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  padding: 0 1rem 1rem;
`

export const AddBtn = styled.button<{ $disabled?: boolean }>`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  background: ${({ $disabled }) => ($disabled ? theme.colors.grey : theme.colors.primary)};
  border-radius: ${theme.radius.full};
  transition: background 0.2s;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background: ${({ $disabled }) => ($disabled ? theme.colors.grey : theme.colors.primaryDark)};
  }
`

export const LowStockLabel = styled.span`
  display: block;
  padding: 0 1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #c0392b;
`

export const OutOfStockLabel = styled.span`
  display: block;
  padding: 0 1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.grey};
`
