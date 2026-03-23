import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { cartApi, type Cart } from '../api/cart'
import type { AuthResponse } from '../api/auth'

interface CartContextValue {
  cart: Cart | null
  itemCount: number
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({
  children,
  user,
}: {
  children: React.ReactNode
  user: AuthResponse | null
}) {
  const [cart, setCart] = useState<Cart | null>(null)

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null)
      return
    }
    try {
      const data = await cartApi.getCart()
      setCart(data)
    } catch {
      setCart(null)
    }
  }, [user])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = useCallback(
    async (productId: number, quantity = 1) => {
      if (!user) return
      try {
        await cartApi.addItem(productId, quantity)
        await refreshCart()
      } catch {
        // ignore
      }
    },
    [user, refreshCart]
  )

  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!user) return
      try {
        if (quantity <= 0) {
          await cartApi.removeItem(productId)
        } else {
          await cartApi.updateItem(productId, quantity)
        }
        await refreshCart()
      } catch {
        // ignore
      }
    },
    [user, refreshCart]
  )

  const removeFromCart = useCallback(
    async (productId: number) => {
      if (!user) return
      try {
        await cartApi.removeItem(productId)
        await refreshCart()
      } catch {
        // ignore
      }
    },
    [user, refreshCart]
  )

  const itemCount = cart?.itemCount ?? 0

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
