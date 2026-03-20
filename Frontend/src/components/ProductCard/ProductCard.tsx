import {
  Card,
  ProductImage,
  WishlistBtn,
  Badge,
  Rating,
  ProductName,
  Category,
  Price,
  AddBtn,
} from './ProductCard.styles'

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

interface ProductCardProps {
  product: Product
  isFavorite?: boolean
  onFavoriteClick?: (e: React.MouseEvent) => void
  onAddClick?: (e: React.MouseEvent) => void
  onProductClick?: () => void
}

export function ProductCard({ product, isFavorite, onFavoriteClick, onAddClick, onProductClick }: ProductCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteClick?.(e)
  }
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddClick?.(e)
  }
  const handleCardClick = () => {
    onProductClick?.()
  }
  return (
    <Card
      $clickable={!!onProductClick}
      role={onProductClick ? 'button' : undefined}
      aria-label={onProductClick ? `View details for ${product.name}` : undefined}
      tabIndex={onProductClick ? 0 : undefined}
      onClick={onProductClick ? handleCardClick : undefined}
      onKeyDown={
        onProductClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardClick()
              }
            }
          : undefined
      }
    >
      <ProductImage>
        <img src={product.imageUrl || 'https://via.placeholder.com/400'} alt={product.name} />
        <WishlistBtn
          type="button"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleFavoriteClick}
          $filled={isFavorite}
        >
          <HeartIcon filled={isFavorite} />
        </WishlistBtn>
        {product.badge && (
          <Badge $variant={product.badge as 'New' | 'Sale'}>{product.badge}</Badge>
        )}
      </ProductImage>
      <Rating>
        {product.rating != null && (
          <>
            <Stars count={product.rating} />
            <span>({product.reviewCount ?? 0})</span>
          </>
        )}
      </Rating>
      <ProductName>{product.name}</ProductName>
      <Category>{product.category}</Category>
      <Price>${product.price.toFixed(2)}</Price>
      <AddBtn type="button" onClick={handleAddClick}>
        +
      </AddBtn>
    </Card>
  )
}

function Stars({ count }: { count: number }) {
  const full = Math.floor(count)
  const hasHalf = count % 1 >= 0.5
  return (
    <span style={{ display: 'inline-flex', color: '#F2A365' }}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {hasHalf && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
    </span>
  )
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
