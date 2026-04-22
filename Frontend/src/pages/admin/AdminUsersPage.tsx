import { useEffect, useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { adminApi, type AdminUser } from '../../api/admin'
import { authApi, isMainAdmin } from '../../api/auth'
import type { AdminOutletContext } from './AdminLayout'
import {
  PageTitle,
  PageHint,
  TableWrap,
  Table,
  ErrorBox,
  SuccessBox,
  Btn,
  SelectSm,
} from './AdminPages.styles'

type GroupValue = 'USER' | 'MAIN_ADMIN'

export function AdminUsersPage() {
  const { user: sessionUser, onUserChange, onStartEmulation } = useOutletContext<AdminOutletContext>()
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [drafts, setDrafts] = useState<Record<number, GroupValue>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [emulatingId, setEmulatingId] = useState<number | null>(null)

  const load = () =>
    adminApi
      .getUsers()
      .then((list) => {
        setUsers(list)
        const d: Record<number, GroupValue> = {}
        list.forEach((u) => {
          d[u.id] = u.userGroup === 'MAIN_ADMIN' ? 'MAIN_ADMIN' : 'USER'
        })
        setDrafts(d)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const saveGroup = async (userId: number) => {
    const next = drafts[userId]
    if (!next) return
    setSavingId(userId)
    setError(null)
    setMessage(null)
    try {
      const updated = await adminApi.updateUserGroup(userId, next)
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)))
      setMessage(`Updated ${updated.email}`)
      if (sessionUser?.id === userId && onUserChange) {
        try {
          const fresh = await authApi.me()
          onUserChange(fresh)
        } catch {
          onUserChange(null)
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
      await load()
    } finally {
      setSavingId(null)
    }
  }

  const emulateUser = async (u: AdminUser) => {
    if (!sessionUser) return
    setEmulatingId(u.id)
    setError(null)
    try {
      const targetUser = await adminApi.startEmulation(u.id)
      onStartEmulation?.(targetUser, sessionUser)
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Emulation failed')
    } finally {
      setEmulatingId(null)
    }
  }

  if (loading) return <PageTitle>Loading users…</PageTitle>

  return (
    <>
      <PageTitle>Users</PageTitle>
      <PageHint>
        Change a user&apos;s group between <strong>User</strong> and <strong>Main Admin</strong>. At least one Main
        Admin must always remain.
      </PageHint>
      {error && <ErrorBox>{error}</ErrorBox>}
      {message && <SuccessBox>{message}</SuccessBox>}

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subscriber</th>
              <th>Group</th>
              <th></th>
              {isMainAdmin(sessionUser) && <th></th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const draft = drafts[u.id] ?? (u.userGroup === 'MAIN_ADMIN' ? 'MAIN_ADMIN' : 'USER')
              const dirty = draft !== (u.userGroup === 'MAIN_ADMIN' ? 'MAIN_ADMIN' : 'USER')
              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ textAlign: 'center' }}>
                    {u.isSubscriber
                      ? <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ Yes</span>
                      : <span style={{ color: '#9ca3af' }}>—</span>}
                  </td>
                  <td>
                    <SelectSm
                      value={draft}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [u.id]: e.target.value as GroupValue }))
                      }
                      aria-label={`Group for ${u.email}`}
                    >
                      <option value="USER">User</option>
                      <option value="MAIN_ADMIN">Main Admin</option>
                    </SelectSm>
                  </td>
                  <td>
                    <Btn type="button" disabled={!dirty || savingId === u.id} onClick={() => saveGroup(u.id)}>
                      {savingId === u.id ? 'Saving…' : 'Save'}
                    </Btn>
                  </td>
                  {isMainAdmin(sessionUser) && (
                    <td>
                      {u.id !== sessionUser?.id && (
                        <Btn
                          type="button"
                          disabled={emulatingId === u.id}
                          style={{ background: '#7c3aed', whiteSpace: 'nowrap' }}
                          onClick={() => emulateUser(u)}
                        >
                          {emulatingId === u.id ? 'Starting…' : 'Emulate'}
                        </Btn>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </Table>
      </TableWrap>
      {users.length === 0 && !error && <p style={{ color: '#6b7280' }}>No users found.</p>}
    </>
  )
}
