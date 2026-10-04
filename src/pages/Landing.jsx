import { useEffect, useRef } from "react"
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronRight,
  Code2,
  Sparkles,
  User,
  Zap,
  TrendingUp,
  FileText,
  BarChart3,
  MessageSquareText,
  Target
} from "lucide-react"
import { Link } from "react-router"
import Button from "../components/common/Button"
import { roles } from "../utils/constants"

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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function Landing() {
  useScrollReveal()

  return (
    <div className="min-h-screen bg-canvas font-sans selection:bg-primary-soft selection:text-primary overflow-x-hidden">
      
      {/* FLOATING NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
        <nav className="glass-nav flex items-center justify-between rounded-full px-6 py-3 w-full max-w-6xl shadow-sm transition-all duration-300">
          <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold" aria-label="IntervAI home">
            <img
              src={new URL("../assets/intervai-mark.png", import.meta.url).href}
              alt=""
              className="size-8 rounded-lg object-cover"
            />
            <span className="hidden sm:inline">IntervAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted">
            <a href="#how" className="hover:text-primary transition-colors">How it works</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#roles" className="hover:text-primary transition-colors">Roles</a>
          </div>
          <div className="flex items-center gap-2">
            <Button to="/login" variant="ghost" className="hidden sm:inline-flex rounded-full text-sm font-semibold">
              Sign In
            </Button>
            <Button to="/register" className="rounded-full text-sm px-5 shadow-md shadow-primary/20">
              Start Practicing <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </nav>
      </div>

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 flex flex-col items-center text-center">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>

          <div className="max-w-4xl px-5 relative z-10 reveal">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-primary shadow-sm mb-8 border border-line">
              <Sparkles className="size-4" />
              <span>Your AI-powered interview coach</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-[80px] font-extrabold text-ink leading-[1.05] tracking-tight mb-8">
              Prepare Smarter. <br />
              <span className="text-primary">Interview Better.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice real interview questions, simulate realistic interviews, and get AI-powered feedback to build the confidence to land your next role.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/register" size="lg" icon={ArrowRight} className="rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all px-8 py-4 text-base font-bold">
                Start Practicing
              </Button>
              <Button to="/questions" variant="ghost" size="lg" className="rounded-full px-8 py-4 text-base font-bold bg-white/50 hover:bg-white border border-line">
                Explore Questions
              </Button>
            </div>
          </div>

          {/* FLOATING HERO UI CARDS (Desktop Only) */}
          <div className="relative w-full max-w-6xl mx-auto mt-20 h-[250px] md:h-[450px] reveal reveal-delay-2 hidden md:block">
             
             {/* Card 1: Resume Match */}
             <div className="absolute left-8 top-16 w-64 bg-white p-5 rounded-3xl card-shadow border border-line animate-float-delayed z-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-bold text-muted uppercase tracking-wide">Resume Match</div>
                  <div className="text-success font-bold text-lg">92%</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-ink"><Check className="size-4 text-success"/> Skills detected</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-ink"><Check className="size-4 text-success"/> Experience matched</div>
                  <div className="flex items-center gap-2 text-sm font-medium text-ink"><Check className="size-4 text-success"/> Keywords optimized</div>
                </div>
             </div>

             {/* Card 2: Interview Score */}
             <div className="absolute right-8 top-0 w-60 bg-white p-5 rounded-3xl card-shadow border border-line animate-float z-20">
                <div className="text-xs font-bold text-muted uppercase mb-2 tracking-wide">Overall Score</div>
                <div className="flex items-end gap-2 mb-4">
                  <div className="text-5xl font-display font-extrabold text-primary">87</div>
                  <div className="text-sm font-semibold text-muted mb-2">/ 100</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full w-[87%] rounded-full"></div>
                </div>
                <div className="mt-4 flex justify-between text-xs font-semibold text-muted">
                  <span>Technical</span>
                  <span className="text-ink">91%</span>
                </div>
             </div>

             {/* Card 3: AI Interview Session */}
             <div className="absolute left-1/2 -translate-x-1/2 top-32 w-full max-w-[500px] bg-white p-6 rounded-3xl card-shadow border border-line animate-float-slow z-30">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-line">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                       <BrainCircuit className="size-5" />
                     </div>
                     <div>
                       <div className="font-bold text-ink">AI Interviewer</div>
                       <div className="text-xs text-success font-semibold flex items-center gap-1">
                         <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                         Live Session
                       </div>
                     </div>
                   </div>
                   <div className="text-xs font-bold bg-canvas px-3 py-1.5 rounded-lg text-muted">08:42</div>
                </div>
                <div className="text-primary text-xs font-bold uppercase tracking-wider mb-2">Question 4 of 10</div>
                <div className="text-lg font-display font-bold text-ink leading-snug">
                  "Tell me about a challenging project you worked on and how you solved the problem."
                </div>
             </div>
          </div>
        </section>

        {/* LOGOS / TRUST (Optional visual padding) */}
        <div className="py-10 border-y border-line/50 bg-white/50 text-center text-sm font-bold text-muted tracking-widest uppercase reveal">
          AI-POWERED INTERVIEW PREPARATION
        </div>

        {/* PROBLEM SECTION */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center max-w-3xl mx-auto mb-20 reveal">
               <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-6">
                 Interviews shouldn't be a guessing game.
               </h2>
               <p className="text-lg text-muted">
                 We've completely reimagined how you prepare for your next role.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: "01", title: "Generic Questions", desc: "Practice questions often don't match your actual target role." },
                { num: "02", title: "Limited Feedback", desc: "Knowing an answer was wrong isn't enough. You need to know why." },
                { num: "03", title: "No Follow-Ups", desc: "Real interviewers ask adaptive questions based on your answers." },
                { num: "04", title: "Unclear Roadmap", desc: "Candidates often don't know what to improve next." }
              ].map((item, i) => (
                <div key={item.num} className={`reveal reveal-delay-${i % 4} bg-canvas rounded-3xl p-8 border border-line transition-all hover:shadow-lg hover:-translate-y-1`}>
                   <div className="text-4xl font-display font-extrabold text-primary-soft mb-4 text-primary opacity-40">{item.num}</div>
                   <h3 className="text-xl font-bold text-ink mb-3">{item.title}</h3>
                   <p className="text-muted leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / RESUME ANALYSIS */}
        <section id="how" className="py-24 bg-ink text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-5">
            <div className="mb-20 reveal">
               <div className="text-primary-soft text-sm font-bold uppercase tracking-wider mb-4">How it works</div>
               <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6">
                 From resume to interview-ready.
               </h2>
               <p className="text-slate-400 text-lg max-w-2xl">
                 A simple, repeatable loop designed to make every practice session count.
               </p>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
               <div className="space-y-8 reveal">
                  {[
                    { step: "01", title: "Upload Resume", desc: "IntervAI understands your skills and target roles." },
                    { step: "02", title: "Choose Interview", desc: "Select between Technical, Behavioral, or HR formats." },
                    { step: "03", title: "Practice With AI", desc: "Answer realistic questions with adaptive follow-ups." },
                    { step: "04", title: "Get Evaluated", desc: "Receive AI-powered performance feedback immediately." },
                    { step: "05", title: "Follow Your Roadmap", desc: "Know exactly what to improve next." }
                  ].map((s, i) => (
                     <div key={s.step} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-display font-bold text-lg group-hover:bg-primary transition-colors border border-white/10">
                            {s.step}
                          </div>
                          {i !== 4 && <div className="w-0.5 h-12 bg-white/5 mt-4 group-hover:bg-primary/50 transition-colors"></div>}
                        </div>
                        <div className="pt-2">
                          <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="relative reveal reveal-delay-2 hidden lg:block">
                  <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-sm shadow-2xl relative">
                     <div className="bg-white text-ink rounded-3xl p-6 shadow-2xl relative z-20">
                        <div className="flex justify-between items-center mb-6 border-b border-line pb-4">
                          <div className="font-bold text-lg flex items-center gap-2"><FileText className="size-5 text-primary"/> Resume Analysis</div>
                          <div className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold">92% Match</div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-canvas p-4 rounded-2xl border border-line">
                             <div className="text-xs font-bold text-muted mb-3 uppercase tracking-wide">Skills Found</div>
                             <div className="flex flex-wrap gap-2">
                               {["Java", "Spring Boot", "React", "Python"].map(skill => (
                                 <span key={skill} className="px-3 py-1.5 bg-white border border-line rounded-lg text-sm font-semibold shadow-sm">{skill}</span>
                               ))}
                             </div>
                          </div>
                          <div className="bg-primary-soft/50 p-4 rounded-2xl border border-primary/10">
                             <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">AI Suggestion</div>
                             <p className="text-sm text-ink leading-relaxed">Your backend experience is strong. We recommend generating mock interviews focused on System Design and advanced Spring Boot concepts.</p>
                          </div>
                        </div>
                     </div>
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-[80px] -z-10"></div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* FEATURES / ADAPTIVE FOLLOW-UP SECTION */}
        <section id="features" className="py-24 bg-canvas relative">
           <div className="max-w-7xl mx-auto px-5">
              <div className="text-center max-w-3xl mx-auto mb-20 reveal">
                 <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-6">
                   Practice like it's the real thing.
                 </h2>
                 <p className="text-lg text-muted">
                   IntervAI doesn't just read questions. It listens, analyzes, and asks adaptive follow-ups based on your exact answers.
                 </p>
              </div>

              <div className="max-w-4xl mx-auto reveal reveal-delay-1">
                 <div className="bg-white rounded-[40px] p-6 md:p-12 border border-line card-shadow relative">
                    <div className="absolute -top-4 -right-2 md:-right-4 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <Zap className="size-4 fill-white" /> Adaptive Follow-up
                    </div>

                    <div className="space-y-8">
                       <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white mt-1">
                            <BrainCircuit className="size-5" />
                          </div>
                          <div className="bg-canvas p-5 rounded-2xl rounded-tl-sm text-ink font-medium leading-relaxed">
                            "Why did you choose MongoDB for your last project instead of a relational database?"
                          </div>
                       </div>

                       <div className="flex gap-4 flex-row-reverse">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-muted mt-1">
                            <User className="size-5" />
                          </div>
                          <div className="bg-ink text-white p-5 rounded-2xl rounded-tr-sm font-medium leading-relaxed max-w-[85%]">
                            "I chose MongoDB because our data schema was highly unstructured and rapidly evolving, which allowed us to iterate faster."
                          </div>
                       </div>

                       <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white mt-1">
                            <BrainCircuit className="size-5" />
                          </div>
                          <div className="bg-primary-soft border border-primary/20 p-5 rounded-2xl rounded-tl-sm text-ink font-medium leading-relaxed relative">
                            "Interesting. How would your choice change if the application required strong relational consistency and complex financial transactions?"
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* PERFORMANCE INTELLIGENCE */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-5">
             <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
                <div className="relative reveal order-2 lg:order-1 hidden sm:block">
                   <div className="bg-canvas border border-line rounded-[32px] p-8 card-shadow">
                      <div className="text-center mb-8">
                         <div className="text-muted font-bold text-sm uppercase tracking-wider mb-2">Overall Score</div>
                         <div className="text-[80px] font-display font-extrabold text-primary leading-none">87<span className="text-3xl text-slate-300">/100</span></div>
                      </div>
                      
                      <div className="space-y-6">
                         {[
                           { label: "Technical Knowledge", val: 92 },
                           { label: "Communication", val: 81 },
                           { label: "Confidence", val: 76 },
                           { label: "Problem Solving", val: 89 }
                         ].map(stat => (
                           <div key={stat.label}>
                             <div className="flex justify-between text-sm font-bold mb-2">
                               <span className="text-ink">{stat.label}</span>
                               <span className="text-muted">{stat.val}%</span>
                             </div>
                             <div className="w-full bg-slate-200 rounded-full h-2">
                               <div className="bg-primary h-full rounded-full" style={{ width: `${stat.val}%` }}></div>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="reveal reveal-delay-2 order-1 lg:order-2">
                   <div className="text-primary-soft text-sm font-bold uppercase tracking-wider mb-4 text-primary">Performance Insights</div>
                   <h2 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-6 leading-tight">
                     Know exactly how you performed.
                   </h2>
                   <p className="text-lg text-muted mb-10 leading-relaxed">
                     Turn feedback into progress. Our AI evaluates your answers across multiple dimensions, giving you a clear picture of your strengths and a personalized roadmap for what to study next.
                   </p>
                   
                   <div className="bg-canvas rounded-2xl p-6 border border-line shadow-sm">
                      <div className="flex items-start gap-4">
                         <div className="bg-white p-3 rounded-xl shadow-sm text-primary">
                            <TrendingUp className="size-6" />
                         </div>
                         <div>
                            <h4 className="font-bold text-ink mb-1 text-lg">Next Up: System Design</h4>
                            <p className="text-sm text-muted leading-relaxed">Based on your last interview, we recommend focusing on <span className="font-semibold text-ink">Scalability</span> and <span className="font-semibold text-ink">Load Balancing</span>.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* ROLES */}
        <section id="roles" className="bg-ink py-24 text-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-5 reveal">
            <div className="flex flex-col md:flex-row justify-between gap-6 md:items-end mb-12">
              <div>
                <p className="text-sm font-bold text-primary-soft uppercase tracking-wider mb-2">
                  Popular Roles
                </p>
                <h2 className="font-display text-4xl font-extrabold">
                  Practice for the role you want.
                </h2>
              </div>
              <p className="max-w-md text-slate-400">
                Curated question sets and interview formats built for today's most in-demand careers.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((role, i) => (
                <Link
                  to="/interview/setup"
                  key={role}
                  className={`reveal reveal-delay-${i % 4} group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 font-semibold transition hover:border-primary hover:bg-primary/20 backdrop-blur-sm`}
                >
                  <span className="flex items-center gap-3">
                    <Code2 className="size-5 text-primary-soft" />
                    {role}
                  </span>
                  <ChevronRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 bg-white text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-canvas/50"></div>
           <div className="max-w-3xl mx-auto px-5 relative z-10 reveal">
              <h2 className="font-display text-5xl md:text-6xl font-extrabold text-ink mb-6 leading-tight">
                Ready for your next interview?
              </h2>
              <p className="text-xl text-muted mb-10">
                Stop guessing. Start practicing today.
              </p>
              <Button to="/interview/setup" size="lg" className="rounded-full px-12 py-5 text-lg font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform">
                Start Your Interview <ArrowRight className="ml-2 size-5" />
              </Button>
           </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-line py-16">
         <div className="max-w-7xl mx-auto px-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
               <div className="col-span-2">
                  <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold mb-4 text-ink">
                     <img src={new URL("../assets/intervai-mark.png", import.meta.url).href} alt="" className="size-8 rounded-lg" />
                     IntervAI
                  </Link>
                  <p className="text-sm text-muted max-w-xs leading-relaxed">
                    AI-powered interview preparation designed to build confidence and help you land your next role.
                  </p>
               </div>
               <div>
                  <h4 className="font-bold text-ink mb-4">Product</h4>
                  <ul className="space-y-3 text-sm text-muted">
                     <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                     <li><a href="#how" className="hover:text-primary transition-colors">How It Works</a></li>
                     <li><Link to="/questions" className="hover:text-primary transition-colors">AI Coach</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-ink mb-4">Resources</h4>
                  <ul className="space-y-3 text-sm text-muted">
                     <li><a href="#" className="hover:text-primary transition-colors">Interview Tips</a></li>
                     <li><a href="#" className="hover:text-primary transition-colors">Guides</a></li>
                     <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-ink mb-4">Company</h4>
                  <ul className="space-y-3 text-sm text-muted">
                     <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                     <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                     <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-line pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
               <span>© 2026 IntervAI. Practice with confidence.</span>
               <div className="flex gap-6">
                  <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  )
}
