import { useEffect, useState } from 'react'
import {
  Overlay,
  Modal,
  CloseButton,
  ImageWrap,
  Content,
  ProductName,
  Category,
  Price,
  Rating,
  StockStatus,
  Description,
  Actions,
  FavoriteIconBtn,
  AddButton,
  QtyRow,
  QtyBtn,
  QtyCount,
  SaveButton,
} from './ProductDetailModal.styles'
import type { Product } from '../ProductCard/ProductCard'
import { ReviewsModal } from '../ReviewsModal/ReviewsModal'

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  loading?: boolean
  onClose: () => void
  isFavorite?: boolean
  onFavoriteClick?: () => void
  onAddClick?: () => void
  cartQuantity?: number
  onSaveQuantity?: (qty: number) => Promise<void>
  user?: { id: number } | null
  onLoginClick?: () => void
}

export function ProductDetailModal({
  product,
  isOpen,
  loading = false,
  onClose,
  isFavorite,
  onFavoriteClick,
  onAddClick,
  cartQuantity = 0,
  onSaveQuantity,
  user,
  onLoginClick,
}: ProductDetailModalProps) {
  const [localQty, setLocalQty] = useState(cartQuantity || 1)
  const [saving, setSaving] = useState(false)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    setLocalQty(cartQuantity > 0 ? cartQuantity : 1)
  }, [cartQuantity, product?.id])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  if (loading || !product) {
    return (
      <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-busy="true" aria-labelledby="product-detail-title">
        <Modal onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </CloseButton>
          <Content>
            <ProductName id="product-detail-title">Loading product…</ProductName>
          </Content>
        </Modal>
      </Overlay>
    )
  }

  const inCart = cartQuantity > 0
  const inStock = product.inStock !== false

  const handleSave = async () => {
    if (!onSaveQuantity) return
    setSaving(true)
    try {
      await onSaveQuantity(localQty)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="product-detail-title">
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </CloseButton>
        <ImageWrap>
          <img src={product.imageUrl || 'https://via.placeholder.com/400'} alt={product.name} />
        </ImageWrap>
        <Content>
          <ProductName id="product-detail-title">{product.name}</ProductName>
          <Category>{product.category}</Category>
          <Rating>
            {product.rating != null && (
              <>
                <Stars count={product.rating} />
                <button
                  type="button"
                  onClick={() => setShowReviews(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    color: 'inherit',
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                  }}
                >
                  ({product.reviewCount ?? 0} reviews)
                </button>
              </>
            )}
          </Rating>
          <StockStatus $inStock={inStock}>
            {inStock ? '● In Stock' : '○ Out of Stock'}
          </StockStatus>
          <Price>${product.price.toFixed(2)}</Price>
          <Description>{product.description}</Description>
          <Actions>
            {onFavoriteClick && (
              <FavoriteIconBtn
                type="button"
                onClick={onFavoriteClick}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                $filled={isFavorite}
              >
                <HeartIcon filled={isFavorite} />
              </FavoriteIconBtn>
            )}
            {inCart && onSaveQuantity ? (
              <QtyRow>
                <QtyBtn
                  type="button"
                  onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                  disabled={localQty <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </QtyBtn>
                <QtyCount>{localQty}</QtyCount>
                <QtyBtn
                  type="button"
                  onClick={() => setLocalQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </QtyBtn>
                <SaveButton
                  type="button"
                  onClick={handleSave}
                  disabled={saving || localQty === cartQuantity}
                  style={{ marginLeft: '0.75rem' }}
                >
                  {saving ? 'Saving…' : 'Save'}
                </SaveButton>
              </QtyRow>
            ) : (
              <AddButton
                type="button"
                onClick={inStock ? onAddClick : undefined}
                disabled={!inStock}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </AddButton>
            )}
          </Actions>
        </Content>
      </Modal>
      {showReviews && product.rating != null && (
        <ReviewsModal
          productId={product.id}
          productName={product.name}
          totalCount={product.reviewCount ?? 0}
          avgRating={product.rating}
          user={user}
          onClose={() => setShowReviews(false)}
          onLoginClick={() => { setShowReviews(false); onLoginClick?.() }}
        />
      )}
    </Overlay>
  )
}

function Stars({ count }: { count: number }) {
  const full = Math.floor(count)
  const hasHalf = count % 1 >= 0.5
  return (
    <span style={{ display: 'inline-flex', color: '#F2A365' }}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {hasHalf && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
    </span>
  )
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
