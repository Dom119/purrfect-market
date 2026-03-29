import styled from 'styled-components'
import { theme } from '../theme'

export const PageContainer = styled.main`
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.5rem;
`

export const Subtitle = styled.p`
  font-size: 1.05rem;
  color: ${theme.colors.grey};
`

export const Loading = styled.p`
  color: ${theme.colors.grey};
`

export const ErrorMessage = styled.p`
  color: #c62828;
  padding: 1rem;
  background: #ffebee;
  border-radius: ${theme.radius.md};
`

export const EmptyMessage = styled.p`
  color: ${theme.colors.grey};
  font-size: 1.05rem;
  line-height: 1.6;
`

export const OrderList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const OrderCard = styled.li`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.greyLight};
  border-radius: ${theme.radius.lg};
  padding: 1.25rem 1.5rem;
  box-shadow: ${theme.shadows.sm};
`

export const OrderHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${theme.colors.greyBg};
`

export const OrderId = styled.span`
  font-weight: 600;
  color: ${theme.colors.navy};
`

export const OrderDate = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.grey};
`

export const Total = styled.span`
  font-weight: 600;
  color: ${theme.colors.navy};
`

export const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  font-size: 0.9rem;
  color: ${theme.colors.charcoal};
  margin-bottom: 1rem;
`

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.greyBg};
  font-size: 0.85rem;
`

export const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    text-align: left;
    padding: 0.4rem 0.5rem 0.4rem 0;
  }

  th {
    color: ${theme.colors.grey};
    font-weight: 500;
    border-bottom: 1px solid ${theme.colors.greyBg};
  }

  td {
    color: ${theme.colors.charcoal};
  }
`
