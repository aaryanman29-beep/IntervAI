import { Clock3 } from "lucide-react"
export default function InterviewTimer({ value = "14:32" }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm">
      <Clock3 className="size-4 text-primary" />
      {value}
    </span>
  )
}
