import { useEffect, useState } from 'react'
import { adminApi, type AdminOrder } from '../../api/admin'
import {
  PageTitle,
  PageHint,
  TableWrap,
  Table,
  ErrorBox,
} from './AdminPages.styles'

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminApi
      .getOrders()
      .then(setOrders)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageTitle>Loading orders…</PageTitle>

  return (
    <>
      <PageTitle>All orders</PageTitle>
      <PageHint>Every customer order with payment and shipping status.</PageHint>
      {error && <ErrorBox>{error}</ErrorBox>}
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Shipping</th>
              <th>Date</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.customerName}</td>
                <td>{o.customerEmail}</td>
                <td>${o.totalAmount.toFixed(2)}</td>
                <td>{o.paymentStatus}</td>
                <td>{o.shippingStatus}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                    {o.items.map((i) => (
                      <li key={`${o.id}-${i.productId}-${i.quantity}`}>
                        {i.productName} × {i.quantity} @ ${i.unitPrice.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
      {orders.length === 0 && !error && <p style={{ color: '#6b7280' }}>No orders yet.</p>}
    </>
  )
}
