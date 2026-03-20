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
}

export async function fetchProducts(category?: string): Promise<Product[]> {
  const url = category
    ? `${API_BASE}/products?category=${encodeURIComponent(category)}`
    : `${API_BASE}/products`
  try {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) throw new Error(`Failed to fetch products (${res.status}). Is the backend running on port 8080?`)
    return res.json()
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Cannot reach backend. Start it with: cd Backend && mvn spring-boot:run')
    }
    throw err
  }
}
