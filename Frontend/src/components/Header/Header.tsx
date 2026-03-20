import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StyledHeader, Nav, NavLink, Actions, Logo, LogoIcon, IconButton, Badge, UserName } from './Header.styles'
import { AuthModal } from '../AuthModal/AuthModal'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { authApi } from '../../api/auth'
import { useFavorites } from '../../context/FavoritesContext'
import type { AuthResponse } from '../../api/auth'

const navLinks = [
  { label: 'Shop All', to: '/products' },
  { label: 'Food & Treats', to: '/products?category=Food%20%26%20Treats' },
  { label: 'Toys', to: '/products?category=Toys' },
  { label: 'Beds & Furniture', to: '/products?category=Beds' },
  { label: 'Blog', to: '/blog' },
  { label: 'About Us', to: '/' },
]

interface HeaderProps {
  user: AuthResponse | null
  onLoginSuccess: (user: AuthResponse) => void
  onLogout: () => void
  isAuthModalOpen?: boolean
  onAuthModalOpenChange?: (open: boolean) => void
}

export function Header({ user, onLoginSuccess, onLogout, isAuthModalOpen = false, onAuthModalOpenChange }: HeaderProps) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const favorites = useFavorites()
  const favoriteCount = favorites?.favoriteIds.size ?? 0

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLogoutConfirmOpen(false)
    try {
      await authApi.logout()
      onLogout()
    } catch {
      onLogout()
    }
  }

  return (
    <>
      <StyledHeader>
        <Logo as={Link} to="/">
          <LogoIcon src="/favicon.png" alt="" aria-hidden />
          PurrfectMarket
        </Logo>
        <Nav>
          {navLinks.map((link) => (
            <NavLink key={link.label} as={Link} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </Nav>
        <Actions>
          <IconButton
            as={Link}
            to="/favorites"
            aria-label="Favorites"
            title="Favorites"
            $showTooltip
            data-tooltip="Favorites"
          >
            <HeartIcon />
            {favoriteCount > 0 && <Badge>{favoriteCount}</Badge>}
          </IconButton>
          {user ? (
            <>
              <UserName>Hi, {user.name}</UserName>
              <IconButton
                aria-label="Logout"
                title="Logout"
                $showTooltip
                data-tooltip="Logout"
                onClick={handleLogoutClick}
              >
                <UserIcon />
              </IconButton>
            </>
          ) : (
            <IconButton
              aria-label="Login"
              title="Login"
              $showTooltip
              data-tooltip="Login"
              onClick={() => onAuthModalOpenChange?.(true)}
            >
              <UserIcon />
            </IconButton>
          )}
          <IconButton aria-label="Cart">
            <BagIcon />
            <Badge>0</Badge>
          </IconButton>
        </Actions>
      </StyledHeader>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => onAuthModalOpenChange?.(false)}
        onSuccess={(u) => onLoginSuccess(u)}
      />
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        title="Log out?"
        message="Are you sure you want to log out?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </>
  )
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
