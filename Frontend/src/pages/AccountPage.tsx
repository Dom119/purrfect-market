import { useEffect, useState } from 'react'
import { authApi, type AuthResponse } from '../api/auth'
import {
  PageContainer,
  Title,
  Subtitle,
  Section,
  SectionTitle,
  Field,
  Label,
  Input,
  ReadOnly,
  Button,
  Message,
} from './AccountPage.styles'

interface AccountPageProps {
  user: AuthResponse | null
  onUserChange: (user: AuthResponse) => void
  onLoginClick?: () => void
}

export function AccountPage({ user, onUserChange, onLoginClick }: AccountPageProps) {
  const [name, setName] = useState('')
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [pwdMsg, setPwdMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (user) setName(user.name)
  }, [user])

  if (!user) {
    return (
      <PageContainer>
        <Title>Account</Title>
        <Subtitle>Sign in to manage your profile and password.</Subtitle>
        <button type="button" onClick={onLoginClick} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
          Log in
        </button>
      </PageContainer>
    )
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg(null)
    const trimmed = name.trim()
    if (!trimmed) {
      setProfileMsg({ type: 'err', text: 'Name cannot be empty.' })
      return
    }
    setSavingProfile(true)
    try {
      const updated = await authApi.updateProfile({ name: trimmed })
      onUserChange(updated)
      setProfileMsg({ type: 'ok', text: 'Profile updated.' })
    } catch (err) {
      setProfileMsg({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not update profile.',
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg(null)
    if (newPassword.length < 8) {
      setPwdMsg({ type: 'err', text: 'New password must be at least 8 characters.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'err', text: 'New passwords do not match.' })
      return
    }
    setSavingPwd(true)
    try {
      const updated = await authApi.changePassword({ currentPassword, newPassword })
      onUserChange(updated)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPwdMsg({ type: 'ok', text: 'Password updated.' })
    } catch (err) {
      setPwdMsg({
        type: 'err',
        text: err instanceof Error ? err.message : 'Could not change password.',
      })
    } finally {
      setSavingPwd(false)
    }
  }

  return (
    <PageContainer>
      <Title>Account</Title>
      <Subtitle>Signed in as {user.email}</Subtitle>

      <Section>
        <SectionTitle>Profile</SectionTitle>
        <form onSubmit={handleSaveProfile}>
          <Field>
            <Label htmlFor="acct-email">Email</Label>
            <ReadOnly id="acct-email">{user.email}</ReadOnly>
          </Field>
          <Field>
            <Label htmlFor="acct-name">Display name</Label>
            <Input
              id="acct-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving…' : 'Save profile'}
          </Button>
          {profileMsg && <Message $variant={profileMsg.type}>{profileMsg.text}</Message>}
        </form>
      </Section>

      <Section>
        <SectionTitle>Change password</SectionTitle>
        <form onSubmit={handleChangePassword}>
          <Field>
            <Label htmlFor="acct-current">Current password</Label>
            <Input
              id="acct-current"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Field>
          <Field>
            <Label htmlFor="acct-new">New password</Label>
            <Input
              id="acct-new"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>
          <Field>
            <Label htmlFor="acct-confirm">Confirm new password</Label>
            <Input
              id="acct-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>
          <Button type="submit" disabled={savingPwd}>
            {savingPwd ? 'Updating…' : 'Update password'}
          </Button>
          {pwdMsg && <Message $variant={pwdMsg.type}>{pwdMsg.text}</Message>}
        </form>
      </Section>
    </PageContainer>
  )
}
