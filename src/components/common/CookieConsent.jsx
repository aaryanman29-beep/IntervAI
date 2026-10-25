import { useState, useEffect } from "react";
import { Cookie, Settings, Check, X } from "lucide-react";
import Button from "./Button";
import { getConsent, setConsent } from "../../utils/analytics";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("intervai_cookie_consent");
    if (!raw) {
      setVisible(true);
    } else {
      try {
        const parsed = JSON.parse(raw);
        setAnalyticsConsent(!!parsed.analytics);
      } catch {
        setVisible(true);
      }
    }

    const handleReopen = () => {
      setVisible(true);
      setShowPreferences(true);
    };

    window.addEventListener("intervai_open_cookie_preferences", handleReopen);
    return () => window.removeEventListener("intervai_open_cookie_preferences", handleReopen);
  }, []);

  const handleAcceptAll = () => {
    setConsent({ necessary: true, analytics: true });
    setAnalyticsConsent(true);
    setVisible(false);
    setShowPreferences(false);
  };

  const handleRejectOptional = () => {
    setConsent({ necessary: true, analytics: false });
    setAnalyticsConsent(false);
    setVisible(false);
    setShowPreferences(false);
  };

  const handleSaveCustom = () => {
    setConsent({ necessary: true, analytics: analyticsConsent });
    setVisible(false);
    setShowPreferences(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 rounded-3xl border border-line bg-white/95 backdrop-blur-md p-6 card-shadow text-ink page-enter"
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Cookie className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 id="cookie-banner-title" className="font-display font-bold text-base">
            Privacy & Cookie Preferences
          </h2>
          <p id="cookie-banner-desc" className="text-xs text-muted mt-1 leading-relaxed">
            We use strictly necessary storage for authentication (JWT tokens) and optional anonymous analytics to optimize your mock interview prep experience.
          </p>
        </div>
      </div>

      {showPreferences ? (
        <div className="mt-4 space-y-3 rounded-2xl bg-canvas p-4 text-xs border border-line">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-ink">Essential Authentication</span>
              <p className="text-muted text-[11px]">Required for login sessions and security tokens.</p>
            </div>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              Required
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-line">
            <div>
              <span className="font-bold text-ink">Anonymous Analytics</span>
              <p className="text-muted text-[11px]">Helps us analyze user flows and practice trends.</p>
            </div>
            <input
              type="checkbox"
              id="analytics-consent-checkbox"
              checked={analyticsConsent}
              onChange={(e) => setAnalyticsConsent(e.target.checked)}
              className="size-4 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowPreferences(false)}>
              Back
            </Button>
            <Button size="sm" onClick={handleSaveCustom}>
              Save Preferences
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2">
          <Button size="sm" className="flex-1" onClick={handleAcceptAll}>
            Accept All
          </Button>
          <Button size="sm" variant="secondary" className="flex-1" onClick={handleRejectOptional}>
            Reject Optional
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={Settings}
            onClick={() => setShowPreferences(true)}
            aria-label="Customize cookie preferences"
          />
        </div>
      )}
    </div>
  );
}
