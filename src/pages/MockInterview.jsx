import {
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle,
  ChevronRight,
  LoaderCircle,
  Send,
  SkipForward,
  Volume2,
  XCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import InterviewProgress from "../components/interview/InterviewProgress"
import InterviewQuestion from "../components/interview/InterviewQuestion"
import InterviewTimer from "../components/interview/InterviewTimer"
import RecordingControls from "../components/interview/RecordingControls"
import PageContainer from "../components/layout/PageContainer"
import { interviewApi } from "../services/api/interviewApi"
import { ErrorState } from "../components/feedback/StateViews"

const AI_STATES = {
  idle: ["Ready", "bg-slate-400"],
  submitting: ["Evaluating your answer...", "bg-amber-500"],
  submitted: ["Answer evaluated", "bg-success"],
  completing: ["Completing interview...", "bg-primary"],
  error: ["Error occurred", "bg-red-500"],
}

export default function MockInterview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const interviewId = searchParams.get("interviewId")

  const [interview, setInterview] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState("")
  const [aiState, setAiState] = useState("idle")
  const [lastEvaluation, setLastEvaluation] = useState(null)
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!interviewId) {
      navigate("/interview/setup")
      return
    }
    loadInterview()
  }, [interviewId])

  const loadInterview = async () => {
    try {
      setLoading(true)
      const [interviewData, questionData] = await Promise.all([
        interviewApi.getById(interviewId),
        interviewApi.getQuestions(interviewId),
      ])
      setInterview(interviewData)
      setQuestions(questionData || [])
    } catch (err) {
      setError(err.message || "Failed to load interview")
    } finally {
      setLoading(false)
    }
  }

  const refreshQuestions = async () => {
    try {
      const updated = await interviewApi.getQuestions(interviewId)
      setQuestions(updated || [])
    } catch {
      // non-critical, keep current questions
    }
  }

  const currentQuestion = questions[currentIdx]
  const isLastQuestion = currentIdx === questions.length - 1
  const hasSubmittedCurrent = submittedQuestions.has(currentQuestion?.id)

  const submitAnswer = async () => {
    if (!answer.trim() || !currentQuestion) return
    setAiState("submitting")
    try {
      const evaluation = await interviewApi.submitAnswer(interviewId, {
        questionId: currentQuestion.id,
        answerText: answer,
      })
      setLastEvaluation(evaluation)
      setAiState("submitted")
      setSubmittedQuestions(prev => new Set([...prev, currentQuestion.id]))
      // Refresh questions in case a follow-up was added
      await refreshQuestions()
    } catch (err) {
      setAiState("error")
      setError(err.message || "Failed to submit answer")
    }
  }

  const nextQuestion = () => {
    setAnswer("")
    setAiState("idle")
    setLastEvaluation(null)
    setCurrentIdx(prev => Math.min(prev + 1, questions.length - 1))
  }

  const completeInterview = async () => {
    setAiState("completing")
    try {
      await interviewApi.complete(interviewId)
      navigate(`/interview/result/${interviewId}`)
    } catch (err) {
      setAiState("error")
      setError(err.message || "Failed to complete interview")
    }
  }

  const [statusText, statusColor] = AI_STATES[aiState] || AI_STATES.idle

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-96 flex-col items-center justify-center gap-4">
          <LoaderCircle className="size-10 animate-spin text-primary" />
          <p className="text-muted">Preparing your interview...</p>
        </div>
      </PageContainer>
    )
  }

  if (error && !questions.length) {
    return (
      <PageContainer>
        <ErrorState message={error} onRetry={loadInterview} />
      </PageContainer>
    )
  }

  if (!questions.length) {
    return (
      <PageContainer>
        <ErrorState message="No questions available for this interview." onRetry={loadInterview} />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Header bar */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-ink p-5 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl font-bold">AI Mock Interview</p>
          <p className="mt-1 text-sm text-slate-300">
            {interview?.targetRole} · {interview?.interviewType}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <InterviewTimer />
          <div className="min-w-40">
            <InterviewProgress
              current={currentIdx + 1}
              total={questions.length}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[.65fr_1.35fr]">
        {/* AI Status Panel */}
        <Card className="flex min-h-96 flex-col items-center justify-center text-center">
          <div className="relative grid size-28 place-items-center rounded-full bg-primary-soft text-primary">
            <BrainCircuit className="size-12" />
            {aiState === "submitting" && (
              <span className="absolute inset-0 animate-ping rounded-full border border-primary/30" />
            )}
          </div>
          <h2 className="mt-5 font-display text-xl font-bold">AI Interviewer</h2>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <span className={`size-2 rounded-full ${statusColor}`} />
            {statusText}
          </p>

          {lastEvaluation && (
            <div className="mt-5 w-full rounded-xl bg-primary-soft p-4 text-left text-sm text-primary">
              <p className="font-bold">Score: {lastEvaluation.score}/100</p>
              <p className="mt-2 leading-6 text-muted">{lastEvaluation.feedback}</p>
            </div>
          )}

          {aiState === "idle" && !lastEvaluation && (
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
              When you are ready, type your response or use the microphone.
            </p>
          )}

          {error && aiState === "error" && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </Card>

        {/* Answer Panel */}
        <Card>
          {currentQuestion && (
            <InterviewQuestion>
              {currentQuestion.questionText}
            </InterviewQuestion>
          )}

          <div className="mt-2 flex gap-2 text-xs text-muted">
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              Q{currentIdx + 1} of {questions.length}
            </span>
            {currentQuestion?.isFollowUp && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                Follow-up
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              {currentQuestion?.difficulty}
            </span>
          </div>

          <label className="mt-7 block text-sm font-semibold">
            Your answer
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="7"
              disabled={hasSubmittedCurrent || aiState === "submitting"}
              placeholder="Type your response here, or use the microphone to record..."
              className="mt-2 w-full resize-none rounded-2xl border border-line bg-slate-50 p-4 font-normal leading-6 outline-none transition focus:border-primary focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <div className="my-6 flex justify-center">
            <RecordingControls
              state={aiState === "submitting" ? "processing" : "idle"}
              onToggle={() => {}}
            />
          </div>

          {aiState === "submitting" && (
            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
              <LoaderCircle className="size-4 animate-spin" />
              Gemini AI is evaluating your response...
            </div>
          )}
          {aiState === "submitted" && (
            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              <Check className="size-4" />
              Answer evaluated — see score on the left panel
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <Button
              variant="ghost"
              disabled={currentIdx === 0}
              onClick={() => {
                setCurrentIdx(prev => prev - 1)
                setAnswer("")
                setAiState("idle")
                setLastEvaluation(null)
              }}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {isLastQuestion && hasSubmittedCurrent ? (
                <Button
                  onClick={completeInterview}
                  loading={aiState === "completing"}
                  disabled={aiState === "completing"}
                  icon={CheckCircle}
                >
                  Finish Interview
                </Button>
              ) : hasSubmittedCurrent ? (
                <Button onClick={nextQuestion} icon={ChevronRight}>
                  Next Question
                </Button>
              ) : (
                <Button
                  onClick={submitAnswer}
                  disabled={!answer.trim() || aiState === "submitting"}
                  loading={aiState === "submitting"}
                  icon={Send}
                >
                  Submit Answer
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
