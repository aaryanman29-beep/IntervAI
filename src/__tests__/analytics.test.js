import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initAnalytics, trackEvent } from '../utils/analytics'

describe('Analytics Utility Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    delete window.dataLayer
    delete window.gtag
  })

  it('does not send events when user has not consented', () => {
    const pushSpy = vi.fn()
    window.dataLayer = { push: pushSpy }

    trackEvent('test_event', { key: 'value' })
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('sends events when analytics consent is granted', () => {
    localStorage.setItem(
      'intervai_cookie_consent',
      JSON.stringify({ analytics: true, functional: true, timestamp: Date.now() })
    )

    const gtagSpy = vi.fn()
    window.gtag = gtagSpy

    trackEvent('interview_started', { role: 'Frontend Engineer' })
    expect(gtagSpy).toHaveBeenCalledWith('event', 'interview_started', expect.objectContaining({
      role: 'Frontend Engineer'
    }))
  })

  it('redacts sensitive PII and password patterns', () => {
    localStorage.setItem(
      'intervai_cookie_consent',
      JSON.stringify({ analytics: true, functional: true, timestamp: Date.now() })
    )

    const gtagSpy = vi.fn()
    window.gtag = gtagSpy

    trackEvent('auth_event', {
      userEmail: 'user@example.com',
      password: 'superSecretPassword123!',
      token: 'jwt.token.here',
      targetRole: 'Backend Developer'
    })

    expect(gtagSpy).toHaveBeenCalledWith(
      'event',
      'auth_event',
      expect.not.objectContaining({
        userEmail: expect.anything(),
        password: expect.anything(),
        token: expect.anything()
      })
    )
    expect(gtagSpy).toHaveBeenCalledWith(
      'event',
      'auth_event',
      expect.objectContaining({
        targetRole: 'Backend Developer'
      })
    )
  })
})
