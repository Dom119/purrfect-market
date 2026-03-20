import { Hero } from '../components/Hero/Hero'
import { ShopByCategory } from '../components/ShopByCategory/ShopByCategory'
import { PurrfectPicks } from '../components/PurrfectPicks/PurrfectPicks'
import { ValuePropositions } from '../components/ValuePropositions/ValuePropositions'
import { Testimonials } from '../components/Testimonials/Testimonials'
import { Newsletter } from '../components/Newsletter/Newsletter'
import { Footer } from '../components/Footer/Footer'
import type { AuthResponse } from '../api/auth'

interface LandingPageProps {
  user: AuthResponse | null
  onLoginClick?: () => void
}

export function LandingPage({ user, onLoginClick }: LandingPageProps) {
  return (
    <>
      <Hero />
      <ShopByCategory />
      <PurrfectPicks user={user} onLoginClick={onLoginClick} />
      <ValuePropositions />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  )
}
