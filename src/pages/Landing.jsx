import { useEffect, useState } from "react"
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  TrendingUp,
  FileText,
  BarChart3,
  MessageSquareText,
  Target,
  Search,
  Code2,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  Briefcase,
  PlayCircle,
  Users,
  Compass,
  Star,
  BookOpen
} from "lucide-react"
import { Link } from "react-router"
import Button from "../components/common/Button"
import Badge from "../components/common/Badge"
import { roles } from "../utils/constants"
import { usePageMeta } from "../hooks/usePageMeta"
import StructuredData from "../components/common/StructuredData"
import intervaiLogo from "../assets/intervai-mark.webp"

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

const roleTracks = [
  { name: "Software Engineering", icon: Code2, count: "1,200+ questions", slug: "software-engineering", desc: "Algorithms, concurrency, architecture, & coding loops." },
  { name: "System Design", icon: Layers, count: "450+ diagrams", slug: "system-design", desc: "Scalability, microservices, databases, and trade-offs." },
  { name: "Product Management", icon: Compass, count: "800+ cases", slug: "pm", desc: "Product sense, metric design, strategy, and execution." },
  { name: "Machine Learning", icon: Cpu, count: "350+ loops", slug: "ml-engineer", desc: "Deep learning, LLMs, model evaluation, & MLOps." },
  { name: "Data Engineering", icon: Database, count: "400+ scenarios", slug: "data-engineering", desc: "ETL pipelines, data warehousing, SQL, and Kafka." },
  { name: "Behavioral & Leadership", icon: Users, count: "600+ questions", slug: "behavioral", desc: "STAR method, conflict resolution, and culture fit." }
]

const companies = [
  { name: "Google", domain: "google.com" },
  { name: "Meta", domain: "meta.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "OpenAI", domain: "openai.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "Stripe", domain: "stripe.com" },
  { name: "Netflix", domain: "netflix.com" }
]

export default function Landing() {
  useScrollReveal()

  usePageMeta({
    title: "IntervAI · Interview prep for engineering, product, and tech careers",
    description: "Prepare smarter with AI-powered mock interviews, 1,000+ real interview questions, instant answer evaluations, and personalized preparation roadmaps.",
    canonicalPath: "/",
  })

  const [activeCategory, setActiveCategory] = useState("all")

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "IntervAI",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "AI-powered interview preparation platform with simulated mock interviews, voice recording, and personalized scorecards.",
    "publisher": {
      "@type": "Organization",
      "name": "IntervAI Inc.",
      "url": "https://intervai.app"
    }
  }

  return (
    <div id="main-content" className="min-h-screen bg-[#fafafa] font-sans selection:bg-indigo-100 selection:text-indigo-700 text-slate-900">
      <StructuredData data={structuredData} />
      
      {/* ACED-STYLE TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 aced-nav-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="IntervAI home">
              <img
                src={intervaiLogo}
                alt="IntervAI Logo"
                width="36"
                height="36"
                className="w-9 h-9 rounded-xl object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                loading="eager"
              />
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">
                Interv<span className="text-indigo-600">AI</span>
              </span>
              <span className="hidden xl:inline-block text-[11px] font-medium text-slate-400 border-l border-slate-200 pl-2.5">
                AI Tech Prep
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600">
              <Link to="/questions" className="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/70 transition-colors">
                Questions
              </Link>
              <Link to="/interview/setup" className="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/70 transition-colors flex items-center gap-1.5">
                Mock Loops <Badge variant="New" className="text-[10px] px-1.5 py-0">New</Badge>
              </Link>
              <a href="#features" className="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/70 transition-colors">
                AI Coach
              </a>
              <a href="#how" className="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/70 transition-colors">
                How it Works
              </a>
              <Link to="/contact" className="px-3 py-1.5 rounded-md hover:text-slate-900 hover:bg-slate-100/70 transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Header CTAs & Search Trigger */}
          <div className="flex items-center gap-3">
            <Link
              to="/questions"
              className="hidden lg:flex items-center gap-2 border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-400 transition-colors w-44"
            >
              <Search className="size-3.5 text-slate-400" />
              <span className="truncate">Search questions...</span>
              <span className="ml-auto text-[10px] bg-white border border-slate-200 px-1 py-0.5 rounded text-slate-400 font-mono">⌘K</span>
            </Link>

            <Button to="/login" variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-700">
              Log in
            </Button>
            <Button to="/register" size="sm" className="rounded-md font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs">
              Get Started <span className="opacity-70 ml-1">→</span>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION (Clean White, Pill Badge, Large Bold Typo, Role Strip) */}
        <section className="bg-white pt-16 pb-16 md:pt-24 md:pb-20 border-b border-slate-200/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center reveal">
            
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 mb-6 hover:border-slate-300 transition-colors">
              <Sparkles className="size-3.5 text-indigo-600" />
              <span>Next-Gen AI Interview Coaching & Instant Scorecards</span>
              <ChevronRight className="size-3 text-slate-400" />
            </div>

            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6">
              Everything you need to <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ace your tech interviews
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-8">
              Level up your career with AI-powered mock interviews, real interview questions from top tech companies, adaptive follow-ups, and personalized skill roadmaps.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
              <Button to="/register" size="lg" className="w-full sm:w-auto font-semibold px-6 py-3 rounded-lg shadow-sm">
                Get started for free <ArrowRight className="size-4 ml-1.5 opacity-80" />
              </Button>
              <Button to="/questions" variant="secondary" size="lg" className="w-full sm:w-auto font-semibold px-6 py-3 rounded-lg">
                Browse Question Bank
              </Button>
            </div>

            {/* HORIZONTAL ROLE STRIP (Aced-style icon boxes) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-slate-100 text-left">
              {roleTracks.map((track) => {
                const IconComponent = track.icon
                return (
                  <Link
                    key={track.name}
                    to="/interview/setup"
                    className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-slate-50/70 hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <IconComponent className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        {track.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-medium">
                        {track.count}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* TRUSTED SOCIAL PROOF & LOGOS (Aced Style) */}
        <section className="bg-slate-50/80 py-12 border-b border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
              Candidates who practiced on IntervAI have landed offers at top companies
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center justify-center">
              {companies.map((comp) => (
                <div key={comp.name} className="flex items-center justify-center py-2 px-3 bg-white/70 rounded-lg border border-slate-200/60 text-slate-700 font-bold text-sm tracking-tight hover:text-indigo-600 hover:border-indigo-200 transition-all">
                  {comp.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT HIGHLIGHTS (Aced 3-Feature Split Showcase) */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 reveal">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Core Capabilities
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                The all-in-one platform for technical interview mastery
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Designed to simulate the pressure and format of real interview loops with top tech companies.
              </p>
            </div>

            <div className="space-y-16">
              
              {/* Feature 1: Adaptive Mock Loops */}
              <div className="grid md:grid-cols-2 gap-10 items-center reveal">
                <div className="order-2 md:order-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-2">
                    <Zap className="size-4" /> Real-Time Adaptive AI
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-3">
                    Adaptive mock interviews that listen and probe deeper
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Unlike static question checklists, IntervAI parses your exact answers and immediately generates dynamic follow-up questions to test your technical depth, edge cases, and reasoning.
                  </p>
                  <ul className="space-y-2.5 mb-6 text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      Live audio speech-to-text recording with mic detection
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      Dynamic difficulty scaling from Junior to Staff level
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      Contextual follow-ups based on the candidate's exact responses
                    </li>
                  </ul>
                  <Link to="/interview/setup" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
                    Try a mock interview loop →
                  </Link>
                </div>
                
                {/* Visual Card 1 */}
                <div className="order-1 md:order-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm">
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          AI
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">IntervAI Voice Session</div>
                          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Loop · Question 3 of 5
                          </div>
                        </div>
                      </div>
                      <Badge variant="New">System Design</Badge>
                    </div>

                    <div className="text-sm font-semibold text-slate-800 bg-slate-50 p-3.5 rounded-lg border border-slate-200/60 leading-relaxed">
                      "You mentioned utilizing Redis caching in front of PostgreSQL. What eviction policy would you configure and how do you mitigate cache stampede?"
                    </div>

                    <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-indigo-900 font-medium">
                      💡 <strong>AI Evaluator Note:</strong> Listening for mutex locking, probabilistic early expiration (XFetch), or background cache replenishment.
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Instant Multi-Dimensional Scoring */}
              <div className="grid md:grid-cols-2 gap-10 items-center reveal">
                <div className="order-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Scorecard</span>
                      <span className="text-2xl font-display font-extrabold text-indigo-600">88/100</span>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: "Technical Correctness", score: 92, color: "bg-emerald-500" },
                        { label: "Communication Clarity", score: 85, color: "bg-indigo-600" },
                        { label: "System Depth & Edge Cases", score: 88, color: "bg-purple-600" },
                        { label: "Structured Delivery", score: 80, color: "bg-amber-500" }
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                            <span>{item.label}</span>
                            <span>{item.score}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="order-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-2">
                    <BarChart3 className="size-4" /> Granular Feedback
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-3">
                    Actionable scorecards, not vague advice
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Every interview session generates a complete rubric breakdown. IntervAI highlights your exact strong points, identifies blindspots, and creates a tailored study roadmap.
                  </p>
                  <ul className="space-y-2.5 mb-6 text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      Detailed strengths and weaknesses for each answered prompt
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      Optimal reference answer comparison with model scripts
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      Personalized roadmap generation linking relevant resources
                    </li>
                  </ul>
                  <Link to="/questions" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
                    Explore sample evaluations →
                  </Link>
                </div>
              </div>

              {/* Feature 3: Resume Intelligence */}
              <div className="grid md:grid-cols-2 gap-10 items-center reveal">
                <div className="order-2 md:order-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-2">
                    <FileText className="size-4" /> ATS & Skill Matching
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-3">
                    Targeted practice aligned to your real resume
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Upload your PDF resume. IntervAI extracts your technologies, years of experience, and past achievements to curate an interview loop tailored to your career transition.
                  </p>
                  <ul className="space-y-2.5 mb-6 text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      Instant ATS parse score and missing keyword analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      Automatic generation of project-deep-dive interview questions
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-500 shrink-0" />
                      Custom interview simulation based on your selected target role
                    </li>
                  </ul>
                  <Link to="/interview/setup" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
                    Upload resume to start →
                  </Link>
                </div>

                <div className="order-1 md:order-2 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm">
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                        <FileText className="size-4 text-indigo-600" /> Resume Profile
                      </div>
                      <Badge variant="Easy">ATS Score: 88%</Badge>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Detected Core Stack
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {["Java", "Spring Boot", "React", "PostgreSQL", "Docker", "AWS", "System Architecture"].map(tech => (
                          <span key={tech} className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-800 font-medium">
                      ✓ Ready for: Senior Backend Engineer & Cloud Architecture Loops
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* QUESTION BANK SECTION PREVIEW (Aced Style) */}
        <section className="py-20 bg-slate-50 border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Real Interview Questions
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                  Popular questions asked by top tech teams
                </h2>
              </div>
              <Link to="/questions" className="mt-4 md:mt-0 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Browse all questions <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
              {[
                { title: "Design a URL shortener like Bitly", role: "System Design", type: "Architecture", diff: "Medium", count: "142 answers" },
                { title: "Explain how Java Virtual Machine manages garbage collection", role: "Software Engineer", type: "Technical", diff: "Hard", count: "98 answers" },
                { title: "How do you handle a disagreement with a product manager?", role: "Leadership", type: "Behavioral", diff: "Medium", count: "210 answers" },
                { title: "Design a distributed rate limiter for high-traffic microservices", role: "Backend Engineer", type: "Architecture", diff: "Hard", count: "86 answers" },
                { title: "Tell me about a time an outage occurred and how you handled incident response", role: "DevOps / SRE", type: "Behavioral", diff: "Medium", count: "174 answers" },
                { title: "Implement an LRU Cache with O(1) operations", role: "Algorithms", type: "Coding", diff: "Medium", count: "320 answers" }
              ].map((q) => (
                <div key={q.title} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="New">{q.type}</Badge>
                      <Badge>{q.diff}</Badge>
                      <span className="text-xs text-slate-400 font-medium ml-auto">{q.role}</span>
                    </div>
                    <Link to="/questions" className="block text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-snug">
                      {q.title}
                    </Link>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{q.count}</span>
                    <Link to="/questions" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                      Practice <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER (Aced Style) */}
        <section className="bg-white py-20 border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center reveal">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight mb-4">
              Ready to land your dream tech role?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Join thousands of engineers, product managers, and data leaders preparing smarter with IntervAI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button to="/register" size="lg" className="rounded-lg font-semibold px-8 py-3.5 shadow-sm">
                Create your free account →
              </Button>
              <Button to="/questions" variant="secondary" size="lg" className="rounded-lg font-semibold px-6 py-3.5">
                Explore Questions
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER (Clean Aced Style with Categories & Social Links) */}
      <footer className="bg-[#f9fafb] border-t border-slate-200 text-slate-600 text-sm py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-200">
            
            {/* Col 1: Brand Info */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-3 font-display font-extrabold text-xl text-slate-900 group">
                <img
                  src={intervaiLogo}
                  alt="IntervAI Logo"
                  width="32"
                  height="32"
                  className="w-8 h-8 rounded-lg object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                Interv<span className="text-indigo-600">AI</span>
              </Link>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-4">
                The modern AI interview coaching platform for software engineering, system design, and product leadership.
              </p>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="text-xs font-medium text-slate-500">Built for candidate success</span>
              </div>
            </div>

            {/* Col 2: Products */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Preparation</h3>
              <ul className="space-y-2.5">
                <li><Link to="/questions" className="hover:text-slate-900 transition-colors">Question Bank</Link></li>
                <li><Link to="/interview/setup" className="hover:text-slate-900 transition-colors">AI Mock Loops</Link></li>
                <li><Link to="/dashboard" className="hover:text-slate-900 transition-colors">Roadmaps</Link></li>
                <li><Link to="/questions" className="hover:text-slate-900 transition-colors">System Design</Link></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2.5">
                <li><Link to="/contact" className="hover:text-slate-900 transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-slate-900 transition-colors">Feedback</Link></li>
                <li><Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/privacy" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Col 4: Platform */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-2.5">
                <li><Link to="/login" className="hover:text-slate-900 transition-colors">Log In</Link></li>
                <li><Link to="/register" className="hover:text-slate-900 transition-colors">Sign Up</Link></li>
                <li><button type="button" onClick={() => window.dispatchEvent(new CustomEvent("intervai_open_cookie_preferences"))} className="hover:text-slate-900 transition-colors text-left">Cookie Preferences</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>© 2026 IntervAI Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-slate-800 transition-colors">Privacy</Link>
              <Link to="/privacy" className="hover:text-slate-800 transition-colors">Security</Link>
              <Link to="/contact" className="hover:text-slate-800 transition-colors">Contact Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
