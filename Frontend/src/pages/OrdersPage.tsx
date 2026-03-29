import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchOrders, type Order } from '../api/orders'
import { formatPaymentStatus, formatShippingStatus } from './orderStatusLabels'
import {
  PageContainer,
  PageHeader,
  Title,
  Subtitle,
  Loading,
  ErrorMessage,
  EmptyMessage,
  OrderList,
  OrderCard,
  OrderHeader,
  OrderId,
  OrderDate,
  Total,
  StatusRow,
  StatusBadge,
  ItemsTable,
} from './OrdersPage.styles'

interface OrdersPageProps {
  user: { id: number } | null
  onLoginClick?: () => void
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function OrdersPage({ user, onLoginClick }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      setOrders([])
      return
    }
    setLoading(true)
    setError(null)
    fetchOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>My orders</Title>
          <Subtitle>Sign in to see your order history and status</Subtitle>
        </PageHeader>
        <EmptyMessage>
          <button type="button" onClick={onLoginClick} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            Log in
          </button>{' '}
          to view your orders.
        </EmptyMessage>
      </PageContainer>
    )
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>My orders</Title>
          <Subtitle>Loading your order history…</Subtitle>
        </PageHeader>
        <Loading>Loading…</Loading>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>My orders</Title>
        </PageHeader>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    )
  }

  if (orders.length === 0) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>My orders</Title>
          <Subtitle>Your purchases will appear here</Subtitle>
        </PageHeader>
        <EmptyMessage>
          No orders yet.{' '}
          <Link to="/products" style={{ textDecoration: 'underline' }}>
            Browse the shop
          </Link>
          .
        </EmptyMessage>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title>My orders</Title>
        <Subtitle>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</Subtitle>
      </PageHeader>

      <OrderList>
        {orders.map((order) => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <div>
                <OrderId>Order #{order.id}</OrderId>
                <OrderDate> · {formatDate(order.createdAt)}</OrderDate>
              </div>
              <Total>${order.totalAmount.toFixed(2)}</Total>
            </OrderHeader>
            <StatusRow>
              <span>
                Payment:{' '}
                <StatusBadge>{formatPaymentStatus(order.paymentStatus)}</StatusBadge>
              </span>
              <span>
                Shipping:{' '}
                <StatusBadge>{formatShippingStatus(order.shippingStatus)}</StatusBadge>
              </span>
            </StatusRow>
            <ItemsTable>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((line) => (
                  <tr key={`${order.id}-${line.productId}-${line.productName}`}>
                    <td>
                      <Link to={`/products/${line.productId}`}>{line.productName}</Link>
                    </td>
                    <td>{line.quantity}</td>
                    <td>${line.unitPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </ItemsTable>
          </OrderCard>
        ))}
      </OrderList>
    </PageContainer>
  )
}
