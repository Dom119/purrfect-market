import {
  HeroSection,
  HeroContent,
  Tag,
  Title,
  Subtitle,
  CtaGroup,
  PrimaryButton,
  SecondaryButton,
  SocialProof,
  Avatars,
  HeroImage,
  VetBadge,
} from './Hero.styles'

export function Hero() {
  return (
    <HeroSection>
      <HeroContent>
        <Tag>
          <StarIcon />
          Premium Cat Care
        </Tag>
        <Title>Spoil Your Feline Friend with the Best</Title>
        <Subtitle>
          Discover premium toys, nutritious food, and cozy furniture designed for your cat&apos;s happiness.
          Quality you can trust, delivered to your door.
        </Subtitle>
        <CtaGroup>
          <PrimaryButton href="#">Shop Now</PrimaryButton>
          <SecondaryButton href="#">Take the Cat Quiz</SecondaryButton>
        </CtaGroup>
        <SocialProof>
          <Avatars>
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/40?img=${i + 10}`}
                alt=""
                width={40}
                height={40}
              />
            ))}
          </Avatars>
          <span>
            <Stars />
            4.8/5 from 2k+ cat lovers
          </span>
        </SocialProof>
      </HeroContent>
      <HeroImage>
        <img
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=500&fit=crop"
          alt="Fluffy cat playing with treat dispenser"
        />
        <VetBadge>
          <ShieldIcon />
          Vet Approved 100% Safe
        </VetBadge>
      </HeroImage>
    </HeroSection>
  )
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function Stars() {
  return (
    <span style={{ display: 'inline-flex', marginRight: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F2A365" style={{ marginRight: 2 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  )
}
