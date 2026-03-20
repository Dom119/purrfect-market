import styled from 'styled-components'
import { theme } from '../../theme'

export const Section = styled.section`
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: ${theme.spacing.section} 1.5rem;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.navy};
`

export const ViewAll = styled.a`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.primaryDark};
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`

export const ProductCard = styled.a`
  position: relative;
  display: block;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow 0.2s;

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

export const WishlistBtn = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: ${theme.radius.full};
  color: ${theme.colors.grey};
  box-shadow: ${theme.shadows.sm};
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: #e74c3c;
    background: white;
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

export const AddBtn = styled.button`
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
  background: ${theme.colors.primary};
  border-radius: ${theme.radius.full};
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.primaryDark};
  }
`
