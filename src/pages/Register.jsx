import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import Button from "../components/common/Button"
import { registerUser } from "../services/api"
import { roles } from "../utils/constants"
import { Field } from "./Login"
export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    const form = Object.fromEntries(new FormData(event.currentTarget))
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters.")
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.")
    setLoading(true)
    await registerUser(form)
    navigate("/dashboard")
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
            src={new URL("../assets/intervai-mark.png", import.meta.url).href}
            alt=""
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
            <label className="block text-sm font-semibold">
              Target Role
              <select
                name="role"
                className="mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 font-normal outline-none focus:border-primary"
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
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
