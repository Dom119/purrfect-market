import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'
import { ColorThemeProvider } from '../../context/ThemeContext'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('starts in light mode by default and offers to switch to dark', () => {
    render(
      <ColorThemeProvider>
        <ThemeToggle />
      </ColorThemeProvider>
    )
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggles the theme, the html attribute, and persists it to localStorage', async () => {
    render(
      <ColorThemeProvider>
        <ThemeToggle />
      </ColorThemeProvider>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('color-theme')).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })

  it('reads a previously stored theme on mount', () => {
    localStorage.setItem('color-theme', 'dark')
    render(
      <ColorThemeProvider>
        <ThemeToggle />
      </ColorThemeProvider>
    )
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })
})
