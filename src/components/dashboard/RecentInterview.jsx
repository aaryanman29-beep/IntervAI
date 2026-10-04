import { ChevronRight } from "lucide-react"
import { Link } from "react-router"
import Badge from "../common/Badge"
export default function RecentInterview({ interview }) {
  return (
    <Link
      to={`/interview/result/${interview.id}`}
      className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50"
    >
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft font-bold text-primary">
        {interview.score}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{interview.role}</p>
        <p className="text-xs text-muted">
          {interview.type} · {interview.date}
        </p>
      </div>
      <Badge>{interview.status}</Badge>
      <ChevronRight className="size-4 text-muted" />
    </Link>
  )
}
