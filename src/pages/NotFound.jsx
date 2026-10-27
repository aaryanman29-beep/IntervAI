import { ArrowLeft, Home, Search, Compass, BookOpen, Sparkles } from "lucide-react"
import { Link } from "react-router"
import Button from "../components/common/Button"
import { usePageMeta } from "../hooks/usePageMeta"

export default function NotFound() {
  usePageMeta({
    title: "Page Not Found (404)",
    description: "The page you are looking for does not exist or has been moved.",
    noIndex: true,
  })

  return (
    <main
      className="grid min-h-screen place-items-center bg-canvas p-6 text-center font-sans"
      role="main"
      aria-labelledby="not-found-heading"
    >
      <div className="max-w-lg w-full rounded-3xl border border-line bg-white p-8 md:p-12 card-shadow">
        <img
          src={new URL("../assets/intervai-mark.webp", import.meta.url).href}
          alt="IntervAI brand emblem"
          width="64"
          height="64"
          loading="eager"
          decoding="async"
          className="mx-auto size-16 rounded-2xl object-cover shadow-sm"
        />

        <p className="mt-6 font-display text-7xl font-extrabold text-primary tracking-tight">
          404
        </p>

        <h1 id="not-found-heading" className="mt-3 font-display text-2xl md:text-3xl font-extrabold text-ink">
          {"This question isn't on the syllabus"}
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm text-muted leading-relaxed">
          {"The page you're looking for doesn't exist or might have been relocated. Jump back into your interview preparation using the links below."}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button to="/" icon={Home} className="w-full sm:w-auto font-bold rounded-xl shadow-md shadow-primary/20">
            Go to Home
          </Button>
          <Button to="/dashboard" variant="secondary" icon={Compass} className="w-full sm:w-auto font-bold rounded-xl">
            Go to Dashboard
          </Button>
        </div>

        {/* Helpful public sections */}
        <div className="mt-8 pt-6 border-t border-line text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Helpful public resources
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              to="/questions"
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-canvas text-ink font-semibold transition-colors"
            >
              <BookOpen className="size-4 text-primary" />
              <span>Question Bank</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-canvas text-ink font-semibold transition-colors"
            >
              <Search className="size-4 text-primary" />
              <span>Contact Support</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-canvas text-ink font-semibold transition-colors"
            >
              <Sparkles className="size-4 text-primary" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-canvas text-ink font-semibold transition-colors"
            >
              <ArrowLeft className="size-4 rotate-180 text-primary" />
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
