import {
  CheckCircle2,
  Flame,
  History,
  MessageSquareText,
  TrendingUp,
} from "lucide-react"
import { Link } from "react-router"
import ActivityChart from "../components/dashboard/ActivityChart"
import ReadinessScore from "../components/dashboard/ReadinessScore"
import RecentInterview from "../components/dashboard/RecentInterview"
import RecommendedInterview from "../components/dashboard/RecommendedInterview"
import StatsCard from "../components/dashboard/StatsCard"
import WelcomeCard from "../components/dashboard/WelcomeCard"
import { ErrorState } from "../components/feedback/StateViews"
import { StatsCardSkeleton } from "../components/feedback/Skeleton"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import PageContainer from "../components/layout/PageContainer"
import { useAsync } from "../hooks/useAsync"
import { dashboardApi } from "../services/api/dashboardApi"
import { interviewApi } from "../services/api/interviewApi"

export default function Dashboard() {
  const {
    data: dashData,
    loading: dashLoading,
    error: dashError,
    refetch: refetchDash,
  } = useAsync(() => dashboardApi.getDashboard())

  const {
    data: interviews,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useAsync(() => interviewApi.getAll())

  const stats = dashData
    ? [
        {
          label: "Interviews completed",
          value: String(dashData.totalInterviews ?? 0),
          change: "Total sessions",
          icon: CheckCircle2,
        },
        {
          label: "Average score",
          value: `${dashData.overallScore ?? 0}%`,
          change: "Overall performance",
          icon: TrendingUp,
        },
        {
          label: "Technical score",
          value: `${dashData.technicalScore ?? 0}%`,
          change: "Technical depth",
          icon: MessageSquareText,
        },
        {
          label: "Communication",
          value: `${dashData.communicationScore ?? 0}%`,
          change: "Clarity & structure",
          icon: Flame,
          tone: "bg-orange-50 text-orange-500",
        },
      ]
    : []

  const recentInterviews = interviews?.filter(i => i.status === "COMPLETED").slice(0, 4) || []

  return (
    <PageContainer>
      <WelcomeCard />

      {/* Stats Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
          : dashError
          ? (
            <div className="col-span-4">
              <ErrorState message={dashError} onRetry={refetchDash} />
            </div>
          )
          : stats.map((stat) => <StatsCard key={stat.label} {...stat} />)}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[.65fr_1.35fr]">
        <ReadinessScore score={dashData?.overallScore} loading={dashLoading} />
        <ActivityChart interviews={interviews || []} />
      </div>

      {/* Recent Sessions */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <RecommendedInterview />
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Recent interviews</h2>
              <p className="text-sm text-muted">Your latest practice sessions</p>
            </div>
            <Link to="/history" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>

          {historyLoading ? (
            <div className="mt-3 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 py-3">
                  <div className="h-4 w-36 rounded bg-slate-200" />
                  <div className="h-4 w-20 rounded bg-slate-200" />
                  <div className="ml-auto h-6 w-12 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          ) : historyError ? (
            <ErrorState message={historyError} onRetry={refetchHistory} />
          ) : recentInterviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <History className="size-10 text-slate-300" />
              <p className="mt-3 text-sm text-muted">No interviews completed yet.</p>
              <Button to="/interview/setup" className="mt-4" variant="secondary">
                Start your first interview
              </Button>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-line">
              {recentInterviews.map((item) => (
                <RecentInterview key={item.id} interview={item} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}
