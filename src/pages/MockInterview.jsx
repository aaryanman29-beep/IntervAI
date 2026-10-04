import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  LoaderCircle,
  Send,
  SkipForward,
  Volume2,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import InterviewProgress from "../components/interview/InterviewProgress"
import InterviewQuestion from "../components/interview/InterviewQuestion"
import InterviewTimer from "../components/interview/InterviewTimer"
import RecordingControls from "../components/interview/RecordingControls"
import PageContainer from "../components/layout/PageContainer"
import { submitAnswer } from "../services/api"
const states = {
  idle: ["Ready", "bg-slate-400"],
  recording: ["Listening", "bg-red-500"],
  processing: ["Thinking", "bg-amber-500"],
  submitted: ["Answer saved", "bg-success"],
}
export default function MockInterview() {
  const navigate = useNavigate()
  const [state, setState] = useState("idle")
  const [answer, setAnswer] = useState("")
  const toggle = () =>
    setState(state === "recording" ? "processing" : "recording")
  const submit = async () => {
    setState("processing")
    await submitAnswer(answer)
    setState("submitted")
  }
  const [status, color] = states[state]
  return (
    <PageContainer>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-ink p-5 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl font-bold">AI Mock Interview</p>
          <p className="mt-1 text-sm text-slate-300">
            Software Engineer · Behavioral
          </p>
        </div>
        <div className="flex items-center gap-4">
          <InterviewTimer />
          <div className="min-w-40">
            <InterviewProgress />
          </div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[.65fr_1.35fr]">
        <Card className="flex min-h-96 flex-col items-center justify-center text-center">
          <div className="relative grid size-28 place-items-center rounded-full bg-primary-soft text-primary">
            <BrainCircuit className="size-12" />
            {state === "recording" && (
              <span className="absolute inset-0 animate-ping rounded-full border border-primary/30" />
            )}
          </div>
          <h2 className="mt-5 font-display text-xl font-bold">
            AI Interviewer
          </h2>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <span className={`size-2 rounded-full ${color}`} />
            {status}
          </p>
          <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
            {state === "recording"
              ? "I’m listening. Take your time and structure your answer clearly."
              : state === "processing"
                ? "Reviewing the structure and content of your response..."
                : "When you’re ready, begin your response below."}
          </p>
          <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Volume2 className="size-4" />
            Repeat question
          </button>
        </Card>
        <Card>
          <InterviewQuestion>
            Tell me about a challenging project you worked on and how you solved
            the problem.
          </InterviewQuestion>
          <label className="mt-7 block text-sm font-semibold">
            Your answer
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows="7"
              placeholder="Type your response here, or use the microphone to record..."
              className="mt-2 w-full resize-none rounded-2xl border border-line bg-slate-50 p-4 font-normal leading-6 outline-none transition focus:border-primary focus:bg-white"
            />
          </label>
          <div className="my-6 flex justify-center">
            <RecordingControls state={state} onToggle={toggle} />
          </div>
          {state === "processing" && (
            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
              <LoaderCircle className="size-4 animate-spin" />
              Processing your response...
            </div>
          )}
          {state === "submitted" && (
            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              <Check className="size-4" />
              Answer submitted successfully
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <Button variant="ghost" icon={ArrowLeft}>
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" icon={SkipForward}>
                Skip
              </Button>
              {state === "submitted" ? (
                <Button
                  onClick={() => navigate("/interview/result/int-new")}
                  icon={ArrowRight}
                >
                  Finish interview
                </Button>
              ) : (
                <Button
                  onClick={submit}
                  disabled={!answer || state === "processing"}
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
