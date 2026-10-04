import { Trophy } from "lucide-react"
import Card from "../common/Card"
export default function AchievementCard() {
  return (
    <Card className="flex items-center gap-4">
      <span className="grid size-12 place-items-center rounded-2xl bg-amber-50 text-warning">
        <Trophy />
      </span>
      <div>
        <p className="font-display font-bold">Rising Star</p>
        <p className="text-sm text-muted">Completed 10 mock interviews</p>
      </div>
    </Card>
  )
}
