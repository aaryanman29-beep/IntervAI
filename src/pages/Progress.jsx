import { Award, BarChart3, Clock3, LoaderCircle, Map, Target, TrendingUp } from "lucide-react"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import PageContainer from "../components/layout/PageContainer"
import PerformanceChart from "../components/progress/PerformanceChart"
import SkillBreakdown from "../components/progress/SkillBreakdown"
import AchievementCard from "../components/progress/AchievementCard"
import StreakCard from "../components/progress/StreakCard"
import { ErrorState, EmptyState } from "../components/feedback/StateViews"
import { useAsync } from "../hooks/useAsync"
import { dashboardApi } from "../services/api/dashboardApi"
import { interviewApi } from "../services/api/interviewApi"

export default function Progress() {
  const { data: dashData, loading, error, refetch } = useAsync(() => dashboardApi.getDashboard())
  const { data: interviews } = useAsync(() => interviewApi.getAll())

  const completed = (interviews || []).filter(i => i.status === "COMPLETED")

  // Build category breakdown from completed interviews
  const categoryMap = {}
  completed.forEach((i) => {
    const key = i.interviewType || "OTHER"
    categoryMap[key] = (categoryMap[key] || 0) + 1
  })
  const COLORS = { TECHNICAL: "#6366f1", HR: "#22c55e", BEHAVIORAL: "#f59e0b", OTHER: "#94a3b8" }
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name, value, fill: COLORS[name] || "#94a3b8"
  }))

  const insights = dashData
    ? [
        {
          label: "Overall readiness",
          value: `${dashData.overallScore ?? 0}%`,
          note: `${dashData.totalInterviews ?? 0} interviews total`,
          icon: Target,
        },
        {
          label: "Technical score",
          value: `${dashData.technicalScore ?? 0}%`,
          note: "Depth & accuracy",
          icon: Award,
        },
        {
          label: "Communication",
          value: `${dashData.communicationScore ?? 0}%`,
          note: "Clarity & structure",
          icon: TrendingUp,
        },
        {
          label: "Sessions completed",
          value: String(dashData.totalInterviews ?? 0),
          note: "Total interviews",
          icon: Clock3,
        },
      ]
    : []

  if (loading) {
    return (
      <PageContainer
        title="Your Progress"
        description="Track your growth, uncover patterns, and focus your next practice session."
      >
        <div className="flex min-h-64 items-center justify-center">
          <LoaderCircle className="size-10 animate-spin text-primary" />
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer title="Your Progress" description="Track your growth.">
        <ErrorState message={error} onRetry={refetch} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Your Progress"
      description="Track your growth, uncover patterns, and focus your next practice session."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map(({ label, value, note, icon: Icon }) => (
          <Card key={label} hover>
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-5" />
            </span>
            <p className="mt-4 text-sm text-muted">{label}</p>
            <p className="mt-1 font-display text-xl font-extrabold">{value}</p>
            <p className="mt-1 text-xs font-semibold text-success">{note}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <PerformanceChart title="Interview score trend" interviews={completed} />
        <Card>
          <h2 className="font-display text-lg font-bold">Practice mix</h2>
          <p className="text-sm text-muted">Interviews by type</p>
          {categoryData.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No data yet"
              description="Complete interviews to see your practice breakdown."
            />
          ) : (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={88}
                    paddingAngle={4}
                  >
                    {categoryData.map((item) => (
                      <Cell key={item.name} fill={item.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        <SkillBreakdown dashData={dashData} />
        <div className="space-y-4">
          <StreakCard />
          <AchievementCard totalInterviews={dashData?.totalInterviews ?? 0} />
          {completed.length > 1 && (
            <Card>
              <h2 className="font-display font-bold">Performance trend</h2>
              <p className="mt-3 font-display text-3xl font-extrabold text-success">
                {completed.length >= 2
                  ? `${((completed[0]?.overallScore ?? 0) - (completed[completed.length - 1]?.overallScore ?? 0)) >= 0 ? "+" : ""}${(completed[0]?.overallScore ?? 0) - (completed[completed.length - 1]?.overallScore ?? 0)}%`
                  : "—"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Score change from your first to latest interview.
              </p>
            </Card>
          )}
          {completed.length === 0 && (
            <Card>
              <EmptyState
                icon={Map}
                title="No data yet"
                description="Complete your first interview to see progress insights."
                action={<Button to="/interview/setup" variant="secondary">Start Interview</Button>}
              />
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
