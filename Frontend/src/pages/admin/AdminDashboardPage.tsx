import { useEffect, useState } from 'react'
import { adminApi, type AdminStats } from '../../api/admin'
import styled from 'styled-components'
import { theme } from '../../theme'
import { PageTitle, PageHint, ErrorBox } from './AdminPages.styles'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  padding: 1.5rem;
`

const StatLabel = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.grey};
  margin: 0 0 0.5rem;
`

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin: 0;
`

const TopTable = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
`

const TopTableTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid ${theme.colors.border};
  margin: 0;
`

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.25rem;
  font-size: 0.9rem;
  color: ${theme.colors.charcoal};
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`

const Rank = styled.span`
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-right: 0.75rem;
  min-width: 1.5rem;
`

const Units = styled.span`
  font-weight: 600;
  color: ${theme.colors.grey};
  font-size: 0.85rem;
`

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminApi
      .getStats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageTitle>Loading dashboard…</PageTitle>

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <PageHint>A snapshot of store performance — revenue, orders, and top-selling products.</PageHint>
      {error && <ErrorBox>{error}</ErrorBox>}
      {stats && (
        <>
          <Grid>
            <StatCard>
              <StatLabel>Total Revenue</StatLabel>
              <StatValue>${stats.totalRevenue.toFixed(2)}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Orders</StatLabel>
              <StatValue>{stats.totalOrders}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>New Users This Month</StatLabel>
              <StatValue>{stats.newUsersThisMonth}</StatValue>
            </StatCard>
          </Grid>
          {stats.topProducts.length > 0 && (
            <TopTable>
              <TopTableTitle>Top Products by Units Sold</TopTableTitle>
              {stats.topProducts.map((p, i) => (
                <TopRow key={p.productName}>
                  <span>
                    <Rank>#{i + 1}</Rank>
                    {p.productName}
                  </span>
                  <Units>{p.unitsSold} sold</Units>
                </TopRow>
              ))}
            </TopTable>
          )}
          {stats.topProducts.length === 0 && !error && (
            <p style={{ color: 'var(--color-grey)' }}>No orders yet — top products will appear here once sales come in.</p>
          )}
        </>
      )}
    </>
  )
}
