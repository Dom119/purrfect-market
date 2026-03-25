import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { GlobalStyles } from './globalStyles'
import { Header } from './components/Header/Header'
import { LandingPage } from './pages/LandingPage'
import { ProductsPage } from './pages/ProductsPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { CartPage } from './pages/CartPage'
import { BlogPage } from './pages/BlogPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminNewsletterPage } from './pages/admin/AdminNewsletterPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
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
  '/admin/orders': 'Admin — Orders | Purrfect Market',
  '/admin/products': 'Admin — Products | Purrfect Market',
  '/admin/newsletter': 'Admin — Newsletter | Purrfect Market',
  '/admin/users': 'Admin — Users | Purrfect Market',
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
    document.title =
      PAGE_TITLES[basePath] ??
      (basePath.startsWith('/admin') ? 'Admin | Purrfect Market' : 'Purrfect Market')
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
          <Route path="/admin" element={<AdminLayout user={user} onUserChange={setUser} />}>
            <Route index element={<Navigate to="/admin/orders" replace />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
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
