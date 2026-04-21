import styled from 'styled-components'
import { theme } from '../../theme'

export const FooterSection = styled.footer`
  background: ${theme.colors.alwaysDark};
  color: white;
  padding: 4rem 1.5rem 2rem;
`

export const TopRow = styled.div`
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  display: flex;
  gap: 4rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 2rem;
  }
`

export const Brand = styled.div`
  max-width: 320px;
`

export const Logo = styled.a`
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
`

export const Description = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`

export const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;

  a {
    font-size: 1.25rem;
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
`

export const LinkColumns = styled.div`
  display: flex;
  gap: 4rem;
  flex: 1;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 2rem;
  }
`

export const Column = styled.div``

export const ColumnTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`

export const ColumnLink = styled.a`
  display: block;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`

export const BottomRow = styled.div`
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`

export const Copyright = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`

export const PaymentIcons = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
`
