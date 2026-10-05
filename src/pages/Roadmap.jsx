import { Map, LoaderCircle, RefreshCw } from "lucide-react"
import { useState } from "react"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import PageContainer from "../components/layout/PageContainer"
import { useAsync } from "../hooks/useAsync"
import { dashboardApi } from "../services/api/dashboardApi"
import { EmptyState, ErrorState } from "../components/feedback/StateViews"

const priorityColors = {
  HIGH: "text-red-600 bg-red-50",
  MEDIUM: "text-amber-600 bg-amber-50",
  LOW: "text-green-600 bg-green-50",
}

export default function Roadmap() {
  const { data, loading, error, refetch } = useAsync(() => dashboardApi.getRoadmap())
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState("")

  const handleGenerate = async () => {
    setGenerating(true)
    setGenerateError("")
    try {
      await dashboardApi.generateRoadmap({
        targetRole: "Software Engineer",
        skills: "JavaScript, React",
        weakAreas: "System Design, Algorithms",
      })
      refetch()
    } catch (err) {
      setGenerateError(err.message || "Failed to generate roadmap")
    } finally {
      setGenerating(false)
    }
  }

  let roadmapItems = []
  try {
    roadmapItems = Array.isArray(data) ? data : []
  } catch {
    roadmapItems = []
  }

  return (
    <PageContainer
      title="Learning Roadmap"
      description="Your personalized AI-generated learning plan based on performance insights."
      action={
        <Button
          variant="secondary"
          onClick={handleGenerate}
          loading={generating}
          disabled={generating}
          icon={RefreshCw}
        >
          Regenerate
        </Button>
      }
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <LoaderCircle className="size-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : roadmapItems.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No roadmap yet"
          description="Complete an interview to generate your personalized learning roadmap."
          action={
            <div className="flex flex-col items-center gap-3">
              <Button to="/interview/setup">Start an Interview</Button>
              <Button
                variant="ghost"
                onClick={handleGenerate}
                loading={generating}
                disabled={generating}
              >
                Or generate now
              </Button>
            </div>
          }
        />
      ) : (
        <div className="space-y-4">
          {generateError && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{generateError}</p>
          )}
          {roadmapItems.map((item) => {
            let resources = []
            try {
              resources = JSON.parse(item.recommendedResources || "[]")
            } catch {
              resources = []
            }
            return (
              <Card key={item.id || item.topic}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold">{item.topic}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityColors[item.priority] || "text-muted bg-slate-100"}`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                    {resources.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase text-muted">
                          Recommended Resources
                        </p>
                        <ul className="mt-2 space-y-1">
                          {resources.map((r, i) => (
                            <li key={i} className="text-sm text-primary underline-offset-2 hover:underline">
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-muted">
                      {item.status || "NOT_STARTED"}
                    </span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}

export { Roadmap }
