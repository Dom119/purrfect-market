import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { GlobalStyles } from './globalStyles'
import { Header } from './components/Header/Header'
import { LandingPage } from './pages/LandingPage'
import { ProductsPage } from './pages/ProductsPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { CartPage } from './pages/CartPage'
import { BlogPage } from './pages/BlogPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { ShippingPage } from './pages/ShippingPage'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import { OrdersPage } from './pages/OrdersPage'
import { AccountPage } from './pages/AccountPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminNewsletterPage } from './pages/admin/AdminNewsletterPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminSubscribersPage } from './pages/admin/AdminSubscribersPage'
import { AdminPendingReviewsPage } from './pages/admin/AdminPendingReviewsPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { FavoritesProvider } from './context/FavoritesContext'
import { CartProvider } from './context/CartContext'
import { ColorThemeProvider } from './context/ThemeContext'
import { authApi } from './api/auth'
import type { AuthResponse } from './api/auth'
import { EmulationBar } from './components/EmulationBar/EmulationBar'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Purrfect Market',
  '/products': 'Shop All | Purrfect Market',
  '/favorites': 'My Favorites | Purrfect Market',
  '/cart': 'Shopping Cart | Purrfect Market',
  '/blog': 'Blog | Purrfect Market',
  '/about': 'About | Purrfect Market',
  '/privacy': 'Privacy Policy | Purrfect Market',
  '/terms': 'Terms of Service | Purrfect Market',
  '/shipping': 'Shipping & Returns | Purrfect Market',
  '/contact': 'Contact | Purrfect Market',
  '/faq': 'FAQ | Purrfect Market',
  '/orders': 'My Orders | Purrfect Market',
  '/account': 'Account | Purrfect Market',
  '/admin/dashboard': 'Admin — Dashboard | Purrfect Market',
  '/admin/orders': 'Admin — Orders | Purrfect Market',
  '/admin/products': 'Admin — Products | Purrfect Market',
  '/admin/newsletter': 'Admin — Newsletter | Purrfect Market',
  '/admin/subscribers': 'Admin — Subscribers | Purrfect Market',
  '/admin/reviews': 'Admin — Pending Reviews | Purrfect Market',
  '/admin/users': 'Admin — Users | Purrfect Market',
}

function resolveTitle(pathname: string): string {
  if (pathname.startsWith('/products/') && pathname !== '/products') {
    return 'Product | Purrfect Market'
  }
  return (
    PAGE_TITLES[pathname] ??
    (pathname.startsWith('/admin') ? 'Admin | Purrfect Market' : 'Purrfect Market')
  )
}

function AppContent() {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [originalAdmin, setOriginalAdmin] = useState<AuthResponse | null>(null)
  const location = useLocation()

  useEffect(() => {
    Promise.all([
      authApi.me().catch(() => null),
      authApi.getEmulation().catch(() => null),
    ]).then(([me, emulation]) => {
      setUser(me)
      setOriginalAdmin(emulation?.active ? emulation.originalAdmin ?? null : null)
    }).finally(() => setAuthReady(true))
  }, [])

  useEffect(() => {
    document.title = resolveTitle(location.pathname)
  }, [location.pathname])

  const openAuth = () => setIsAuthModalOpen(true)

  const handleStartEmulation = (targetUser: AuthResponse, admin: AuthResponse) => {
    setUser(targetUser)
    setOriginalAdmin(admin)
  }

  const handleStopEmulation = (restoredAdmin: AuthResponse) => {
    setUser(restoredAdmin)
    setOriginalAdmin(null)
  }

  return (
    <FavoritesProvider user={user}>
      <CartProvider user={user}>
        <GlobalStyles />
        {originalAdmin && user && (
          <EmulationBar
            emulatedUser={user}
            originalAdmin={originalAdmin}
            onStop={handleStopEmulation}
          />
        )}
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
            element={<LandingPage user={user} onLoginClick={openAuth} />}
          />
          <Route
            path="/products/:productId"
            element={<ProductsPage user={user} onLoginClick={openAuth} />}
          />
          <Route
            path="/products"
            element={<ProductsPage user={user} onLoginClick={openAuth} />}
          />
          <Route
            path="/favorites"
            element={<FavoritesPage user={user} onLoginClick={openAuth} />}
          />
          <Route
            path="/cart"
            element={<CartPage user={user} onLoginClick={openAuth} />}
          />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route
            path="/orders"
            element={<OrdersPage user={user} onLoginClick={openAuth} />}
          />
          <Route
            path="/account"
            element={
              <AccountPage user={user} onUserChange={setUser} onLoginClick={openAuth} />
            }
          />
          <Route
            path="/admin"
            element={<AdminLayout user={user} authReady={authReady} onUserChange={setUser} onStartEmulation={handleStartEmulation} />}
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="subscribers" element={<AdminSubscribersPage />} />
            <Route path="reviews" element={<AdminPendingReviewsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </CartProvider>
    </FavoritesProvider>
  )
}

export function App() {
  return (
    <ColorThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ColorThemeProvider>
  )
}
