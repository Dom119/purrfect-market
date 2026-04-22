import { useEffect, useRef, useState } from 'react'
import { submitReview } from '../../api/products'
import {
  Overlay, Modal, Header, Title, Summary, AvgRating,
  CloseBtn, List, ReviewCard, Avatar, Body, AuthorRow,
  AuthorName, ReviewDate, ReviewTitle, ReviewBody, Divider, Empty,
} from './ReviewsModal.styles'
import styled from 'styled-components'
import { theme } from '../../theme'

export interface Review {
  id: number
  authorName: string
  rating: number
  title: string
  body: string
  createdAt: string
}

// ── write-a-review form styles ────────────────────────────────────────────────
const FormSection = styled.div`
  border-top: 2px solid ${theme.colors.border};
  padding: 1.25rem 1.75rem 1.5rem;
  flex-shrink: 0;
`

const FormTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin: 0 0 1rem;
`

const StarPicker = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.75rem;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: #d1d5db;
    transition: color 0.1s;
    line-height: 1;

    &.active { color: #f2a365; }
    &:hover { color: #f2a365; }
  }
`

const FormInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.65rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  font-size: 0.9rem;
  background: ${theme.colors.white};
  color: ${theme.colors.charcoal};
  box-sizing: border-box;
  margin-bottom: 0.6rem;

  &:focus { outline: 2px solid ${theme.colors.primary}; outline-offset: 1px; }
`

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.65rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  font-size: 0.9rem;
  background: ${theme.colors.white};
  color: ${theme.colors.charcoal};
  box-sizing: border-box;
  resize: vertical;
  min-height: 90px;
  font-family: inherit;
  margin-bottom: 0.75rem;

  &:focus { outline: 2px solid ${theme.colors.primary}; outline-offset: 1px; }
`

const SubmitBtn = styled.button`
  padding: 0.55rem 1.25rem;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.radius.md};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) { background: ${theme.colors.primaryDark}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const LoginPrompt = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.grey};
  margin: 0;

  button {
    background: none;
    border: none;
    padding: 0;
    color: ${theme.colors.primary};
    font-size: inherit;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }
`

const SuccessMsg = styled.p`
  font-size: 0.875rem;
  color: #166534;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: ${theme.radius.sm};
  padding: 0.6rem 0.85rem;
  margin: 0;
`

const ErrorMsg = styled.p`
  font-size: 0.875rem;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: ${theme.radius.sm};
  padding: 0.6rem 0.85rem;
  margin: 0 0 0.6rem;
`

// ─────────────────────────────────────────────────────────────────────────────

interface ReviewsModalProps {
  productId: number
  productName: string
  totalCount: number
  avgRating: number
  user?: { id: number } | null
  onClose: () => void
  onLoginClick?: () => void
}

export function ReviewsModal({
  productId, productName, totalCount, avgRating,
  user, onClose, onLoginClick,
}: ReviewsModalProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // form state
  const [hovered, setHovered] = useState(0)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setSubmitError('Please select a star rating'); return }
    if (!title.trim()) { setSubmitError('Please enter a title'); return }
    if (!body.trim()) { setSubmitError('Please write your review'); return }
    setSubmitting(true)
    setSubmitError(null)
    try {
      await submitReview(productId, { rating, title: title.trim(), body: body.trim() })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const displayRating = hovered || rating

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-label={`Reviews for ${productName}`}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{productName} — Customer Reviews</Title>
          <Summary>
            <AvgRating>{avgRating.toFixed(1)}</AvgRating>
            <Stars count={avgRating} />
            <span>{totalCount.toLocaleString()} reviews</span>
          </Summary>
          <CloseBtn onClick={onClose} aria-label="Close reviews">
            <CloseIcon />
          </CloseBtn>
        </Header>

        <List ref={listRef}>
          {loading && <Empty>Loading reviews…</Empty>}
          {!loading && reviews.length === 0 && <Empty>No reviews yet — be the first!</Empty>}
          {reviews.map((r, i) => (
            <>
              <ReviewCard key={r.id}>
                <Avatar>{initials(r.authorName)}</Avatar>
                <Body>
                  <AuthorRow>
                    <AuthorName>{r.authorName}</AuthorName>
                    <Stars count={r.rating} size={13} />
                    <ReviewDate>{formatDate(r.createdAt)}</ReviewDate>
                  </AuthorRow>
                  <ReviewTitle>{r.title}</ReviewTitle>
                  <ReviewBody>{r.body}</ReviewBody>
                </Body>
              </ReviewCard>
              {i < reviews.length - 1 && <Divider key={`d-${r.id}`} />}
            </>
          ))}
        </List>

        {/* ── Write a review ── */}
        <FormSection>
          <FormTitle>Write a Review</FormTitle>
          {!user ? (
            <LoginPrompt>
              <button type="button" onClick={onLoginClick}>Log in</button> to share your experience with this product.
            </LoginPrompt>
          ) : submitted ? (
            <SuccessMsg>
              Thank you! Your review has been submitted and is pending approval by our team.
            </SuccessMsg>
          ) : (
            <form onSubmit={handleSubmit}>
              <StarPicker onMouseLeave={() => setHovered(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={n <= displayRating ? 'active' : ''}
                    onMouseEnter={() => setHovered(n)}
                    onClick={() => setRating(n)}
                    aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                  >
                    <StarIcon size={26} />
                  </button>
                ))}
              </StarPicker>
              {submitError && <ErrorMsg>{submitError}</ErrorMsg>}
              <FormInput
                placeholder="Review title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
              <FormTextarea
                placeholder="Share your experience with this product *"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={1000}
              />
              <SubmitBtn type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit review'}
              </SubmitBtn>
            </form>
          )}
        </FormSection>
      </Modal>
    </Overlay>
  )
}

// ── helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  const full = Math.floor(count)
  const hasHalf = count % 1 >= 0.5
  return (
    <span style={{ display: 'inline-flex', color: '#F2A365' }}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {hasHalf && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      {Array.from({ length: 5 - full - (hasHalf ? 1 : 0) }).map((_, i) => (
        <svg key={`e-${i}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

function StarIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
