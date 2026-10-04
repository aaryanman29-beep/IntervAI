import { TrendingUp } from "lucide-react"
import Card from "../common/Card"
export default function ImprovementCard({ items }) {
  return (
    <Card>
      <h2 className="font-display text-lg font-bold">Areas to improve</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"
          >
            <TrendingUp className="size-5 shrink-0 text-warning" />
            {item}
          </div>
        ))}
      </div>
    </Card>
  )
}
