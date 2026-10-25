import { usePageMeta } from "../hooks/usePageMeta"
import Breadcrumbs from "../components/layout/Breadcrumbs"
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react"
import { Link } from "react-router"

export default function PrivacyPolicy() {
  usePageMeta({
    title: "Privacy Policy",
    description: "Learn how IntervAI protects your data, resumes, mock interview audio, and account privacy.",
    canonicalPath: "/privacy",
  })

  return (
    <div className="min-h-screen bg-canvas py-16 px-5 font-sans">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        <article className="rounded-3xl border border-line bg-white p-8 md:p-12 card-shadow">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft/50 px-3.5 py-1 text-xs font-bold text-primary mb-4 border border-primary/20">
            <Shield className="size-3.5" />
            <span>Transparency & Security</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink mb-4">
            IntervAI Privacy Policy
          </h1>
          <p className="text-xs text-muted mb-8">
            Last updated: October 25, 2026 · Effective immediately
          </p>

          <div className="space-y-8 text-sm text-ink/90 leading-relaxed">
            <section>
              <h2 className="font-display text-lg font-bold text-ink mb-2 flex items-center gap-2">
                <Lock className="size-4 text-primary" />
                1. Information We Collect
              </h2>
              <p className="text-muted mb-2">
                We collect information directly from you when you register an account, upload a resume for analysis, or conduct mock interview practice sessions.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li><strong>Account Information:</strong> Name, email address, hashed credentials, and optional target job roles.</li>
                <li><strong>Resume Data:</strong> Uploaded PDF files and extracted text used exclusively to customize questions and provide skill assessments.</li>
                <li><strong>Interview Responses:</strong> Recorded audio answers, transcriptions, and AI-generated scorecards.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-ink mb-2 flex items-center gap-2">
                <Eye className="size-4 text-primary" />
                2. How We Use Your Data & AI Processing
              </h2>
              <p className="text-muted mb-2">
                Your data is processed using Google's Gemini API strictly for real-time interview generation and constructive answer evaluation.
              </p>
              <div className="rounded-2xl bg-canvas border border-line p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <CheckCircle2 className="size-4 text-success" />
                  Your resumes and interview answers are never sold to data brokers or third parties.
                </div>
                <div className="flex items-center gap-2 font-bold text-ink">
                  <CheckCircle2 className="size-4 text-success" />
                  We isolate all records by authenticated user ID on the server.
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-ink mb-2 flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                3. Cookies & Consent Preferences
              </h2>
              <p className="text-muted">
                We store only necessary authentication tokens (JWT in client storage). Optional telemetry and anonymous analytics are only activated if you provide explicit consent via our cookie preferences panel. You can update your choices at any time via the cookie settings in the footer.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-bold text-ink mb-2">
                4. Your Rights & Data Deletion
              </h2>
              <p className="text-muted">
                You retain complete ownership over your uploaded resumes and interview recordings. You can delete your resumes or request full account deletion at any time via your <Link to="/profile" className="text-primary font-semibold hover:underline">Profile Settings</Link> or by contacting us at <Link to="/contact" className="text-primary font-semibold hover:underline">Contact Support</Link>.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  )
}
