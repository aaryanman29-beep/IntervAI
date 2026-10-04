import { ArrowRight, Clock3, Code2 } from "lucide-react"
import Button from "../common/Button"
import Badge from "../common/Badge"
import Card from "../common/Card"
export default function RecommendedInterview() {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Code2 />
        </span>
        <Badge>Recommended</Badge>
      </div>
      <h2 className="mt-5 font-display text-xl font-bold">Software Engineer</h2>
      <p className="mt-1 text-sm text-muted">Technical Interview</p>
      <div className="my-5 flex flex-wrap gap-2">
        <Badge>Medium</Badge>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <Clock3 className="size-4" />
          20 minutes
        </span>
      </div>
      <Button to="/interview/setup" icon={ArrowRight} className="w-full">
        Start Interview
      </Button>
    </Card>
  )
}
