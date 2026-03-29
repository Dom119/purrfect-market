import styled from 'styled-components'
import { theme } from '../theme'

export const Main = styled.main`
  min-height: 60vh;
  padding: 2.5rem 1.5rem 4rem;
`

export const Article = styled.article`
  max-width: 720px;
  margin: 0 auto;
`

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.75rem;
`

export const Lead = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.grey};
  margin-bottom: 2rem;
  line-height: 1.6;
`

export const Prose = styled.div`
  font-size: 1rem;
  line-height: 1.75;
  color: ${theme.colors.charcoal};

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${theme.colors.navy};
    margin: 2rem 0 0.75rem;

    &:first-child {
      margin-top: 0;
    }
  }

  p {
    margin-bottom: 1rem;
  }

  ul {
    margin: 0 0 1rem 1.25rem;
  }

  li {
    margin-bottom: 0.35rem;
  }

  a {
    color: ${theme.colors.teal};
    text-decoration: underline;

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`
