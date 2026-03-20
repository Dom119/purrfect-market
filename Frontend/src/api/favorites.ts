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

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  imageUrl: string | null
  rating: number | null
  reviewCount: number | null
  badge: string | null
  inStock?: boolean
}

export const favoritesApi = {
  getFavorites: () => fetchApi<Product[]>('/favorites'),
  getFavoriteIds: () => fetchApi<number[]>('/favorites/ids'),
  addFavorite: (productId: number) =>
    fetchApi<Product>(`/favorites/${productId}`, { method: 'POST' }),
  removeFavorite: (productId: number) =>
    fetchApi<void>(`/favorites/${productId}`, { method: 'DELETE' }),
}
