import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { GlobalStyles } from './globalStyles'
import { Header } from './components/Header/Header'
import { LandingPage } from './pages/LandingPage'
import { ProductsPage } from './pages/ProductsPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { CartPage } from './pages/CartPage'
import { BlogPage } from './pages/BlogPage'
import { FavoritesProvider } from './context/FavoritesContext'
import { CartProvider } from './context/CartContext'
import { authApi } from './api/auth'
import type { AuthResponse } from './api/auth'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Purrfect Market',
  '/products': 'Shop All | Purrfect Market',
  '/favorites': 'My Favorites | Purrfect Market',
  '/cart': 'Shopping Cart | Purrfect Market',
  '/blog': 'Blog | Purrfect Market',
}

function AppContent() {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    authApi.me().then(setUser).catch(() => setUser(null))
  }, [])

  useEffect(() => {
    const basePath = location.pathname
    document.title = PAGE_TITLES[basePath] ?? 'Purrfect Market'
  }, [location.pathname])

  return (
    <FavoritesProvider user={user}>
      <CartProvider user={user}>
      <GlobalStyles />
      <Header
          user={user}
          onLoginSuccess={(u) => setUser(u)}
          onLogout={() => setUser(null)}
          isAuthModalOpen={isAuthModalOpen}
          onAuthModalOpenChange={setIsAuthModalOpen}
        />
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                user={user}
                onLoginClick={() => setIsAuthModalOpen(true)}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductsPage
                user={user}
                onLoginClick={() => setIsAuthModalOpen(true)}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                user={user}
                onLoginClick={() => setIsAuthModalOpen(true)}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                user={user}
                onLoginClick={() => setIsAuthModalOpen(true)}
              />
            }
          />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </CartProvider>
      </FavoritesProvider>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
