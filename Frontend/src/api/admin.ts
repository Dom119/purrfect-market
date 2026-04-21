const API_BASE = '/api'

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
    },
  })
  if (res.status === 403) {
    throw new Error('Access denied')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message || 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export interface AdminOrderItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface AdminOrder {
  id: number
  userId: number
  customerEmail: string
  customerName: string
  orderStatus: string
  paymentStatus: string
  shippingStatus: string
  totalAmount: number
  createdAt: string
  items: AdminOrderItem[]
}

export interface AdminProduct {
  id: number
  name: string
  description: string | null
  price: number
  category: string
  imageUrl: string | null
  hasStoredImage: boolean
  rating: number | null
  reviewCount: number | null
  badge: string | null
  inStock: boolean
  inventoryQuantity: number
}

export interface AdminSubscriber {
  id: number
  email: string
  subscribedAt: string
}

export interface AdminUser {
  id: number
  email: string
  name: string
  userGroup: string
}

export interface AdminStatsTopProduct {
  productName: string
  unitsSold: number
}

export interface AdminStats {
  totalRevenue: number
  totalOrders: number
  newUsersThisMonth: number
  topProducts: AdminStatsTopProduct[]
}

export const adminApi = {
  getStats: () => adminFetch<AdminStats>('/admin/stats'),

  getOrders: () => adminFetch<AdminOrder[]>('/admin/orders'),

  exportOrdersCsv: async () => {
    const res = await fetch('/api/admin/orders/export.csv', { credentials: 'include' })
    if (!res.ok) throw new Error('Export failed')
    return res.blob()
  },

  getProducts: () => adminFetch<AdminProduct[]>('/admin/products'),

  updateInventory: (productId: number, inventoryQuantity: number) =>
    adminFetch<AdminProduct>(`/admin/products/${productId}/inventory`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventoryQuantity }),
    }),

  createProduct: (form: FormData) =>
    adminFetch<AdminProduct>('/admin/products', {
      method: 'POST',
      body: form,
    }),

  getSubscribers: () => adminFetch<AdminSubscriber[]>('/admin/subscribers'),

  getUsers: () => adminFetch<AdminUser[]>('/admin/users'),

  updateUserGroup: (userId: number, userGroup: 'USER' | 'MAIN_ADMIN') =>
    adminFetch<AdminUser>(`/admin/users/${userId}/group`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userGroup }),
    }),

  broadcastNewsletter: (subject: string, htmlBody: string, recipientEmails: string[]) =>
    adminFetch<{ sent: number; failed: number; message: string }>('/admin/newsletter/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, htmlBody, recipientEmails }),
    }),
}
