const PAYMENT: Record<string, string> = {
  PAID: 'Paid',
  PENDING: 'Payment pending',
}

const SHIPPING: Record<string, string> = {
  PREPARING: 'Preparing shipment',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
}

export function formatPaymentStatus(code: string | undefined): string {
  if (!code) return 'Paid'
  return PAYMENT[code] ?? code.replace(/_/g, ' ').toLowerCase()
}

export function formatShippingStatus(code: string | undefined): string {
  if (!code) return 'Preparing shipment'
  return SHIPPING[code] ?? code.replace(/_/g, ' ').toLowerCase()
}
