import { Flame } from "lucide-react"
import Card from "../common/Card"
export default function StreakCard() {
  return (
    <Card className="flex items-center gap-4">
      <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-500">
        <Flame />
      </span>
      <div>
        <p className="font-display text-2xl font-extrabold">7 days</p>
        <p className="text-sm text-muted">Current practice streak</p>
      </div>
    </Card>
  )
}
