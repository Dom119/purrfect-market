import {
  HeroWrapper,
  HeroInner,
  HeroContent,
  Eyebrow,
  EyebrowRule,
  EyebrowLabel,
  Title,
  Subtitle,
  CtaGroup,
  PrimaryButton,
  SecondaryButton,
  SocialProof,
  Avatars,
  SocialText,
  HeroImageWrapper,
  HeroImageFrame,
  VetBadge,
  VerticalLabel,
} from './Hero.styles'

export function Hero() {
  return (
    <HeroWrapper>
      <HeroInner>
        <HeroContent>
          <Eyebrow>
            <EyebrowRule />
            <EyebrowLabel>Artisan Pet Atelier</EyebrowLabel>
          </Eyebrow>

          <Title>
            Crafted for<br />
            the <em>Discerning</em><br />
            Cat.
          </Title>

          <Subtitle>
            Curated essentials for exceptional cats. Because your feline
            companion deserves nothing less than extraordinary.
          </Subtitle>

          <CtaGroup>
            <PrimaryButton href="/products">
              Shop Collection
              <ArrowRight />
            </PrimaryButton>
            <SecondaryButton href="/products">
              Explore the Edit
            </SecondaryButton>
          </CtaGroup>

          <SocialProof>
            <Avatars>
              {[11, 12, 13, 14].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/40?img=${i}`}
                  alt=""
                  width={30}
                  height={30}
                />
              ))}
            </Avatars>
            <SocialText>
              <StarsFive /> 4.8 · Trusted by 2,000+ cat lovers
            </SocialText>
          </SocialProof>
        </HeroContent>

        <HeroImageWrapper>
          <HeroImageFrame>
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=700&h=900&fit=crop&crop=top"
              alt="A distinguished cat"
            />
          </HeroImageFrame>
          <VetBadge>
            <ShieldIcon />
            <span>Vet Approved &amp; 100% Safe</span>
          </VetBadge>
          <VerticalLabel>Est. 2024</VerticalLabel>
        </HeroImageWrapper>
      </HeroInner>
    </HeroWrapper>
  )
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  )
}

function StarsFive() {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', marginRight: '0.4rem', verticalAlign: 'middle' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#b89b6a">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}
