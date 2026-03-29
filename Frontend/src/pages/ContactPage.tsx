import { Link } from 'react-router-dom'
import { ContentPage } from './ContentPage'

export function ContactPage() {
  return (
    <ContentPage
      title="Contact us"
      lead="We’d love to hear from you—whether it’s a product question, order issue, or just a cute cat photo."
    >
      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:hello@purrfect.market">hello@purrfect.market</a>
      </p>
      <p>
        <strong>Hours:</strong> Monday–Friday, 9am–5pm (local time). We aim to reply within one business day.
      </p>
      <p>
        For order help, include your order number from <Link to="/orders">My orders</Link> so we can assist faster.
      </p>
    </ContentPage>
  )
}
