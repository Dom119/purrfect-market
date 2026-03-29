import { Link } from 'react-router-dom'
import { ContentPage } from './ContentPage'

export function FaqPage() {
  return (
    <ContentPage title="Frequently asked questions" lead="Quick answers about shopping with Purrfect Market.">
      <h2>Do I need an account to buy?</h2>
      <p>
        Yes—signing in lets us save your cart, favorites, and order history securely. Creating an account only takes a
        minute.
      </p>
      <h2>Is checkout secure?</h2>
      <p>
        We use Stripe for payments. Card details are handled by Stripe; we don’t store your full card number on our
        servers.
      </p>
      <h2>How do I track my order?</h2>
      <p>
        Visit <Link to="/orders">My orders</Link> while logged in. You’ll see payment and shipping status there.
      </p>
      <h2>Do you ship internationally?</h2>
      <p>
        Shipping zones depend on our fulfillment partners. Check options at checkout or contact us with your address.
      </p>
      <h2>How do I subscribe to the newsletter?</h2>
      <p>
        Use the signup form on our homepage. You can unsubscribe anytime via the link in any marketing email.
      </p>
    </ContentPage>
  )
}
