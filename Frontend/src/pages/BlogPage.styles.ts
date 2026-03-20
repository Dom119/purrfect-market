import styled from 'styled-components'
import { theme } from '../theme'

export const PageContainer = styled.main`
  min-height: 100vh;
  background: ${theme.colors.greyBg};
  padding: 1.5rem 1rem 4rem;
`

export const FeedWrapper = styled.div`
  max-width: 680px;
  margin: 0 auto;
`

export const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.25rem;
`

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${theme.colors.grey};
`

export const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ArticleCard = styled.article<{ $expanded?: boolean }>`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`

export const ArticlePreview = styled.div`
  cursor: pointer;
  user-select: none;
`

export const ArticleImage = styled.div`
  aspect-ratio: 16/9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const ArticleBody = styled.div`
  padding: 1rem 1.25rem;
`

export const ArticleMeta = styled.span`
  display: block;
  font-size: 0.8rem;
  color: ${theme.colors.grey};
  margin-bottom: 0.5rem;
`

export const ArticleTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 600;
  color: ${theme.colors.navy};
  margin: 0 0 0.5rem;
  line-height: 1.3;
`

export const ArticleExcerpt = styled.p`
  font-size: 0.95rem;
  color: ${theme.colors.charcoal};
  line-height: 1.5;
  margin: 0;
`

export const ExpandHint = styled.span`
  display: block;
  font-size: 0.8rem;
  color: ${theme.colors.primary};
  margin-top: 0.5rem;
`

export const ArticleFullContent = styled.div`
  padding: 0 1.25rem 1.5rem;
  border-top: 1px solid ${theme.colors.greyBg};

  p {
    font-size: 0.95rem;
    color: ${theme.colors.charcoal};
    line-height: 1.6;
    margin: 0 0 1rem;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: ${theme.colors.navy};
    margin: 1.25rem 0 0.5rem;
  }

  h3:first-child {
    margin-top: 0;
  }
`
