import { useEffect, useMemo, useRef, useState } from 'react'
import { adminApi, type AdminSubscriber, type BroadcastLog } from '../../api/admin'
import {
  PageTitle,
  PageHint,
  TableWrap,
  Table,
  ErrorBox,
  SuccessBox,
  Card,
  CardTitle,
  Field,
  Btn,
  BtnSecondary,
  TableToolbar,
  CheckboxHeader,
  CheckboxCell,
  RowCheckbox,
  ModalOverlay,
  ModalBox,
  ModalTitle,
  BodyPreview,
} from './AdminPages.styles'

export function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastHtml, setBroadcastHtml] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)
  const headerCheckboxRef = useRef<HTMLInputElement>(null)

  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<BroadcastLog[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [expandedLog, setExpandedLog] = useState<number | null>(null)

  useEffect(() => {
    adminApi
      .getSubscribers()
      .then((list) => {
        setSubscribers(list)
        setSelectedIds(new Set(list.map((s) => s.id)))
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const selectedCount = useMemo(() => {
    return subscribers.filter((s) => selectedIds.has(s.id)).length
  }, [subscribers, selectedIds])

  const allSelected = subscribers.length > 0 && selectedCount === subscribers.length
  const someSelected = selectedCount > 0 && selectedCount < subscribers.length

  useEffect(() => {
    const el = headerCheckboxRef.current
    if (el) {
      el.indeterminate = someSelected
    }
  }, [someSelected])

  const toggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedIds(new Set(subscribers.map((s) => s.id)))
  }

  const toggleHeaderCheckbox = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      selectAll()
    }
  }

  const sendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    const emails = subscribers.filter((s) => selectedIds.has(s.id)).map((s) => s.email)
    if (emails.length === 0) {
      setError('Select at least one subscriber')
      return
    }
    setSending(true)
    setError(null)
    setSendResult(null)
    try {
      const r = await adminApi.broadcastNewsletter(broadcastSubject, broadcastHtml, emails)
      setSendResult(r.message)
      setBroadcastSubject('')
      setBroadcastHtml('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  const openHistory = async () => {
    setShowHistory(true)
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const logs = await adminApi.getBroadcastHistory()
      setHistory(logs)
    } catch (e) {
      setHistoryError(e instanceof Error ? e.message : 'Failed to load history')
    } finally {
      setHistoryLoading(false)
    }
  }

  if (loading) return <PageTitle>Loading subscribers…</PageTitle>

  return (
    <>
      <PageTitle>Newsletter subscribers</PageTitle>
      <PageHint>
        Compose your message first, then choose recipients below. Broadcast uses Resend — configure{' '}
        <code>RESEND_API_KEY</code> on the server.
      </PageHint>
      {error && <ErrorBox>{error}</ErrorBox>}
      {sendResult && <SuccessBox>{sendResult}</SuccessBox>}

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle>Compose newsletter</CardTitle>
          <BtnSecondary type="button" onClick={openHistory}>
            View history
          </BtnSecondary>
        </div>
        <form onSubmit={sendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 640 }}>
          <Field>
            Subject *
            <input value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} required />
          </Field>
          <Field>
            HTML body *
            <textarea
              value={broadcastHtml}
              onChange={(e) => setBroadcastHtml(e.target.value)}
              placeholder="<p>Hello from Purrfect Market...</p>"
              required
              style={{ minHeight: 200 }}
            />
          </Field>
          <Btn
            type="submit"
            disabled={sending || selectedCount === 0}
            style={{ alignSelf: 'flex-start' }}
          >
            {sending
              ? 'Sending…'
              : selectedCount === 0
                ? 'Select subscribers to send'
                : `Send to ${selectedCount} subscriber${selectedCount === 1 ? '' : 's'}`}
          </Btn>
        </form>
      </Card>

      <TableWrap style={{ marginTop: '1.5rem' }}>
        <TableToolbar style={{ padding: '0.75rem 1rem 0' }}>
          <BtnSecondary type="button" onClick={selectAll} disabled={subscribers.length === 0}>
            Select all
          </BtnSecondary>
          <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            {selectedCount} of {subscribers.length} selected
          </span>
        </TableToolbar>
        <Table>
          <thead>
            <tr>
              <CheckboxHeader>
                <RowCheckbox
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleHeaderCheckbox}
                  aria-label="Select all subscribers"
                  disabled={subscribers.length === 0}
                />
              </CheckboxHeader>
              <th>ID</th>
              <th>Email</th>
              <th>Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id}>
                <CheckboxCell>
                  <RowCheckbox
                    type="checkbox"
                    checked={selectedIds.has(s.id)}
                    onChange={() => toggleRow(s.id)}
                    aria-label={`Select ${s.email}`}
                  />
                </CheckboxCell>
                <td>{s.id}</td>
                <td>{s.email}</td>
                <td>{new Date(s.subscribedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
      {subscribers.length === 0 && !error && <p style={{ color: '#6b7280', marginTop: '0.75rem' }}>No subscribers yet.</p>}

      {showHistory && (
        <ModalOverlay onClick={() => setShowHistory(false)}>
          <ModalBox
            style={{ maxWidth: 800, maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle>Broadcast history</ModalTitle>
            {historyLoading && <p>Loading…</p>}
            {historyError && <ErrorBox>{historyError}</ErrorBox>}
            {!historyLoading && !historyError && history.length === 0 && (
              <p style={{ color: '#6b7280' }}>No broadcasts sent yet.</p>
            )}
            {history.map((log) => (
              <div
                key={log.id}
                style={{
                  borderBottom: '1px solid var(--color-border, #e5e7eb)',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <strong>{log.subject}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 2 }}>
                      {new Date(log.sentAt).toLocaleString()} · {log.sentCount} sent
                      {log.failedCount > 0 && `, ${log.failedCount} failed`}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 2 }}>
                      To: {log.recipients.join(', ')}
                    </div>
                  </div>
                  <BtnSecondary
                    type="button"
                    style={{ flexShrink: 0 }}
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  >
                    {expandedLog === log.id ? 'Hide body' : 'View body'}
                  </BtnSecondary>
                </div>
                {expandedLog === log.id && (
                  <BodyPreview>{log.htmlBody}</BodyPreview>
                )}
              </div>
            ))}
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <BtnSecondary type="button" onClick={() => setShowHistory(false)}>
                Close
              </BtnSecondary>
            </div>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  )
}
