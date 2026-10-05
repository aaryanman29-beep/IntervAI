import { ArrowLeft, Bookmark, Play } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams } from "react-router"
import Badge from "../components/common/Badge"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import PageContainer from "../components/layout/PageContainer"
import Details from "../components/questions/QuestionDetails"
import StateViews from "../components/common/StateViews"
import { interviewApi } from "../services/api/interviewApi"
import { useAsync } from "../hooks/useAsync"

export default function QuestionDetails() {
  const { id } = useParams()
  
  const { execute, status, value: fetchedQuestion, error } = useAsync(() => interviewApi.getQuestion(id))
  const [question, setQuestion] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    execute()
  }, [execute])

  useEffect(() => {
    if (fetchedQuestion?.data) {
      const q = fetchedQuestion.data
      setQuestion({
        id: q.id,
        question: q.questionText,
        category: q.questionType,
        difficulty: q.difficulty,
        topic: q.topic,
        role: q.interview?.targetRole || "Practice Question",
        bookmarked: false,
        answer: "This is a placeholder example answer since you are viewing a past question.",
        keyPoints: [
          "Explain your thought process",
          "Highlight your problem-solving skills",
          "Provide a concrete example"
        ]
      })
    }
  }, [fetchedQuestion])

  return (
    <PageContainer>
      <Button to="/questions" variant="ghost" icon={ArrowLeft} className="mb-4">
        Back to questions
      </Button>
      <StateViews
        status={status}
        error={error}
        isEmpty={!question}
        emptyMessage="Question not found."
      >
        {question && (
          <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <div className="space-y-5">
              <Card>
                <div className="flex flex-wrap gap-2">
                  <Badge>{question.category}</Badge>
                  <Badge>{question.difficulty}</Badge>
                  <Badge>{question.role}</Badge>
                </div>
                <h1 className="mt-5 font-display text-2xl font-extrabold leading-snug md:text-3xl">
                  {question.question}
                </h1>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button to="/interview/mock" icon={Play}>
                    Practice This Question
                  </Button>
                  <Button
                    variant="secondary"
                    icon={Bookmark}
                    onClick={() => setSaved(!saved)}
                  >
                    {saved ? "Bookmarked" : "Bookmark"}
                  </Button>
                </div>
              </Card>
              <Card>
                <h2 className="font-display text-lg font-bold">Example answer</h2>
                <p className="mt-3 leading-7 text-muted">{question.answer}</p>
                <p className="mt-4 text-xs text-muted">
                  Use this as a guide—not a script. Your answer should reflect your
                  own experience.
                </p>
              </Card>
            </div>
            <Details question={question} />
          </div>
        )}
      </StateViews>
    </PageContainer>
  )
}
