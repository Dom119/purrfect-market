import { Outlet, Navigate } from 'react-router-dom'
import type { AuthResponse } from '../../api/auth'
import { isMainAdmin } from '../../api/auth'
import {
  AdminShell,
  AdminSidebar,
  AdminBrand,
  SideNavLink,
  AdminMain,
} from './AdminPages.styles'

interface AdminLayoutProps {
  user: AuthResponse | null
  /** False until `/auth/me` finishes so refresh on `/admin/*` does not redirect to home. */
  authReady: boolean
  onUserChange?: (user: AuthResponse | null) => void
  onStartEmulation?: (targetUser: AuthResponse, admin: AuthResponse) => void
}

export type AdminOutletContext = {
  user: AuthResponse | null
  onUserChange?: (user: AuthResponse | null) => void
  onStartEmulation?: (targetUser: AuthResponse, admin: AuthResponse) => void
}

export function AdminLayout({ user, authReady, onUserChange, onStartEmulation }: AdminLayoutProps) {
  if (!authReady) {
    return (
      <AdminShell>
        <AdminSidebar>
          <AdminBrand to="/admin/dashboard">Admin</AdminBrand>
        </AdminSidebar>
        <AdminMain>
          <p style={{ color: '#6b7280' }}>Loading…</p>
        </AdminMain>
      </AdminShell>
    )
  }
  if (!user) {
    return <Navigate to="/" replace />
  }
  if (!isMainAdmin(user)) {
    return <Navigate to="/" replace />
  }

  return (
    <AdminShell>
      <AdminSidebar>
        <AdminBrand to="/admin/dashboard">Admin</AdminBrand>
        <SideNavLink to="/admin/dashboard">Dashboard</SideNavLink>
        <SideNavLink to="/admin/orders">Orders</SideNavLink>
        <SideNavLink to="/admin/products">Products</SideNavLink>
        <SideNavLink to="/admin/newsletter">Newsletter</SideNavLink>
        <SideNavLink to="/admin/subscribers">Subscribers</SideNavLink>
        <SideNavLink to="/admin/reviews">Pending Reviews</SideNavLink>
        <SideNavLink to="/admin/users">Users</SideNavLink>
      </AdminSidebar>
      <AdminMain>
        <Outlet context={{ user, onUserChange, onStartEmulation } satisfies AdminOutletContext} />
      </AdminMain>
    </AdminShell>
  )
}
