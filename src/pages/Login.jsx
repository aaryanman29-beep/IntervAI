import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import Button from "../components/common/Button"
import { loginUser } from "../services/api"

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    await loginUser(Object.fromEntries(new FormData(event.currentTarget)))
    navigate("/dashboard")
  }
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <div className="mb-8">
            <img
              src={new URL("../assets/intervai-mark.png", import.meta.url).href}
              alt=""
              className="size-12 rounded-xl object-cover"
            />
            <h1 className="mt-6 font-display text-3xl font-extrabold">
              Welcome back
            </h1>
            <p className="mt-2 text-muted">
              Sign in to continue your interview preparation.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-5">
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" className="size-4 accent-primary" />
                Remember me
              </label>
              <button type="button" className="font-semibold text-primary">
                Forgot password?
              </button>
            </div>
            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>
          <p className="mt-7 text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary">
              Create one
            </Link>
          </p>
        </div>
      </section>
      <AuthPanel />
    </div>
  )
}
export function Field({ label, ...props }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        required
        className="mt-2 min-h-12 w-full rounded-xl border border-line px-4 font-normal outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10"
        {...props}
      />
    </label>
  )
}
function AuthPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-center">
      <div className="relative z-10 mx-auto max-w-lg">
        <span className="text-sm font-bold text-violet-300">
          PRACTICE. LEARN. GROW.
        </span>
        <h2 className="mt-5 font-display text-4xl font-extrabold leading-tight">
          A better interview starts with better practice.
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Join thousands of candidates building confidence through focused,
          AI-powered preparation.
        </p>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-lg leading-8">
            “The feedback made my answers sharper after just three sessions. I
            walked into my interview knowing exactly what to improve.”
          </p>
          <p className="mt-4 text-sm font-semibold text-violet-200">
            Maya · Frontend Engineer
          </p>
        </div>
      </div>
      <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-primary/40 blur-3xl" />
    </section>
  )
}
