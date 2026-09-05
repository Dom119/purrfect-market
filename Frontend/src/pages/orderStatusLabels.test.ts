import { describe, expect, it } from 'vitest'
import { formatPaymentStatus, formatShippingStatus } from './orderStatusLabels'

describe('formatPaymentStatus', () => {
  it('maps known codes to their label', () => {
    expect(formatPaymentStatus('PAID')).toBe('Paid')
    expect(formatPaymentStatus('PENDING')).toBe('Payment pending')
  })

  it('defaults to Paid when code is missing', () => {
    expect(formatPaymentStatus(undefined)).toBe('Paid')
  })

  it('falls back to a humanized version of unknown codes', () => {
    expect(formatPaymentStatus('REFUND_FAILED')).toBe('refund failed')
  })
})

describe('formatShippingStatus', () => {
  it('maps known codes to their label', () => {
    expect(formatShippingStatus('PREPARING')).toBe('Preparing shipment')
    expect(formatShippingStatus('SHIPPED')).toBe('Shipped')
    expect(formatShippingStatus('DELIVERED')).toBe('Delivered')
  })

  it('defaults to Preparing shipment when code is missing', () => {
    expect(formatShippingStatus(undefined)).toBe('Preparing shipment')
  })

  it('falls back to a humanized version of unknown codes', () => {
    expect(formatShippingStatus('OUT_FOR_DELIVERY')).toBe('out for delivery')
  })
})
