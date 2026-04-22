import { useEffect, useState } from 'react'
import { adminApi, type PendingReview } from '../../api/admin'
import {
  PageTitle,
  PageHint,
  TableWrap,
  Table,
  ErrorBox,
  SuccessBox,
  Btn,
  BtnSecondary,
} from './AdminPages.styles'

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export function AdminPendingReviewsPage() {
  const [reviews, setReviews] = useState<PendingReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [actingId, setActingId] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    adminApi
      .getPendingReviews()
      .then(setReviews)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const approve = async (id: number) => {
    setActingId(id)
    setError(null)
    setSuccess(null)
    try {
      const res = await adminApi.approveReview(id)
      setSuccess(res.message)
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to approve')
    } finally {
      setActingId(null)
    }
  }

  const reject = async (id: number) => {
    setActingId(id)
    setError(null)
    setSuccess(null)
    try {
      await adminApi.rejectReview(id)
      setSuccess('Review rejected and removed')
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reject')
    } finally {
      setActingId(null)
    }
  }

  if (loading) return <PageTitle>Loading pending reviews…</PageTitle>

  return (
    <>
      <PageTitle>Pending Reviews</PageTitle>
      <PageHint>
        Reviews submitted by customers awaiting your approval. Approving publishes the review and
        updates the product's rating and count automatically.
      </PageHint>
      {error && <ErrorBox>{error}</ErrorBox>}
      {success && <SuccessBox>{success}</SuccessBox>}

      {reviews.length === 0 && !error && (
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>No pending reviews — you're all caught up.</p>
      )}

      {reviews.length > 0 && (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Title</th>
                <th>Submitted</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <>
                  <tr key={r.id}>
                    <td>{r.productName}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.authorName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{r.authorEmail}</div>
                    </td>
                    <td style={{ color: '#f2a365', letterSpacing: 1 }}>{STARS(r.rating)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: 0, textAlign: 'left', fontWeight: 600,
                          textDecoration: 'underline', textUnderlineOffset: 2,
                          fontSize: 'inherit', color: 'inherit',
                        }}
                      >
                        {r.title}
                      </button>
                    </td>
                    <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(r.submittedAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <Btn
                        type="button"
                        disabled={actingId === r.id}
                        onClick={() => approve(r.id)}
                        style={{ marginRight: '0.5rem', padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
                      >
                        Approve
                      </Btn>
                      <BtnSecondary
                        type="button"
                        disabled={actingId === r.id}
                        onClick={() => reject(r.id)}
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
                      >
                        Reject
                      </BtnSecondary>
                    </td>
                  </tr>
                  {expanded === r.id && (
                    <tr key={`body-${r.id}`}>
                      <td colSpan={6} style={{ paddingTop: 0 }}>
                        <div
                          style={{
                            background: 'var(--color-grey-bg, #f9fafb)',
                            border: '1px solid var(--color-border, #e5e7eb)',
                            borderRadius: 6,
                            padding: '0.75rem 1rem',
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            marginBottom: '0.5rem',
                          }}
                        >
                          {r.body}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </>
  )
}
