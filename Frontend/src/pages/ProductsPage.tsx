import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, type Product } from '../api/products'
import { ProductCard } from '../components/ProductCard/ProductCard'
import { ProductDetailModal } from '../components/ProductDetailModal/ProductDetailModal'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'
import {
  PageContainer,
  PageHeader,
  Title,
  Subtitle,
  SearchBar,
  SearchInput,
  CategoryFilter,
  FilterButton,
  ProductGrid,
  Loading,
  ErrorMessage,
} from './ProductsPage.styles'

const CATEGORIES = ['All', 'Food & Treats', 'Toys', 'Beds', 'Grooming']

interface ProductsPageProps {
  user: { id: number } | null
  onLoginClick?: () => void
}

export function ProductsPage({ user, onLoginClick }: ProductsPageProps) {
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const initialCategory = categoryFromUrl && CATEGORIES.includes(categoryFromUrl)
    ? categoryFromUrl
    : 'All'

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const favorites = useFavorites()
  const cart = useCart()

  useEffect(() => {
    const category = categoryFromUrl && CATEGORIES.includes(categoryFromUrl)
      ? categoryFromUrl
      : 'All'
    if (category !== selectedCategory) {
      setSelectedCategory(category)
    }
  }, [categoryFromUrl])

  useEffect(() => {
    const category = selectedCategory === 'All' ? undefined : selectedCategory
    fetchProducts(category)
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [selectedCategory])

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, searchQuery])


  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Shop All Products</Title>
          <Subtitle>Find everything your cat needs</Subtitle>
        </PageHeader>
        <Loading>Loading products...</Loading>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Shop All Products</Title>
        </PageHeader>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title>Shop All Products</Title>
        <Subtitle>Find everything your cat needs</Subtitle>
      </PageHeader>

      <SearchBar>
        <SearchInput
          type="search"
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search products"
        />
      </SearchBar>

      <CategoryFilter>
        {CATEGORIES.map((cat) => (
          <FilterButton
            key={cat}
            $active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </FilterButton>
        ))}
      </CategoryFilter>

      <ProductGrid>
        {filteredProducts.map((product) => (
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
      </ProductGrid>

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
    </PageContainer>
  )
}
