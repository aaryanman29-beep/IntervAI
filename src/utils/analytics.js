/**
 * Privacy-preserving conversion & telemetry event tracker.
 * Respects cookie consent and strips sensitive PII (tokens, passwords, resumes).
 */

const STORAGE_KEY = "intervai_cookie_consent";

export const getConsent = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { necessary: true, analytics: false };
  } catch {
    return { necessary: true, analytics: false };
  }
};

export const setConsent = (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    window.dispatchEvent(new CustomEvent("intervai_consent_updated", { detail: preferences }));
  } catch (e) {
    console.error("Failed to persist consent", e);
  }
};

/**
 * Track an analytics event safely.
 * Only sends if user consented to analytics.
 */
export const trackEvent = (eventName, params = {}) => {
  const consent = getConsent();
  if (!consent.analytics) {
    return; // User has not consented to analytics
  }

  // Sanitize params - explicitly prevent tokens, emails, sensitive fields
  const sanitized = { ...params };
  delete sanitized.token;
  delete sanitized.password;
  delete sanitized.jwt;
  delete sanitized.resume;
  delete sanitized.answer;
  delete sanitized.feedback;
  delete sanitized.userEmail;
  delete sanitized.email;

  if (import.meta.env.DEV) {
    console.log(`[Analytics Event] ${eventName}:`, sanitized);
  }

  // Integration with Google Analytics (gtag) if present and consent granted
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, sanitized);
  }
};

// Known high-value business conversion events
export const ConversionEvents = {
  USER_REGISTERED: "user_registered",
  USER_LOGGED_IN: "user_logged_in",
  INTERVIEW_STARTED: "interview_started",
  INTERVIEW_COMPLETED: "interview_completed",
  RESUME_UPLOADED: "resume_uploaded",
  ROADMAP_GENERATED: "roadmap_generated",
  CONTACT_SUBMITTED: "contact_form_submitted",
};
