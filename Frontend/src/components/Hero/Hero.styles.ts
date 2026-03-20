import styled from 'styled-components'
import { theme } from '../../theme'

export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: 4rem 1.5rem 5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 2rem 1.5rem 3rem;
    gap: 2rem;
  }
`

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.primary};
  width: fit-content;

  svg {
    flex-shrink: 0;
  }
`

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  color: ${theme.colors.navy};

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.grey};
  max-width: 480px;
`

export const CtaGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`

export const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
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

export const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.charcoal};
  background: transparent;
  border: 2px solid ${theme.colors.charcoal};
  border-radius: ${theme.radius.md};
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${theme.colors.charcoal};
    color: white;
  }
`

export const SocialProof = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${theme.colors.grey};
`

export const Avatars = styled.div`
  display: flex;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid white;
    margin-left: -10px;
    object-fit: cover;

    &:first-child {
      margin-left: 0;
    }
  }
`

export const HeroImage = styled.div`
  position: relative;

  img {
    width: 100%;
    height: auto;
    border-radius: ${theme.radius.xl};
    object-fit: cover;
    box-shadow: ${theme.shadows.lg};
  }
`

export const VetBadge = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: ${theme.colors.teal};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadows.md};

  svg {
    flex-shrink: 0;
  }
`
