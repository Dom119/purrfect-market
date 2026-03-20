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
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.a<{ $iconBg: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }

  .icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    background: ${({ $iconBg }) => $iconBg}20;
    border-radius: ${theme.radius.full};
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${theme.colors.navy};
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.9rem;
    color: ${theme.colors.grey};
  }
`
