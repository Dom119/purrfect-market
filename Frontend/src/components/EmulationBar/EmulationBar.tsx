import styled from 'styled-components'
import type { AuthResponse } from '../../api/auth'
import { authApi } from '../../api/auth'

interface EmulationBarProps {
  emulatedUser: AuthResponse
  originalAdmin: AuthResponse
  onStop: (restoredAdmin: AuthResponse) => void
}

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 2000;
  background: #b45309;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.55rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  text-align: center;
`

const StopBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: rgba(255, 255, 255, 0.3); }
`

export function EmulationBar({ emulatedUser, originalAdmin, onStop }: EmulationBarProps) {
  const handleStop = async () => {
    try {
      const admin = await authApi.stopEmulation()
      onStop(admin)
    } catch {
      // fallback: reload page which will re-check session
      window.location.href = '/admin/users'
    }
  }

  return (
    <Bar role="alert">
      ⚠ <strong>{originalAdmin.name}</strong> is emulating <strong>{emulatedUser.name}</strong> ({emulatedUser.email}) — actions are performed as this user
      <StopBtn type="button" onClick={handleStop}>Stop emulating</StopBtn>
    </Bar>
  )
}
