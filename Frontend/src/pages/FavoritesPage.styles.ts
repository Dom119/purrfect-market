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
`

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.grey};
`

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
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

export const EmptyMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.grey};
  padding: 3rem;
`

export const EmptyLink = styled.a`
  font-weight: 600;
  color: ${theme.colors.primary};
  text-decoration: underline;
  text-underline-offset: 2px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;

  &:hover {
    color: ${theme.colors.primaryDark};
  }
`
