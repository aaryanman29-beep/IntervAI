import { ArrowLeft, BarChart3, RefreshCw, Sparkles } from "lucide-react"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import FeedbackCard from "../components/feedback/FeedbackCard"
import ImprovementCard from "../components/feedback/ImprovementCard"
import ScoreCard from "../components/feedback/ScoreCard"
import SkillScore from "../components/feedback/SkillScore"
import PageContainer from "../components/layout/PageContainer"
import { mockFeedback } from "../data/mockFeedback"
export default function InterviewResult() {
  return (
    <PageContainer>
      <section className="mb-6 rounded-3xl bg-ink p-7 text-white md:flex md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-soft">
            <Sparkles className="size-4" />
            SESSION COMPLETE
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold">
            Interview Complete
          </h1>
          <p className="mt-2 text-slate-300">
            Excellent work, Alex. Here’s your personalized performance review.
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
        <ScoreCard value={mockFeedback.overall} />
        <Card>
          <h2 className="font-display text-lg font-bold">Skill breakdown</h2>
          <p className="mb-6 text-sm text-muted">
            Scores based on your answers across this interview
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {mockFeedback.skills.map((skill) => (
              <SkillScore key={skill.name} {...skill} />
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <FeedbackCard items={mockFeedback.positives} />
        <ImprovementCard items={mockFeedback.improvements} />
      </div>
      <section className="mt-8">
        <h2 className="font-display text-2xl font-extrabold">Answer review</h2>
        <p className="mt-1 text-sm text-muted">
          Detailed AI feedback for each response
        </p>
        <div className="mt-5 space-y-4">
          {mockFeedback.reviews.map((review, index) => (
            <Card key={review.question}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-primary">
                    QUESTION {index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold">
                    {review.question}
                  </h3>
                </div>
                <span className="rounded-xl bg-primary-soft px-3 py-2 font-display font-extrabold text-primary">
                  {review.score}%
                </span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-muted">
                    Your answer
                  </p>
                  <p className="mt-2 text-sm leading-6">{review.answer}</p>
                </div>
                <div className="rounded-xl bg-primary-soft/60 p-4">
                  <p className="text-xs font-bold uppercase text-primary">
                    AI feedback
                  </p>
                  <p className="mt-2 text-sm leading-6">{review.feedback}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <Button to="/dashboard" variant="ghost" icon={ArrowLeft} className="mt-6">
        Back to Dashboard
      </Button>
    </PageContainer>
  )
}
