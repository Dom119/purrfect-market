import { Link } from 'react-router-dom'
import { ContentPage } from './ContentPage'

export function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      lead="Last updated: March 2026. This is a summary for our demo store; adjust with legal counsel before production use."
    >
      <h2>Information we collect</h2>
      <p>
        When you create an account, we store your name, email address, and a secure password hash. When you place an
        order, we keep order details needed to fulfill and support your purchase. Newsletter signups store your email
        when you opt in.
      </p>
      <h2>How we use information</h2>
      <p>
        We use your data to operate the store—processing orders, sending transactional emails when configured, and
        improving our service. We do not sell your personal information to third parties.
      </p>
      <h2>Cookies and sessions</h2>
      <p>
        We use session cookies to keep you signed in while you browse. You can clear cookies in your browser to log out
        everywhere on this device.
      </p>
      <h2>Payments</h2>
      <p>
        Payments are processed by Stripe. We do not store full card numbers on our servers. See Stripe&apos;s privacy
        policy for how they handle payment data.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions, use our <Link to="/contact">Contact</Link> page.
      </p>
    </ContentPage>
  )
}
