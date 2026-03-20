import styled from 'styled-components'
import { theme } from '../../theme'

export const Section = styled.section`
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: ${theme.spacing.section} 1.5rem;
  background: ${theme.colors.offWhite};
`

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.5rem;
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${theme.colors.grey};
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.article`
  padding: 2rem;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
`

export const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
`

export const Quote = styled.blockquote`
  font-size: 1rem;
  font-style: italic;
  color: ${theme.colors.charcoal};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`

export const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`

export const Name = styled.span`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.navy};
`

export const Verified = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.grey};
`
