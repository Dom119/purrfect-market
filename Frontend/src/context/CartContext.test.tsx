import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from './CartContext'
import { cartApi, type Cart } from '../api/cart'
import type { AuthResponse } from '../api/auth'

vi.mock('../api/cart', () => ({
  cartApi: {
    getCart: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
  },
}))

const user: AuthResponse = { id: 1, email: 'a@b.com', name: 'A' }

const emptyCart: Cart = { items: [], subtotal: 0, itemCount: 0 }

function TestConsumer() {
  const cart = useCart()
  return (
    <div>
      <span data-testid="count">{cart?.itemCount}</span>
      <button onClick={() => cart?.addToCart(1, 1, 'Salmon Pate')}>add</button>
      <button onClick={() => cart?.removeFromCart(1)}>remove</button>
    </div>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    vi.mocked(cartApi.getCart).mockReset().mockResolvedValue(emptyCart)
    vi.mocked(cartApi.addItem).mockReset()
    vi.mocked(cartApi.removeItem).mockReset()
  })

  it('does not fetch the cart when there is no logged-in user', async () => {
    render(
      <CartProvider user={null}>
        <TestConsumer />
      </CartProvider>
    )
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('0'))
    expect(cartApi.getCart).not.toHaveBeenCalled()
  })

  it('loads the cart on mount when a user is present', async () => {
    vi.mocked(cartApi.getCart).mockResolvedValue({ ...emptyCart, itemCount: 2 })
    render(
      <CartProvider user={user}>
        <TestConsumer />
      </CartProvider>
    )
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('2'))
  })

  it('addToCart is a no-op when logged out, and calls the API when logged in', async () => {
    render(
      <CartProvider user={null}>
        <TestConsumer />
      </CartProvider>
    )
    await userEvent.click(screen.getByText('add'))
    expect(cartApi.addItem).not.toHaveBeenCalled()
  })

  it('addToCart calls the API and refreshes the cart, and shows a toast', async () => {
    vi.mocked(cartApi.addItem).mockResolvedValue({
      productId: 1,
      productName: 'Salmon Pate',
      imageUrl: null,
      price: 5,
      quantity: 1,
      subtotal: 5,
    })
    vi.mocked(cartApi.getCart).mockResolvedValue({ ...emptyCart, itemCount: 1 })

    render(
      <CartProvider user={user}>
        <TestConsumer />
      </CartProvider>
    )
    await waitFor(() => expect(cartApi.getCart).toHaveBeenCalledTimes(1))

    await act(() => userEvent.click(screen.getByText('add')))

    expect(cartApi.addItem).toHaveBeenCalledWith(1, 1)
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'))
    expect(screen.getByText('Salmon Pate added to cart!')).toBeInTheDocument()
  })

  it('removeFromCart calls removeItem and refreshes the cart', async () => {
    vi.mocked(cartApi.removeItem).mockResolvedValue(undefined)
    vi.mocked(cartApi.getCart)
      .mockResolvedValueOnce({ ...emptyCart, itemCount: 1 })
      .mockResolvedValueOnce({ ...emptyCart, itemCount: 0 })

    render(
      <CartProvider user={user}>
        <TestConsumer />
      </CartProvider>
    )
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'))

    await act(() => userEvent.click(screen.getByText('remove')))

    expect(cartApi.removeItem).toHaveBeenCalledWith(1)
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('0'))
  })
})
