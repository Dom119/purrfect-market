import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthModal } from './AuthModal'
import { authApi } from '../../api/auth'

vi.mock('../../api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

describe('AuthModal', () => {
  beforeEach(() => {
    vi.mocked(authApi.login).mockReset()
    vi.mocked(authApi.register).mockReset()
  })

  it('renders nothing when closed', () => {
    const { container } = render(<AuthModal isOpen={false} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows email and password fields in login mode by default', () => {
    render(<AuthModal isOpen onClose={() => {}} />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Name')).not.toBeInTheDocument()
  })

  it('switches to register mode and shows the name field', async () => {
    render(<AuthModal isOpen onClose={() => {}} />)
    // "Register" appears both as the tab and as the bottom switch link — the tab is first in the DOM.
    await userEvent.click(screen.getAllByRole('button', { name: 'Register' })[0])
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
  })

  it('submits login credentials and calls onSuccess', async () => {
    const user = { id: 1, email: 'a@b.com', name: 'A' }
    vi.mocked(authApi.login).mockResolvedValue(user)
    const onSuccess = vi.fn()
    const onClose = vi.fn()

    render(<AuthModal isOpen onClose={onClose} onSuccess={onSuccess} />)
    await userEvent.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'secret')
    // "Login" appears both as the tab and as the form's submit button — the submit button is last in the DOM.
    const loginButtons = screen.getAllByRole('button', { name: 'Login' })
    await userEvent.click(loginButtons[loginButtons.length - 1])

    expect(authApi.login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret' })
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledWith(user))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows an error message and keeps the modal open when login fails', async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'))
    const onSuccess = vi.fn()

    render(<AuthModal isOpen onClose={() => {}} onSuccess={onSuccess} />)
    await userEvent.type(screen.getByPlaceholderText('Email'), 'a@b.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrong')
    // "Login" appears both as the tab and as the form's submit button — the submit button is last in the DOM.
    const loginButtons = screen.getAllByRole('button', { name: 'Login' })
    await userEvent.click(loginButtons[loginButtons.length - 1])

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
