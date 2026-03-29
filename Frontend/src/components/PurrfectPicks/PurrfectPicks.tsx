import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchProducts, type Product } from '../../api/products'
import { ProductCard } from '../ProductCard/ProductCard'
import { useFavorites } from '../../context/FavoritesContext'
import { useCart } from '../../context/CartContext'
import { Section, SectionHeader, Title, ViewAll, Grid } from './PurrfectPicks.styles'

interface PurrfectPicksProps {
  user: { id: number } | null
  onLoginClick?: () => void
}

export function PurrfectPicks({ user, onLoginClick }: PurrfectPicksProps) {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const favorites = useFavorites()
  const cart = useCart()

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data.slice(0, 4)))
  }, [])

  return (
    <Section>
      <SectionHeader>
        <Title>Purrfect Picks</Title>
        <ViewAll as={Link} to="/products">View All →</ViewAll>
      </SectionHeader>
      <Grid>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites?.favoriteIds.has(product.id)}
            onProductClick={() => navigate(`/products/${product.id}`)}
            onFavoriteClick={() => {
              if (!user) {
                onLoginClick?.()
              } else {
                favorites?.toggleFavorite(product.id)
              }
            }}
            onAddClick={() => {
              if (!user) onLoginClick?.()
              else cart?.addToCart(product.id)
            }}
          />
        ))}
      </Grid>
    </Section>
  )
}
