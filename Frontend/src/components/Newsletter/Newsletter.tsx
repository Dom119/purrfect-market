import { Section, Inner, Content, Title, Description, Form, Input, Button } from './Newsletter.styles'

export function Newsletter() {
  return (
    <Section>
      <Inner>
        <Content>
          <Title>Join Our Purrfect Club</Title>
          <Description>
            Subscribe for 15% off your first order and get exclusive tips, new arrivals, and special offers.
          </Description>
        </Content>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Input type="email" placeholder="Enter your email" required aria-label="Email" />
          <Button type="submit">Subscribe Now</Button>
        </Form>
      </Inner>
    </Section>
  )
}
