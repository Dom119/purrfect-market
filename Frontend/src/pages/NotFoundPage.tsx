import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { theme } from '../theme'
import { Footer } from '../components/Footer/Footer'

const Main = styled.main`
  min-height: 50vh;
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.75rem;
`

const Text = styled.p`
  color: ${theme.colors.grey};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;

  a {
    color: ${theme.colors.teal};
    font-weight: 500;
    text-decoration: underline;

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found | Purrfect Market'
  }, [])

  return (
    <>
      <Main>
        <Title>Page not found</Title>
        <Text>That URL doesn&apos;t match anything on Purrfect Market. Try the home page or shop.</Text>
        <NavLinks>
          <Link to="/">Home</Link>
          <Link to="/products">Shop all</Link>
        </NavLinks>
      </Main>
      <Footer />
    </>
  )
}
