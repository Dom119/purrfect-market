import type { ReactNode } from 'react'
import { Footer } from '../components/Footer/Footer'
import { Article, Lead, Main, PageTitle, Prose } from './ContentPage.styles'

interface ContentPageProps {
  title: string
  lead?: string
  children: ReactNode
}

export function ContentPage({ title, lead, children }: ContentPageProps) {
  return (
    <>
      <Main>
        <Article>
          <PageTitle>{title}</PageTitle>
          {lead && <Lead>{lead}</Lead>}
          <Prose>{children}</Prose>
        </Article>
      </Main>
      <Footer />
    </>
  )
}
