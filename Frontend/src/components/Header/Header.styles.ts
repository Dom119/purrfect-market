import styled from 'styled-components'
import { theme } from '../../theme'

export const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.navy};
`

export const LogoIcon = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;
`

export const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  gap: 2rem;

  @media (max-width: 900px) {
    flex-wrap: wrap;

    ${Nav} {
      order: 3;
      width: 100%;
      justify-content: flex-start;
      gap: 1rem;
    }
  }
`

export const NavLink = styled.a`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${theme.colors.charcoal};
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.primary};
  }
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const UserName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${theme.colors.charcoal};
  margin-right: 0.25rem;
  text-decoration: none;

  &:hover {
    color: ${theme.colors.primary};
  }

  @media (max-width: 600px) {
    display: none;
  }
`

export const IconButton = styled.button<{ $showTooltip?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.radius.full};
  color: ${theme.colors.charcoal};
  background: transparent;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${theme.colors.greyBg};
    color: ${theme.colors.primary};
  }

  ${({ $showTooltip }) =>
    $showTooltip &&
    `
    &::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.35rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: white;
      background: #2d2d44;
      border-radius: ${theme.radius.sm};
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }
    &:hover::after {
      opacity: 1;
    }
  `}
`

export const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  background: ${theme.colors.primary};
  border-radius: ${theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
`
