import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { favoritesApi, type Product } from '../api/favorites'
import { ProductCard } from '../components/ProductCard/ProductCard'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'
import {
  PageContainer,
  PageHeader,
  Title,
  Subtitle,
  ProductGrid,
  Loading,
  ErrorMessage,
  EmptyMessage,
  EmptyLink,
} from './FavoritesPage.styles'

interface FavoritesPageProps {
  user: { id: number } | null
  onLoginClick?: () => void
}

export function FavoritesPage({ user, onLoginClick }: FavoritesPageProps) {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const favorites = useFavorites()
  const cart = useCart()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      setProducts([])
      return
    }
    setLoading(true)
    setError(null)
    favoritesApi
      .getFavorites()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [user, favorites?.favoriteIds.size])

  if (!user) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>My Favorites</Title>
          <Subtitle>Log in to see your favorite products</Subtitle>
        </PageHeader>
        <EmptyMessage>
          <EmptyLink as="button" type="button" onClick={onLoginClick}>
            Log in
          </EmptyLink>
          {' '}to add products to your favorites.
        </EmptyMessage>
      </PageContainer>
    )
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>My Favorites</Title>
          <Subtitle>Products you&apos;ve saved</Subtitle>
        </PageHeader>
        <Loading>Loading favorites...</Loading>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>My Favorites</Title>
        </PageHeader>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    )
  }

  const displayedProducts = products.filter((p) => favorites?.favoriteIds.has(p.id))

  if (displayedProducts.length === 0) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>My Favorites</Title>
          <Subtitle>Products you&apos;ve saved</Subtitle>
        </PageHeader>
        <EmptyMessage>
          No favorites yet.{' '}
          <EmptyLink as={Link} to="/products">
            Browse products
          </EmptyLink>
          {' '}to add some!
        </EmptyMessage>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title>My Favorites</Title>
        <Subtitle>{displayedProducts.length} product{displayedProducts.length !== 1 ? 's' : ''} saved</Subtitle>
      </PageHeader>

      <ProductGrid>
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites?.favoriteIds.has(product.id)}
            onProductClick={() => navigate(`/products/${product.id}`)}
            onFavoriteClick={() => favorites?.toggleFavorite(product.id)}
            onAddClick={() => cart?.addToCart(product.id)}
          />
        ))}
      </ProductGrid>
    </PageContainer>
  )
}
