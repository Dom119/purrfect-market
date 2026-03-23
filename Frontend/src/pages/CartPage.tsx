import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { cartApi, ordersApi } from '../api/cart'
import type { Order } from '../api/cart'
import {
  PageContainer,
  PageHeader,
  Title,
  Subtitle,
  CartLayout,
  CartItems,
  CartItemCard,
  CartItemImage,
  CartItemDetails,
  CartItemName,
  CartItemPrice,
  CartItemActions,
  QtyButton,
  QtyDisplay,
  RemoveBtn,
  CartItemSubtotal,
  SummaryCard,
  SummaryTitle,
  SummaryRow,
  SummaryTotal,
  CheckoutBtn,
  EmptyMessage,
  EmptyLink,
  Loading,
  ErrorMessage,
  OrdersSection,
  OrderCard,
  OrderHeader,
  OrderId,
  OrderDate,
  OrderTotal,
  OrderItemsList,
  OrderItemRow,
  SuccessMessage,
  SuccessTitle,
  SuccessText,
} from './CartPage.styles'

interface CartPageProps {
  user: { id: number } | null
  onLoginClick?: () => void
}

export function CartPage({ user, onLoginClick }: CartPageProps) {
  const cart = useCart()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [lastOrderId, setLastOrderId] = useState<number | null>(null)

  const loadOrders = useCallback(async () => {
    if (!user) return
    setLoadingOrders(true)
    try {
      const data = await ordersApi.getOrders()
      setOrders(data)
    } catch {
      setOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }, [user])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleCheckout = async () => {
    if (!user || !cart?.cart) return
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const orderId = await cartApi.checkout()
      setLastOrderId(orderId)
      await cart.refreshCart()
      await loadOrders()
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (!user) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Shopping Cart</Title>
          <Subtitle>Log in to view your cart and orders</Subtitle>
        </PageHeader>
        <EmptyMessage>
          <EmptyLink as="button" type="button" onClick={onLoginClick}>
            Log in
          </EmptyLink>
          {' '}to add items and proceed to checkout.
        </EmptyMessage>
      </PageContainer>
    )
  }

  const isLoading = cart?.cart === undefined && !checkoutError
  const items = cart?.cart?.items ?? []

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Shopping Cart</Title>
          <Subtitle>Your items</Subtitle>
        </PageHeader>
        <Loading>Loading cart...</Loading>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title>Shopping Cart</Title>
        <Subtitle>
          {items.length > 0
            ? `${cart?.cart?.itemCount ?? 0} item${(cart?.cart?.itemCount ?? 0) !== 1 ? 's' : ''} in your cart`
            : 'Your cart is empty'}
        </Subtitle>
      </PageHeader>

      {lastOrderId && (
        <SuccessMessage>
          <SuccessTitle>Order placed successfully!</SuccessTitle>
          <SuccessText>Thank you for your purchase. Your order #{lastOrderId} has been confirmed.</SuccessText>
        </SuccessMessage>
      )}

      {checkoutError && <ErrorMessage>{checkoutError}</ErrorMessage>}

      {items.length === 0 && !lastOrderId ? (
        <EmptyMessage>
          Your cart is empty.{' '}
          <EmptyLink as={Link} to="/products">
            Browse products
          </EmptyLink>
          {' '}to add items.
        </EmptyMessage>
      ) : (
        items.length > 0 && (
          <CartLayout>
            <CartItems>
              {items.map((item) => (
                <CartItemCard key={item.productId}>
                  <CartItemImage>
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/100'}
                      alt={item.productName}
                    />
                  </CartItemImage>
                  <CartItemDetails>
                    <CartItemName>{item.productName}</CartItemName>
                    <CartItemPrice>${item.price.toFixed(2)} each</CartItemPrice>
                    <CartItemActions>
                      <QtyButton
                        type="button"
                        onClick={() => cart?.updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </QtyButton>
                      <QtyDisplay>{item.quantity}</QtyDisplay>
                      <QtyButton
                        type="button"
                        onClick={() => cart?.updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </QtyButton>
                      <RemoveBtn
                        type="button"
                        onClick={() => cart?.removeFromCart(item.productId)}
                      >
                        Remove
                      </RemoveBtn>
                    </CartItemActions>
                  </CartItemDetails>
                  <CartItemSubtotal>${item.subtotal.toFixed(2)}</CartItemSubtotal>
                </CartItemCard>
              ))}
            </CartItems>

            <SummaryCard>
              <SummaryTitle>Order summary</SummaryTitle>
              <SummaryRow>
                <span>Subtotal ({cart?.cart?.itemCount ?? 0} items)</span>
                <span>${(cart?.cart?.subtotal ?? 0).toFixed(2)}</span>
              </SummaryRow>
              <SummaryTotal>
                <span>Total</span>
                <span>${(cart?.cart?.subtotal ?? 0).toFixed(2)}</span>
              </SummaryTotal>
              <CheckoutBtn
                type="button"
                onClick={handleCheckout}
                disabled={checkoutLoading || items.length === 0}
              >
                {checkoutLoading ? 'Processing...' : 'Proceed to payment'}
              </CheckoutBtn>
            </SummaryCard>
          </CartLayout>
        )
      )}

      <OrdersSection>
        <Title style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>My orders</Title>
        {loadingOrders ? (
          <Loading>Loading orders...</Loading>
        ) : orders.length === 0 ? (
          <EmptyMessage>No orders yet. Place an order to see it here.</EmptyMessage>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderId>Order #{order.id}</OrderId>
                <OrderDate>{new Date(order.createdAt).toLocaleDateString()}</OrderDate>
                <OrderTotal>${order.totalAmount.toFixed(2)}</OrderTotal>
              </OrderHeader>
              <OrderItemsList>
                {order.items.map((oi, i) => (
                  <OrderItemRow key={i}>
                    <span>
                      {oi.productName} × {oi.quantity}
                    </span>
                    <span>${oi.subtotal.toFixed(2)}</span>
                  </OrderItemRow>
                ))}
              </OrderItemsList>
            </OrderCard>
          ))
        )}
      </OrdersSection>
    </PageContainer>
  )
}
