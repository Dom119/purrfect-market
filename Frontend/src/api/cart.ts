const API_BASE = '/api'

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message || 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export interface CartItem {
  productId: number
  productName: string
  imageUrl: string | null
  price: number
  quantity: number
  subtotal: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
}

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
  items: OrderItem[]
}

export const cartApi = {
  getCart: () => fetchApi<Cart>('/cart'),
  addItem: (productId: number, quantity = 1) =>
    fetchApi<CartItem>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  updateItem: (productId: number, quantity: number) =>
    fetchApi<CartItem | undefined>(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeItem: (productId: number) =>
    fetchApi<void>(`/cart/items/${productId}`, { method: 'DELETE' }),
  checkout: () => fetchApi<number>('/cart/checkout', { method: 'POST' }),
  createCheckoutSession: () =>
    fetchApi<{ url: string }>('/cart/create-checkout-session', { method: 'POST' }),
  completeCheckout: (sessionId: string) =>
    fetchApi<number>('/cart/complete-checkout', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    }),
}

export const ordersApi = {
  getOrders: () => fetchApi<Order[]>('/orders'),
  getOrder: (orderId: number) => fetchApi<Order>(`/orders/${orderId}`),
}
