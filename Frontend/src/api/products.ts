const API_BASE = '/api'

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
  inventoryQuantity?: number
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, { credentials: 'include' })
  if (res.status === 404) {
    throw new Error('Product not found')
  }
  if (!res.ok) {
    const hint =
      res.status === 403
        ? 'Access denied (403). Restart the backend so the latest security rules are loaded.'
        : 'Is the backend running on port 8080?'
    throw new Error(`Failed to load product (${res.status}). ${hint}`)
  }
  return res.json()
}

export async function fetchProducts(category?: string, search?: string): Promise<Product[]> {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (search) params.set('search', search)
  const query = params.toString()
  const url = query ? `${API_BASE}/products?${query}` : `${API_BASE}/products`
  try {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) {
      const hint =
        res.status === 403
          ? 'Access denied (403). Restart the backend so the latest security rules are loaded.'
          : 'Is the backend running on port 8080?'
      throw new Error(`Failed to fetch products (${res.status}). ${hint}`)
    }
    return res.json()
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Cannot reach backend. Start it with: cd Backend && mvn spring-boot:run')
    }
    throw err
  }
}
