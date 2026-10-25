import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import '../setupTests'
import { MemoryRouter } from 'react-router'
import Contact from '../pages/Contact'
import { ToastProvider } from '../contexts/ToastContext'

describe('Contact Page Integration Test', () => {
  beforeEach(() => {
    cleanup()
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the contact form with all required inputs and headings', () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <Contact />
        </ToastProvider>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/get in touch/i)
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('validates required fields before allowing submission', async () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <Contact />
        </ToastProvider>
      </MemoryRouter>
    )

    const submitBtn = screen.getByRole('button', { name: /send message/i })
    fireEvent.click(submitBtn)

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/valid email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/subject is required/i)).toBeInTheDocument()
    expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
  })
})
