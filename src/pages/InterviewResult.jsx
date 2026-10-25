import { ArrowLeft, BarChart3, LoaderCircle, RefreshCw, Sparkles } from "lucide-react"
import { useParams, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import FeedbackCard from "../components/feedback/FeedbackCard"
import ImprovementCard from "../components/feedback/ImprovementCard"
import ScoreCard from "../components/feedback/ScoreCard"
import SkillScore from "../components/feedback/SkillScore"
import PageContainer from "../components/layout/PageContainer"
import { interviewApi } from "../services/api/interviewApi"
import { useAuth } from "../contexts/AuthContext"
import { usePageMeta } from "../hooks/usePageMeta"
import Breadcrumbs from "../components/layout/Breadcrumbs"

export default function InterviewResult() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [interview, setInterview] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  usePageMeta({
    title: "Interview Performance & Feedback Report",
    description: "Detailed score breakdown, technical evaluation, and recommendations from your AI mock interview session.",
    noIndex: true, // Authenticated private results must not be indexed
  })

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      const [interviewData, questionData, answerData] = await Promise.all([
        interviewApi.getById(id),
        interviewApi.getQuestions(id),
        interviewApi.getAnswers(id).catch(() => []),
      ])

      const answerMap = new Map()
      if (Array.isArray(answerData)) {
        answerData.forEach((a) => {
          if (a?.question?.id) {
            answerMap.set(a.question.id, a)
          }
        })
      }

      const mergedQuestions = (questionData || []).map((q) => {
        const foundAnswer = answerMap.get(q.id) || q.answers?.[0]
        return {
          ...q,
          answers: foundAnswer ? [foundAnswer] : (q.answers || [])
        }
      })

      setInterview(interviewData)
      setQuestions(mergedQuestions)
    } catch (err) {
      setError(err.message || "Failed to load interview results")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) load()
    else navigate("/history")
  }, [id])

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-96 flex-col items-center justify-center gap-4">
          <LoaderCircle className="size-10 animate-spin text-primary" />
          <p className="text-muted">Loading your results...</p>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState message={error} onRetry={load} />
      </PageContainer>
    )
  }

  if (!interview) return null

  const skillBreakdown = [
    { name: "Technical Depth", value: interview.technicalScore ?? 0, score: interview.technicalScore ?? 0 },
    { name: "HR / Correctness", value: interview.hrScore ?? 0, score: interview.hrScore ?? 0 },
    { name: "Communication", value: interview.communicationScore ?? 0, score: interview.communicationScore ?? 0 },
    { name: "Overall", value: interview.overallScore ?? 0, score: interview.overallScore ?? 0 },
  ]

  let positives = []
  let improvements = []
  try {
    positives = JSON.parse(interview.strengths || "[]")
  } catch { positives = [] }
  try {
    improvements = JSON.parse(interview.weakAreas || "[]")
  } catch { improvements = [] }

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "History", href: "/history" },
          { label: `Interview Report #${id}` },
        ]}
      />
      <section className="mb-6 rounded-3xl bg-ink p-7 text-white md:flex md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-soft">
            <Sparkles className="size-4" />
            SESSION COMPLETE
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold">Interview Complete</h1>
          <p className="mt-2 text-slate-300">
            Great work, {user?.name?.split(" ")[0] || "there"}. Here is your personalized performance review.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {interview.targetRole} · {interview.interviewType} · {interview.experienceLevel}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 md:mt-0">
          <Button to="/interview/setup" variant="secondary" icon={RefreshCw}>
            Practice Again
          </Button>
          <Button to="/progress" icon={BarChart3}>
            View Progress
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[.6fr_1.4fr]">
        <ScoreCard value={interview.overallScore ?? 0} />
        <Card>
          <h2 className="font-display text-lg font-bold">Skill breakdown</h2>
          <p className="mb-6 text-sm text-muted">
            Scores based on your answers across this interview
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {skillBreakdown.map((skill) => (
              <SkillScore key={skill.name} {...skill} />
            ))}
          </div>
        </Card>
      </div>

      {(positives.length > 0 || improvements.length > 0) && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {positives.length > 0 && <FeedbackCard items={positives} />}
          {improvements.length > 0 && <ImprovementCard items={improvements} />}
        </div>
      )}

      {questions.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold">Answer review</h2>
          <p className="mt-1 text-sm text-muted">
            Detailed AI feedback for each response
          </p>
          <div className="mt-5 space-y-4">
            {questions.map((question, index) => {
              const answer = question.answers?.[0]
              if (!answer) return null
              return (
                <Card key={question.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-primary">
                        QUESTION {index + 1}
                        {question.isFollowUp && (
                          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                            Follow-up
                          </span>
                        )}
                      </p>
                      <h3 className="mt-2 font-display text-lg font-bold">
                        {question.questionText}
                      </h3>
                    </div>
                    {answer.score != null && (
                      <span className="rounded-xl bg-primary-soft px-3 py-2 font-display font-extrabold text-primary">
                        {answer.score}%
                      </span>
                    )}
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase text-muted">Your answer</p>
                      <p className="mt-2 text-sm leading-6">{answer.answerText}</p>
                    </div>
                    <div className="rounded-xl bg-primary-soft/60 p-4">
                      <p className="text-xs font-bold uppercase text-primary">AI feedback</p>
                      <p className="mt-2 text-sm leading-6">{answer.feedback}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      <Button to="/dashboard" variant="ghost" icon={ArrowLeft} className="mt-6">
        Back to Dashboard
      </Button>
    </PageContainer>
  )
}
