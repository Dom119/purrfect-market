import { Link } from 'react-router-dom'
import { ContentPage } from './ContentPage'

export function TermsPage() {
  return (
    <ContentPage
      title="Terms of Service"
      lead="Last updated: March 2026. Demo terms—have a lawyer review before going live."
    >
      <h2>Using Purrfect Market</h2>
      <p>
        By using this site, you agree to these terms. You must provide accurate account information and keep your
        password confidential.
      </p>
      <h2>Orders and pricing</h2>
      <p>
        We reserve the right to correct pricing errors, refuse or cancel orders when necessary, and describe products as
        accurately as possible. In test mode, payments may be simulated—see our README for developer setup.
      </p>
      <h2>Returns</h2>
      <p>
        Return windows and restocking rules are described on our <Link to="/shipping">Shipping &amp; returns</Link> page.
        Contact us if something arrives damaged or incorrect.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Purrfect Market is not liable for indirect or consequential damages
        arising from use of the site or products. Some jurisdictions do not allow certain limitations; those limits may
        not apply to you.
      </p>
    </ContentPage>
  )
}
