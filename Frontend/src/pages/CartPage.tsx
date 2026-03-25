import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { cartApi, ordersApi } from '../api/cart'
import type { Order, CheckoutCompletion } from '../api/cart'
import { formatPaymentStatus, formatShippingStatus } from './orderStatusLabels'
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
  SuccessDetailGrid,
  ConfirmingCard,
  ConfirmingTitle,
  ConfirmingSubtitle,
  Spinner,
  StatusBadge,
  OrderMeta,
} from './CartPage.styles'

interface CartPageProps {
  user: { id: number } | null
  onLoginClick?: () => void
}

export function CartPage({ user, onLoginClick }: CartPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const cart = useCart()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutCompletion | null>(null)

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

  const stripeSessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!stripeSessionId || !user) return

    let cancelled = false
    setCheckoutError(null)

    cartApi
      .completeCheckout(stripeSessionId)
      .then((summary) => {
        if (!cancelled) {
          setCheckoutSummary(summary)
          setSearchParams({}, { replace: true })
          cart?.refreshCart()
          loadOrders()
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCheckoutError(err instanceof Error ? err.message : 'Failed to complete order')
          setSearchParams({}, { replace: true })
        }
      })

    return () => {
      cancelled = true
    }
  }, [stripeSessionId, user, setSearchParams, cart, loadOrders])

  const handleCheckout = async () => {
    if (!user || !cart?.cart) return
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const { url } = await cartApi.createCheckoutSession()
      window.location.href = url
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed')
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

  if (stripeSessionId) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Payment received</Title>
          <Subtitle>We’re finishing your order — this only takes a moment</Subtitle>
        </PageHeader>
        <ConfirmingCard>
          <Spinner />
          <ConfirmingTitle>Confirming your payment</ConfirmingTitle>
          <ConfirmingSubtitle>
            We’re verifying your payment with Stripe and saving your order. You’ll see your receipt
            and tracking status on the next screen.
          </ConfirmingSubtitle>
        </ConfirmingCard>
      </PageContainer>
    )
  }

  const cartLoading = cart?.cart === undefined && !checkoutError
  const items = cart?.cart?.items ?? []

  if (cartLoading) {
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

      {checkoutSummary && (
        <SuccessMessage>
          <SuccessTitle>Payment successful</SuccessTitle>
          <SuccessText>
            Order #{checkoutSummary.orderId} — ${checkoutSummary.totalAmount.toFixed(2)} charged successfully.
          </SuccessText>
          <SuccessDetailGrid>
            <StatusBadge $variant="payment">
              Payment: {formatPaymentStatus(checkoutSummary.paymentStatus)}
            </StatusBadge>
            <StatusBadge $variant="shipping">
              Shipping: {formatShippingStatus(checkoutSummary.shippingStatus)}
            </StatusBadge>
          </SuccessDetailGrid>
          <SuccessText style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
            We’ll email you when your package ships. You can always check status below in My orders.
          </SuccessText>
        </SuccessMessage>
      )}

      {checkoutError && <ErrorMessage>{checkoutError}</ErrorMessage>}

      {items.length === 0 && !checkoutSummary ? (
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
                <div>
                  <OrderId>Order #{order.id}</OrderId>
                  <OrderMeta>
                    <StatusBadge $variant="payment">
                      Payment: {formatPaymentStatus(order.paymentStatus)}
                    </StatusBadge>
                    <StatusBadge $variant="shipping">
                      Shipping: {formatShippingStatus(order.shippingStatus)}
                    </StatusBadge>
                  </OrderMeta>
                </div>
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
