import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronRight,
  Code2,
  MessageSquareText,
  Sparkles,
  Target,
} from "lucide-react"
import { Link } from "react-router"
import Button from "../components/common/Button"
import { roles } from "../utils/constants"

const features = [
  {
    icon: BrainCircuit,
    title: "AI Mock Interviews",
    text: "Practice realistic conversations in a focused, pressure-free environment.",
  },
  {
    icon: MessageSquareText,
    title: "Personalized Feedback",
    text: "Get practical coaching on structure, clarity, confidence, and content.",
  },
  {
    icon: Target,
    title: "Role-Specific Questions",
    text: "Prepare with curated questions tailored to the jobs you want.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    text: "See your progress clearly and know exactly what to improve next.",
  },
]
export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-amber-50">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-xl font-extrabold"
          aria-label="IntervAI home"
        >
          <img
            src={
              new URL("../assets/intervai-mark.png", import.meta.url).href
            }
            alt=""
            className="size-12 rounded-xl object-cover"
          />
          <span>IntervAI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#features" className="hover:text-ink">
            Features
          </a>
          <a href="#how" className="hover:text-ink">
            How it works
          </a>
          <a href="#roles" className="hover:text-ink">
            Roles
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button to="/login" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button to="/register">Get started</Button>
        </div>
      </header>
      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="size-4" />
              Your AI interview coach
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
              Prepare Smarter.
              <br />
              <span className="text-primary">Interview Better.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Practice real interview questions, simulate realistic interviews,
              and get AI-powered feedback to improve your performance.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/register" icon={ArrowRight}>
                Start Practicing
              </Button>
              <Button to="/questions" variant="secondary">
                Explore Questions
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {[
                "No credit card",
                "Personalized practice",
                "Actionable feedback",
              ].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Check className="size-4 text-success" />
                  {text}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-16 -z-10 rounded-full bg-primary-soft/70 blur-3xl" />
            <div className="rotate-1 rounded-3xl border border-line bg-white p-5 card-shadow">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-primary text-white">
                    <BrainCircuit />
                  </span>
                  <div>
                    <p className="font-semibold">AI Interviewer</p>
                    <p className="text-xs text-success">Live session</p>
                  </div>
                </div>
                <span className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold">
                  08:42
                </span>
              </div>
              <div className="py-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Question 4 of 10
                </span>
                <h2 className="mt-3 font-display text-xl font-bold leading-snug">
                  Tell me about a challenging project you worked on and how you
                  solved the problem.
                </h2>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-muted">
                  I led the redesign of our checkout experience. First, I
                  aligned the team on measurable goals, then...
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500" />
                    <span className="text-xs font-semibold text-muted">
                      Recording answer
                    </span>
                  </div>
                  <Button className="min-h-9 px-3 py-1.5 text-xs">
                    Submit answer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="bg-canvas py-20">
          <div className="mx-auto max-w-7xl px-5">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold text-primary">
                EVERYTHING YOU NEED
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
                Practice with purpose
              </h2>
              <p className="mt-4 text-muted">
                Build the skills and confidence to show up as your best self.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <Icon />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="how" className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="text-sm font-bold text-primary">HOW IT WORKS</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold">
                From practice to confident in five steps.
              </h2>
              <p className="mt-4 leading-7 text-muted">
                A simple, repeatable loop designed to make every practice
                session count.
              </p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {[
                "Choose your role",
                "Start an interview",
                "Answer questions",
                "Get AI feedback",
                "Improve your skills",
              ].map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-4 rounded-2xl border border-line p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="font-semibold">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section id="roles" className="bg-ink py-20 text-white">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold text-violet-300">
                  POPULAR ROLES
                </p>
                <h2 className="mt-3 font-display text-3xl font-extrabold">
                  Practice for the role you want.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-300">
                Curated question sets and interview formats built for today's
                most in-demand careers.
              </p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((role) => (
                <Link
                  to="/interview/setup"
                  key={role}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 font-semibold transition hover:border-primary hover:bg-primary/20"
                >
                  <span className="flex items-center gap-3">
                    <Code2 className="size-5 text-violet-300" />
                    {role}
                  </span>
                  <ChevronRight className="size-4 text-slate-400 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-5 py-20">
          <div className="rounded-3xl bg-primary px-6 py-12 text-center text-white md:px-12">
            <h2 className="font-display text-3xl font-extrabold">
              Ready for your next interview?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-violet-100">
              Turn interview anxiety into a clear plan. Start practicing today.
            </p>
            <Button
              to="/interview/setup"
              className="landing-cta-domine mt-7 bg-white hover:bg-slate-50"
            >
              Start Your Interview
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-line px-5 py-8 text-center text-sm text-muted">
        © 2026 IntervAI. Practice with confidence.
      </footer>
    </div>
  )
}
