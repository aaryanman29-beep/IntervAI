import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '../setupTests'
import CookieConsent from '../components/common/CookieConsent'

describe('CookieConsent Unit & Integration Test', () => {
  beforeEach(() => {
    cleanup()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders cookie consent banner when no preference is stored', () => {
    render(<CookieConsent />)
    expect(screen.getByText(/privacy & cookie preferences/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /accept all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reject optional/i })).toBeInTheDocument()
  })

  it('stores consented preferences and closes the banner upon Accept All', () => {
    render(<CookieConsent />)
    const acceptBtn = screen.getByRole('button', { name: /accept all/i })
    fireEvent.click(acceptBtn)

    expect(screen.queryByText(/privacy & cookie preferences/i)).not.toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem('intervai_cookie_consent') || '{}')
    expect(stored.necessary).toBe(true)
    expect(stored.analytics).toBe(true)
  })

  it('stores minimal preferences upon Reject Optional', () => {
    render(<CookieConsent />)
    const rejectBtn = screen.getByRole('button', { name: /reject optional/i })
    fireEvent.click(rejectBtn)

    expect(screen.queryByText(/privacy & cookie preferences/i)).not.toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem('intervai_cookie_consent') || '{}')
    expect(stored.necessary).toBe(true)
    expect(stored.analytics).toBe(false)
  })
})
