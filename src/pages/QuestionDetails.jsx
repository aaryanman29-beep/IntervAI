import { ArrowLeft, Bookmark, Play } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"
import Badge from "../components/common/Badge"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import PageContainer from "../components/layout/PageContainer"
import Details from "../components/questions/QuestionDetails"
import { mockQuestions } from "../data/mockQuestions"
export default function QuestionDetails() {
  const { id } = useParams()
  const question =
    mockQuestions.find((item) => item.id === id) || mockQuestions[0]
  const [saved, setSaved] = useState(question.bookmarked)
  return (
    <PageContainer>
      <Button to="/questions" variant="ghost" icon={ArrowLeft} className="mb-4">
        Back to questions
      </Button>
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
    </PageContainer>
  )
}
