import { Bookmark, Play } from "lucide-react"
import { Link } from "react-router"
import Badge from "../common/Badge"
import Button from "../common/Button"
import Card from "../common/Card"
export default function QuestionCard({ question, onBookmark }) {
  return (
    <Card hover>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{question.category}</Badge>
          <Badge>{question.difficulty}</Badge>
        </div>
        <button
          onClick={() => onBookmark?.(question.id)}
          className={`rounded-lg p-2 ${
            question.bookmarked
              ? "bg-primary-soft text-primary"
              : "text-muted hover:bg-slate-100"
          }`}
          aria-label={
            question.bookmarked ? "Remove bookmark" : "Bookmark question"
          }
        >
          <Bookmark
            className={`size-5 ${question.bookmarked ? "fill-current" : ""}`}
          />
        </button>
      </div>
      <Link
        to={`/questions/${question.id}`}
        className="mt-4 block font-display text-lg font-bold leading-snug hover:text-primary"
      >
        {question.question}
      </Link>
      <p className="mt-2 text-sm text-muted">
        {question.role} · {question.topic}
      </p>
      <Button
        to={`/questions/${question.id}`}
        variant="secondary"
        icon={Play}
        className="mt-5"
      >
        Practice
      </Button>
    </Card>
  )
}
