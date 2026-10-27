import { useState } from "react";
import { Link } from "react-router";
import { Mail, MessageSquare, Send, CheckCircle2, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";
import { usePageMeta } from "../hooks/usePageMeta";
import { useToast } from "../contexts/ToastContext";
import { trackEvent, ConversionEvents } from "../utils/analytics";

export default function Contact() {
  usePageMeta({
    title: "Contact & Support",
    description: "Get in touch with the IntervAI team for technical support, partnership inquiries, or platform feedback.",
    canonicalPath: "/contact",
  });

  const toast = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", consent: false });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Valid email is required";
    }
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters";
    }
    if (!formData.consent) {
      errs.consent = "You must consent to data processing to submit this form";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Unable to submit your inquiry at this moment.");
      }

      setSubmitted(true);
      toast.success("Thank you! Your message has been sent successfully.");
      trackEvent(ConversionEvents.CONTACT_SUBMITTED, { subject: formData.subject });
    } catch (err) {
      toast.error(err.message || "Failed to submit message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-16 px-5 font-sans">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <div className="rounded-3xl border border-line bg-white p-8 md:p-12 card-shadow">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft/50 px-3.5 py-1 text-xs font-bold text-primary mb-4 border border-primary/20">
            <Mail className="size-3.5" />
            <span>Support & Inquiries</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink mb-3">
            Get in touch with us
          </h1>
          <p className="text-muted text-sm md:text-base leading-relaxed mb-8">
            Have questions about AI interview simulations, enterprise licensing, or technical assistance? Send us a message and our team will get back to you promptly.
          </p>

          {submitted ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center text-emerald-950">
              <CheckCircle2 className="size-12 text-emerald-600 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Message Received!</h2>
              <p className="text-sm text-emerald-800 max-w-md mx-auto mb-6">
                Thank you for contacting IntervAI. We have received your inquiry and our engineering support team will respond shortly.
              </p>
              <Button to="/" variant="secondary">
                Return to Home
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    placeholder="Alex Morgan"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                    placeholder="alex@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                  placeholder="Question regarding mock interview evaluation"
                />
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Describe your inquiry or feedback in detail..."
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
              </div>

              {/* Data Processing Consent Checkbox */}
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5">
                <div className="flex items-start gap-2.5">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 size-4 shrink-0 rounded border-line accent-primary cursor-pointer"
                  />
                  <label htmlFor="contact-consent" className="text-xs text-muted leading-relaxed cursor-pointer select-none">
                    I consent to IntervAI collecting and processing my contact details (name, email) and inquiry details to respond to my request in accordance with the{" "}
                    <Link to="/privacy" target="_blank" className="text-primary font-semibold underline hover:text-primary-hover">
                      Privacy Policy
                    </Link>
                    . <span className="text-red-500">*</span>
                  </label>
                </div>
                {errors.consent && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.consent}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                icon={Send}
                className="w-full py-3.5 rounded-xl font-bold shadow-md shadow-primary/20"
              >
                {loading ? "Sending Message..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
