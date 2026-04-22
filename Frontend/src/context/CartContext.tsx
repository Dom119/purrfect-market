import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { cartApi, type Cart } from '../api/cart'
import type { AuthResponse } from '../api/auth'
import { CartToast } from '../components/CartToast/CartToast'

interface CartContextValue {
  cart: Cart | null
  itemCount: number
  addToCart: (productId: number, quantity?: number, productName?: string) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  refreshCart: () => Promise<void>
  showToast: (message: string) => void
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
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [toastLeaving, setToastLeaving] = useState(false)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    setToastLeaving(false)
    setToastMsg(message)
  }, [])

  const handleDismiss = useCallback(() => {
    setToastLeaving(true)
    dismissTimer.current = setTimeout(() => setToastMsg(null), 300)
  }, [])

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
    async (productId: number, quantity = 1, productName?: string) => {
      if (!user) return
      try {
        await cartApi.addItem(productId, quantity)
        await refreshCart()
        showToast(productName ? `${productName} added to cart!` : 'Added to cart!')
      } catch {
        // ignore
      }
    },
    [user, refreshCart, showToast]
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
        showToast,
      }}
    >
      {children}
      <CartToast message={toastMsg} leaving={toastLeaving} onDismiss={handleDismiss} />
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
