import { Bookmark, Play, CheckCircle2, Building2 } from "lucide-react"
import { Link } from "react-router"
import Badge from "../common/Badge"
import Button from "../common/Button"
import Card from "../common/Card"

export default function QuestionCard({ question, onBookmark }) {
  return (
    <Card hover className="flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="New">{question.category || "General"}</Badge>
            <Badge>{question.difficulty || "Medium"}</Badge>
            {question.topic && (
              <span className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-50 rounded-md border border-slate-200/60">
                {question.topic}
              </span>
            )}
          </div>
          <button
            onClick={() => onBookmark?.(question.id)}
            className={`rounded-lg p-2 transition-colors ${
              question.bookmarked
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            }`}
            aria-label={
              question.bookmarked ? "Remove bookmark" : "Bookmark question"
            }
          >
            <Bookmark
              className={`size-4 ${question.bookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>

        <Link
          to={`/questions/${question.id}`}
          className="block font-display text-base md:text-lg font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors"
        >
          {question.question}
        </Link>
        
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Building2 className="size-3.5 text-slate-400" />
          <span>{question.role || "Target Role"}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          AI Feedback Ready
        </span>
        <Button
          to={`/questions/${question.id}`}
          variant="secondary"
          size="sm"
          icon={Play}
          className="rounded-md hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
        >
          Practice
        </Button>
      </div>
    </Card>
  )
}
