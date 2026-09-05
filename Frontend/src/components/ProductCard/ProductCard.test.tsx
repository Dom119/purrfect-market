import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard, type Product } from './ProductCard'

const baseProduct: Product = {
  id: 1,
  name: 'Salmon Pate',
  description: 'A tasty treat',
  price: 12.5,
  category: 'Food & Treats',
  imageUrl: null,
  rating: 4,
  reviewCount: 10,
  badge: null,
}

describe('ProductCard', () => {
  it('renders name, category, and formatted price', () => {
    render(<ProductCard product={baseProduct} />)
    expect(screen.getByText('Salmon Pate')).toBeInTheDocument()
    expect(screen.getByText('Food & Treats')).toBeInTheDocument()
    expect(screen.getByText('$12.50')).toBeInTheDocument()
  })

  it('shows an out of stock label and disables the add button when inStock is false', () => {
    render(<ProductCard product={{ ...baseProduct, inStock: false }} />)
    expect(screen.getByText('Out of stock')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows a low stock label when inventory is low but positive', () => {
    render(<ProductCard product={{ ...baseProduct, inStock: true, inventoryQuantity: 3 }} />)
    expect(screen.getByText('Only 3 left!')).toBeInTheDocument()
  })

  it('does not show stock labels when inventory is healthy', () => {
    render(<ProductCard product={{ ...baseProduct, inStock: true, inventoryQuantity: 50 }} />)
    expect(screen.queryByText(/left!/)).not.toBeInTheDocument()
    expect(screen.queryByText('Out of stock')).not.toBeInTheDocument()
  })

  it('calls onAddClick when the add button is clicked', async () => {
    const onAddClick = vi.fn()
    render(<ProductCard product={baseProduct} onAddClick={onAddClick} />)
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    expect(onAddClick).toHaveBeenCalledTimes(1)
  })

  it('calls onFavoriteClick and reflects favorite state in the label', async () => {
    const onFavoriteClick = vi.fn()
    render(<ProductCard product={baseProduct} isFavorite onFavoriteClick={onFavoriteClick} />)
    const favoriteBtn = screen.getByRole('button', { name: 'Remove from favorites' })
    await userEvent.click(favoriteBtn)
    expect(onFavoriteClick).toHaveBeenCalledTimes(1)
  })

  it('makes the whole card an accessible button when onProductClick is provided', () => {
    render(<ProductCard product={baseProduct} onProductClick={() => {}} />)
    expect(screen.getByRole('button', { name: `View details for ${baseProduct.name}` })).toBeInTheDocument()
  })
})
