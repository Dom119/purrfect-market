import { Link } from 'react-router-dom'
import { ContentPage } from './ContentPage'

export function AboutPage() {
  return (
    <ContentPage
      title="About Purrfect Market"
      lead="We believe every cat deserves quality care—and every pet parent deserves a shopping experience that feels simple, honest, and a little bit joyful."
    >
      <p>
        Purrfect Market started with a simple idea: curate products we would give our own cats—nutritious food,
        safe toys, cozy beds, and grooming essentials—without the overwhelm of endless choices.
      </p>
      <p>
        We partner with trusted brands and keep our catalog focused so you can shop with confidence. Our team is
        small, cat-obsessed, and committed to fast shipping, clear information, and support when you need it.
      </p>
      <p>
        Thank you for letting us be part of your cat&apos;s story. Questions? Reach us on the{' '}
        <Link to="/contact">Contact</Link> page—we read every message.
      </p>
    </ContentPage>
  )
}
