import { CheckCircle2 } from "lucide-react"
import Card from "../common/Card"
export default function FeedbackCard({ items, title = "What you did well" }) {
  return (
    <Card>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex gap-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"
          >
            <CheckCircle2 className="size-5 shrink-0 text-success" />
            {item}
          </div>
        ))}
      </div>
    </Card>
  )
}
