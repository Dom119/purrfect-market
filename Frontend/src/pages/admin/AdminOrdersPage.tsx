import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { adminApi, type AdminOrder } from '../../api/admin'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
import {
  PageTitle,
  PageHint,
  TableWrap,
  Table,
  ErrorBox,
  FilterSelect,
  FilterMeta,
  BtnSecondary,
} from './AdminPages.styles'

type OrderFilters = {
  id: string
  customer: string
  email: string
  total: string
  payment: string
  shipping: string
  date: string
  items: string
}

const emptyFilters: OrderFilters = {
  id: '',
  customer: '',
  email: '',
  total: '',
  payment: '',
  shipping: '',
  date: '',
  items: '',
}

function orderMatchesFilters(o: AdminOrder, f: OrderFilters): boolean {
  if (f.id && String(o.id) !== f.id) return false
  if (f.customer && o.customerName !== f.customer) return false
  if (f.email && o.customerEmail !== f.email) return false
  if (f.total && o.totalAmount.toFixed(2) !== f.total) return false
  if (f.payment && o.paymentStatus !== f.payment) return false
  if (f.shipping && o.shippingStatus !== f.shipping) return false
  if (f.date && o.createdAt.slice(0, 10) !== f.date) return false
  if (f.items && !o.items.some((i) => i.productName === f.items)) return false
  return true
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<OrderFilters>(emptyFilters)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await adminApi.exportOrdersCsv()
      const date = new Date().toISOString().slice(0, 10)
      downloadBlob(blob, `orders-${date}.csv`)
    } catch {
      setError('Export failed')
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    adminApi
      .getOrders()
      .then(setOrders)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => orders.filter((o) => orderMatchesFilters(o, filters)),
    [orders, filters]
  )

  const idOptions = useMemo(
    () => [...new Set(orders.map((o) => String(o.id)))].sort((a, b) => Number(a) - Number(b)),
    [orders]
  )

  const customerOptions = useMemo(
    () => [...new Set(orders.map((o) => o.customerName))].sort((a, b) => a.localeCompare(b)),
    [orders]
  )

  const emailOptions = useMemo(
    () => [...new Set(orders.map((o) => o.customerEmail))].sort((a, b) => a.localeCompare(b)),
    [orders]
  )

  const totalOptions = useMemo(() => {
    const set = new Set(orders.map((o) => o.totalAmount.toFixed(2)))
    return [...set].sort((a, b) => Number(a) - Number(b))
  }, [orders])

  const paymentOptions = useMemo(
    () => [...new Set(orders.map((o) => o.paymentStatus))].sort((a, b) => a.localeCompare(b)),
    [orders]
  )

  const shippingOptions = useMemo(
    () => [...new Set(orders.map((o) => o.shippingStatus))].sort((a, b) => a.localeCompare(b)),
    [orders]
  )

  const dateOptions = useMemo(() => {
    const keys = [...new Set(orders.map((o) => o.createdAt.slice(0, 10)))]
    return keys.sort().map((iso) => ({
      iso,
      label: new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }))
  }, [orders])

  const itemProductOptions = useMemo(() => {
    const names = new Set<string>()
    for (const o of orders) {
      for (const i of o.items) names.add(i.productName)
    }
    return [...names].sort((a, b) => a.localeCompare(b))
  }, [orders])

  const setField = (key: keyof OrderFilters) => (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }))
  }

  if (loading) return <PageTitle>Loading orders…</PageTitle>

  return (
    <>
      <PageTitle>All orders</PageTitle>
      <PageHint>
        Every customer order with payment and shipping status. Use the dropdown under each column to
        narrow the list (options are built from the loaded orders).
      </PageHint>
      {error && <ErrorBox>{error}</ErrorBox>}
      <FilterMeta>
        Showing {filtered.length} of {orders.length} orders
        {Object.values(filters).some((v) => v) && (
          <BtnSecondary type="button" onClick={() => setFilters(emptyFilters)} style={{ marginLeft: '0.75rem' }}>
            Clear filters
          </BtnSecondary>
        )}
        <BtnSecondary type="button" onClick={handleExport} disabled={exporting} style={{ marginLeft: '0.75rem' }}>
          {exporting ? 'Exporting…' : '⬇ Export CSV'}
        </BtnSecondary>
      </FilterMeta>
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
            <tr>
              <th>
                <FilterSelect
                  value={filters.id}
                  onChange={setField('id')}
                  aria-label="Filter by order ID"
                >
                  <option value="">All IDs</option>
                  {idOptions.map((id) => (
                    <option key={id} value={id}>
                      #{id}
                    </option>
                  ))}
                </FilterSelect>
              </th>
              <th>
                <FilterSelect
                  value={filters.customer}
                  onChange={setField('customer')}
                  aria-label="Filter by customer name"
                >
                  <option value="">All customers</option>
                  {customerOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </FilterSelect>
              </th>
              <th>
                <FilterSelect
                  value={filters.email}
                  onChange={setField('email')}
                  aria-label="Filter by email"
                >
                  <option value="">All emails</option>
                  {emailOptions.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
                </FilterSelect>
              </th>
              <th>
                <FilterSelect
                  value={filters.total}
                  onChange={setField('total')}
                  aria-label="Filter by total amount"
                >
                  <option value="">All totals</option>
                  {totalOptions.map((t) => (
                    <option key={t} value={t}>
                      ${t}
                    </option>
                  ))}
                </FilterSelect>
              </th>
              <th>
                <FilterSelect
                  value={filters.payment}
                  onChange={setField('payment')}
                  aria-label="Filter by payment status"
                >
                  <option value="">All payment</option>
                  {paymentOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </FilterSelect>
              </th>
              <th>
                <FilterSelect
                  value={filters.shipping}
                  onChange={setField('shipping')}
                  aria-label="Filter by shipping status"
                >
                  <option value="">All shipping</option>
                  {shippingOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </FilterSelect>
              </th>
              <th>
                <FilterSelect
                  value={filters.date}
                  onChange={setField('date')}
                  aria-label="Filter by order date"
                >
                  <option value="">All dates</option>
                  {dateOptions.map(({ iso, label }) => (
                    <option key={iso} value={iso}>
                      {label}
                    </option>
                  ))}
                </FilterSelect>
              </th>
              <th>
                <FilterSelect
                  value={filters.items}
                  onChange={setField('items')}
                  aria-label="Filter by product in line items"
                >
                  <option value="">All products</option>
                  {itemProductOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </FilterSelect>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
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
      {orders.length > 0 && filtered.length === 0 && !error && (
        <p style={{ color: '#6b7280' }}>No orders match the current filters.</p>
      )}
    </>
  )
}
