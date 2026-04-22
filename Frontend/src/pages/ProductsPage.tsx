import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { fetchProduct, fetchProducts, type Product } from '../api/products'
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
  const navigate = useNavigate()
  const { productId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
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
  const [detailLoading, setDetailLoading] = useState(false)
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
    if (!productId) {
      setSelectedProduct(null)
      setDetailLoading(false)
      return
    }
    const id = Number(productId)
    if (Number.isNaN(id)) {
      navigate({ pathname: '/products', search: window.location.search }, { replace: true })
      return
    }
    let cancelled = false
    setDetailLoading(true)
    fetchProduct(id)
      .then((p) => {
        if (!cancelled) {
          setSelectedProduct(p)
          setDetailLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetailLoading(false)
          navigate({ pathname: '/products', search: window.location.search }, { replace: true })
        }
      })
    return () => {
      cancelled = true
    }
  }, [productId, navigate])

  useEffect(() => {
    const category = selectedCategory === 'All' ? undefined : selectedCategory
    const debounce = setTimeout(() => {
      setLoading(true)
      setError(null)
      fetchProducts(category, searchQuery.trim() || undefined)
        .then(setProducts)
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(debounce)
  }, [selectedCategory, searchQuery])

  const setCategory = (cat: string) => {
    setSelectedCategory(cat)
    if (cat === 'All') {
      setSearchParams({}, { replace: true })
    } else {
      setSearchParams({ category: cat }, { replace: true })
    }
  }

  const openProduct = (product: Product) => {
    navigate({
      pathname: `/products/${product.id}`,
      search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    })
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
    navigate({
      pathname: '/products',
      search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    })
  }

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
            onClick={() => setCategory(cat)}
          >
            {cat}
          </FilterButton>
        ))}
      </CategoryFilter>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites?.favoriteIds.has(product.id)}
            onProductClick={() => openProduct(product)}
            onFavoriteClick={() => {
              if (!user) {
                onLoginClick?.()
              } else {
                favorites?.toggleFavorite(product.id)
              }
            }}
            onAddClick={() => {
              if (!user) onLoginClick?.()
              else cart?.addToCart(product.id, 1, product.name)
            }}
          />
        ))}
      </ProductGrid>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!productId}
        loading={!!productId && detailLoading}
        onClose={handleCloseModal}
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
                else cart?.addToCart(selectedProduct.id, 1, selectedProduct.name)
              }
            : undefined
        }
        cartQuantity={
          selectedProduct
            ? (cart?.cart?.items.find((i) => i.productId === selectedProduct.id)?.quantity ?? 0)
            : 0
        }
        onSaveQuantity={
          selectedProduct && user
            ? async (qty) => {
                await cart?.updateQuantity(selectedProduct.id, qty)
                cart?.showToast('Cart updated!')
              }
            : undefined
        }
        user={user}
        onLoginClick={onLoginClick}
      />
    </PageContainer>
  )
}
