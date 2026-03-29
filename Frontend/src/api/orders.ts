const API_BASE = '/api'

export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: number
  status: string
  totalAmount: number
  createdAt: string
  paymentStatus: string
  shippingStatus: string
  items: OrderItem[]
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`, { credentials: 'include' })
  if (res.status === 401) {
    throw new Error('You must be signed in to view orders.')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message || 'Failed to load orders')
  }
  return res.json()
}

export async function fetchOrder(orderId: number): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, { credentials: 'include' })
  if (res.status === 401) {
    throw new Error('You must be signed in to view this order.')
  }
  if (res.status === 404) {
    throw new Error('Order not found.')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message || 'Failed to load order')
  }
  return res.json()
}
