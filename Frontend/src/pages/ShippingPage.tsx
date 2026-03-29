import { Link } from 'react-router-dom'
import { ContentPage } from './ContentPage'

export function ShippingPage() {
  return (
    <ContentPage
      title="Shipping & returns"
      lead="How we get orders to you—and what to do if something isn’t right."
    >
      <h2>Shipping</h2>
      <p>
        Standard orders are packed within 1–2 business days. You’ll see estimated delivery at checkout when live rates
        are connected. For this demo, treat timelines as illustrative.
      </p>
      <h2>Tracking</h2>
      <p>
        When your order ships, you’ll receive tracking by email (when email delivery is configured). You can also check
        status in <Link to="/orders">My orders</Link> when signed in.
      </p>
      <h2>Returns</h2>
      <p>
        Unopened items in original packaging may be returned within 30 days of delivery for a refund or exchange,
        subject to inspection. Opened food and personalized items may not be eligible—contact us with your order number.
      </p>
      <h2>Damaged or wrong items</h2>
      <p>
        Email us within 7 days with a photo of the package and item. We’ll make it right with a replacement or refund.
      </p>
    </ContentPage>
  )
}
