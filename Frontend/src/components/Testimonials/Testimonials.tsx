import { Section, SectionHeader, Title, Subtitle, Grid, Card, Stars, Quote, Author, Avatar, Name, Verified } from './Testimonials.styles'

const testimonials = [
  {
    quote: 'My cat Luna is obsessed with the Organic Salmon Feast! She used to be a picky eater, but now she runs to her bowl every time.',
    name: 'Sarah & Luna',
    avatar: 'https://i.pravatar.cc/80?img=1',
  },
  {
    quote: 'The feather wand has become our daily ritual. Best purchase ever for bonding with my rescue cat. Highly recommend!',
    name: 'Mike & Whiskers',
    avatar: 'https://i.pravatar.cc/80?img=3',
  },
  {
    quote: 'Fast shipping, amazing quality. The cozy cave bed is now my cat\'s favorite spot. Purrfect Market is my go-to for everything.',
    name: 'Emma & Oliver',
    avatar: 'https://i.pravatar.cc/80?img=5',
  },
]

export function Testimonials() {
  return (
    <Section>
      <SectionHeader>
        <Title>Happy Cats, Happy Humans</Title>
        <Subtitle>See what our community of cat lovers has to say</Subtitle>
      </SectionHeader>
      <Grid>
        {testimonials.map(({ quote, name, avatar }) => (
          <Card key={name}>
            <Stars>
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#F2A365">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </Stars>
            <Quote>&ldquo;{quote}&rdquo;</Quote>
            <Author>
              <Avatar src={avatar} alt="" />
              <div>
                <Name>{name}</Name>
                <Verified>Verified Buyer</Verified>
              </div>
            </Author>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}
