import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, type Product } from '../../api/products'
import { ProductCard } from '../ProductCard/ProductCard'
import { ProductDetailModal } from '../ProductDetailModal/ProductDetailModal'
import { useFavorites } from '../../context/FavoritesContext'
import { useCart } from '../../context/CartContext'
import { Section, SectionHeader, Title, ViewAll, Grid } from './PurrfectPicks.styles'

interface PurrfectPicksProps {
  user: { id: number } | null
  onLoginClick?: () => void
}

export function PurrfectPicks({ user, onLoginClick }: PurrfectPicksProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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
            onProductClick={() => setSelectedProduct(product)}
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

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites?.favoriteIds.has(selectedProduct.id) : false}
        onFavoriteClick={
          selectedProduct
            ? () => {
                if (!user) onLoginClick?.()
                else favorites?.toggleFavorite(selectedProduct.id)
              }
            : undefined
        }
        onAddClick={
          selectedProduct
            ? () => {
                if (!user) onLoginClick?.()
                else cart?.addToCart(selectedProduct.id)
              }
            : undefined
        }
      />
    </Section>
  )
}
