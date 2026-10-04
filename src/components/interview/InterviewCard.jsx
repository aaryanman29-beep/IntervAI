import { Clock3 } from "lucide-react"
import Button from "../common/Button"
import Badge from "../common/Badge"
import Card from "../common/Card"
export default function InterviewCard({
  role,
  type,
  difficulty = "Medium",
  duration = "20 min",
}) {
  return (
    <Card hover>
      <h3 className="font-display text-lg font-bold">{role}</h3>
      <p className="mt-1 text-sm text-muted">{type}</p>
      <div className="my-4 flex items-center justify-between">
        <Badge>{difficulty}</Badge>
        <span className="flex items-center gap-1 text-xs text-muted">
          <Clock3 className="size-4" />
          {duration}
        </span>
      </div>
      <Button to="/interview/mock" className="w-full">
        Start Interview
      </Button>
    </Card>
  )
}
