import { ArrowLeft, Info, AlertCircle, ShieldCheck, Check } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import Button from "../components/common/Button"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import { usePageMeta } from "../hooks/usePageMeta"
import { trackEvent, ConversionEvents } from "../utils/analytics"
import { roles } from "../utils/constants"
import { Field } from "./Login"

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const toast = useToast()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  usePageMeta({
    title: "Create Account",
    description: "Sign up for IntervAI to build confidence with realistic mock interviews and personalized feedback.",
    canonicalPath: "/register",
  })

  const submit = async (event) => {
    event.preventDefault()
    const form = Object.fromEntries(new FormData(event.currentTarget))
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!._-]).{8,100}$/
    if (!passwordRegex.test(form.password)) {
      const msg = "Password must be at least 8 characters and include uppercase, lowercase, a digit, and a special character."
      setError(msg)
      return toast.warning(msg)
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return toast.warning("Passwords do not match.")
    }
    if (!form.consentTerms || !form.consentData) {
      const msg = "Please accept the Terms of Service and data processing consent to proceed."
      setError(msg)
      return toast.warning(msg)
    }
    
    setLoading(true)
    setError("")
    try {
      await register(form)
      toast.success("Account created successfully! Welcome to IntervAI.")
      trackEvent(ConversionEvents.USER_REGISTERED)
      navigate("/dashboard")
    } catch (err) {
      const msg = err.message || "Failed to register"
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-canvas px-5 py-8">
      <div className="mx-auto max-w-xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
        <section className="rounded-3xl border border-line bg-white p-6 card-shadow md:p-9">
          <img
            src={new URL("../assets/intervai-mark.webp", import.meta.url).href}
            alt="IntervAI brand emblem"
            width="48"
            height="48"
            loading="eager"
            decoding="async"
            className="size-12 rounded-xl object-cover"
          />
          <h1 className="mt-5 font-display text-3xl font-extrabold">
            Create your account
          </h1>
          <p className="mt-2 text-muted">
            Start your personalized interview preparation journey.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <Field label="Full Name" name="name" placeholder="Alex Morgan" />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Password"
                name="password"
                type="password"
                placeholder="8+ characters"
              />
              <Field
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
              />
            </div>
            {/* Modern Helper Callout for Password Requirements */}
            <div className="flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs leading-relaxed text-indigo-950">
              <ShieldCheck className="size-4 shrink-0 text-indigo-600 mt-0.5" />
              <div>
                <span className="font-semibold text-indigo-900">Password requirements:</span>{" "}
                At least 8 characters with uppercase, lowercase, number, and special character{" "}
                <code className="rounded bg-white/90 px-1 py-0.5 font-mono text-[11px] text-indigo-700 border border-indigo-200/50">
                  @$!%*?&#^()_-+=
                </code>
              </div>
            </div>

            <label className="block text-sm font-semibold">
              Target Role
              <select
                name="role"
                className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 font-normal outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10"
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>

            {/* Consumer Data Processing & Terms Consent Checkboxes */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Consumer Consent & Agreement</p>
              
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <input
                  type="checkbox"
                  id="register-consent-terms"
                  name="consentTerms"
                  required
                  className="mt-0.5 size-4 shrink-0 rounded border-line accent-primary cursor-pointer"
                />
                <label htmlFor="register-consent-terms" className="cursor-pointer select-none leading-relaxed">
                  I agree to IntervAI's{" "}
                  <Link to="/privacy" target="_blank" className="font-semibold text-primary underline hover:text-primary-hover">
                    Terms of Service
                  </Link>{" "}
                  and acknowledge the{" "}
                  <Link to="/privacy" target="_blank" className="font-semibold text-primary underline hover:text-primary-hover">
                    Privacy Policy
                  </Link>
                  . <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <input
                  type="checkbox"
                  id="register-consent-data"
                  name="consentData"
                  required
                  className="mt-0.5 size-4 shrink-0 rounded border-line accent-primary cursor-pointer"
                />
                <label htmlFor="register-consent-data" className="cursor-pointer select-none leading-relaxed">
                  I consent to IntervAI collecting and processing my profile information, interview responses, and performance evaluations to generate AI scores and personalized coaching roadmaps. <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-800 shadow-xs animate-in fade-in">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
