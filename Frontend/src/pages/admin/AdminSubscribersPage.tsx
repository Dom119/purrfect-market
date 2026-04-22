import { useEffect, useState } from 'react'
import { adminApi, type AdminSubscriber } from '../../api/admin'
import {
  PageTitle,
  PageHint,
  TableWrap,
  Table,
  ErrorBox,
} from './AdminPages.styles'

export function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminApi
      .getSubscribers()
      .then(setSubscribers)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageTitle>Loading subscribers…</PageTitle>

  return (
    <>
      <PageTitle>Subscribers</PageTitle>
      <PageHint>
        All newsletter subscribers. A subscriber may or may not have a registered account.
      </PageHint>
      {error && <ErrorBox>{error}</ErrorBox>}

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th style={{ textAlign: 'center' }}>User</th>
              <th>Name</th>
              <th>Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.email}</td>
                <td style={{ textAlign: 'center' }}>
                  {s.isUser
                    ? <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ Yes</span>
                    : <span style={{ color: '#9ca3af' }}>—</span>}
                </td>
                <td>{s.userName ?? <span style={{ color: '#9ca3af' }}>—</span>}</td>
                <td>{new Date(s.subscribedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
      {subscribers.length === 0 && !error && (
        <p style={{ color: '#6b7280', marginTop: '0.75rem' }}>No subscribers yet.</p>
      )}
    </>
  )
}
