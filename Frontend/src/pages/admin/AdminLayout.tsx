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
}

export type AdminOutletContext = {
  user: AuthResponse | null
  onUserChange?: (user: AuthResponse | null) => void
}

export function AdminLayout({ user, authReady, onUserChange }: AdminLayoutProps) {
  if (!authReady) {
    return (
      <AdminShell>
        <AdminSidebar>
          <AdminBrand to="/admin/orders">Admin</AdminBrand>
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
        <AdminBrand to="/admin/orders">Admin</AdminBrand>
        <SideNavLink to="/admin/orders" end>
          Orders
        </SideNavLink>
        <SideNavLink to="/admin/products">Products</SideNavLink>
        <SideNavLink to="/admin/newsletter">Newsletter</SideNavLink>
        <SideNavLink to="/admin/users">Users</SideNavLink>
      </AdminSidebar>
      <AdminMain>
        <Outlet context={{ user, onUserChange } satisfies AdminOutletContext} />
      </AdminMain>
    </AdminShell>
  )
}
