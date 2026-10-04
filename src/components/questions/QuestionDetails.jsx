import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react"
import Card from "../common/Card"
export default function QuestionDetails({ question }) {
  const blocks = [
    {
      title: "Expected answer points",
      items: question.points,
      icon: CheckCircle2,
      color: "text-success bg-emerald-50",
    },
    {
      title: "AI coaching tips",
      items: question.tips,
      icon: Lightbulb,
      color: "text-primary bg-primary-soft",
    },
    {
      title: "Common mistakes",
      items: question.mistakes,
      icon: AlertTriangle,
      color: "text-warning bg-amber-50",
    },
  ]
  return (
    <div className="space-y-5">
      {blocks.map(({ title, items, icon: Icon, color }) => (
        <Card key={title}>
          <div className="flex gap-3">
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-xl ${color}`}
            >
              <Icon className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">{title}</h2>
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
