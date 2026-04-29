import styled from 'styled-components'
import { theme } from '../theme'

export const PageContainer = styled.main`
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.grey};
`

export const SearchBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  max-width: 400px;
`

export const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: ${theme.fonts.body};
  color: ${theme.colors.navy};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.greyLight};
  border-radius: ${theme.radius.md};
  transition: border-color 0.2s;

  &::placeholder {
    color: ${theme.colors.grey};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`

export const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`

export const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ $active }) => ($active ? 'white' : theme.colors.charcoal)};
  background: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.greyBg)};
  border: none;
  border-radius: ${theme.radius.md};
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? theme.colors.primaryDark : theme.colors.greyLight + '40')};
  }
`

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
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

export const Loading = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.grey};
  padding: 3rem;
`

export const ErrorMessage = styled.p`
  padding: 1rem;
  font-size: 1rem;
  color: #b91c1c;
  background: #fef2f2;
  border-radius: ${theme.radius.md};
`
