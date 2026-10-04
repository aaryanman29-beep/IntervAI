import { ArrowRight, Sparkles } from "lucide-react"
import Button from "../common/Button"
export default function WelcomeCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white md:p-8">
      <div className="relative z-10 max-w-2xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
          <Sparkles className="size-3.5 text-violet-300" /> AI-powered coaching
        </span>
        <h1 className="font-display text-2xl font-extrabold md:text-3xl">
          Good morning, Alex
        </h1>
        <p className="mt-2 text-sm text-slate-300 md:text-base">
          Ready to improve your interview skills? Your next breakthrough is one
          practice away.
        </p>
        <Button to="/interview/setup" className="mt-6" icon={ArrowRight}>
          Start a mock interview
        </Button>
      </div>
      <div className="absolute -bottom-20 -right-10 size-64 rounded-full bg-primary/30 blur-3xl" />
    </section>
  )
}
