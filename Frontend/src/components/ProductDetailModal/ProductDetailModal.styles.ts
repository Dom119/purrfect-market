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
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadows.lg};
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: ${theme.radius.full};
  color: ${theme.colors.charcoal};
  cursor: pointer;
  z-index: 1;
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.greyBg};
  }
`

export const ImageWrap = styled.div`
  flex-shrink: 0;
  aspect-ratio: 1;
  overflow: hidden;

  @media (min-width: 640px) {
    width: 340px;
    min-height: 340px;
    aspect-ratio: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const Content = styled.div`
  padding: 1.5rem 1.75rem;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

export const ProductName = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin: 0 0 0.5rem;
`

export const Category = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.grey};
  margin: 0 0 0.5rem;
`

export const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: ${theme.colors.grey};
  margin-bottom: 0.75rem;
`

export const StockStatus = styled.span<{ $inStock: boolean }>`
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $inStock }) => ($inStock ? theme.colors.green : theme.colors.grey)};
  margin-bottom: 0.5rem;
`

export const Price = styled.span`
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 1rem;
`

export const Description = styled.p`
  font-size: 1rem;
  color: ${theme.colors.charcoal};
  line-height: 1.6;
  margin: 0 0 1.5rem;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 1rem;
`

export const FavoriteIconBtn = styled.button<{ $filled?: boolean }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.greyBg};
  border: none;
  border-radius: ${theme.radius.full};
  color: ${({ $filled }) => ($filled ? '#e74c3c' : theme.colors.grey)};
  cursor: pointer;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: #e74c3c;
    background: ${theme.colors.greyLight}40;
  }
`

export const AddButton = styled.button`
  flex: 1;
  min-width: 180px;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.radius.md};
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    background: ${theme.colors.grey};
    cursor: not-allowed;
    opacity: 0.7;
  }
`
