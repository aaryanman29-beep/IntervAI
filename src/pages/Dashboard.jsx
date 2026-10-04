import {
  CheckCircle2,
  Flame,
  MessageSquareText,
  TrendingUp,
} from "lucide-react"
import ActivityChart from "../components/dashboard/ActivityChart"
import ReadinessScore from "../components/dashboard/ReadinessScore"
import RecentInterview from "../components/dashboard/RecentInterview"
import RecommendedInterview from "../components/dashboard/RecommendedInterview"
import StatsCard from "../components/dashboard/StatsCard"
import WelcomeCard from "../components/dashboard/WelcomeCard"
import PageContainer from "../components/layout/PageContainer"
import Card from "../components/common/Card"
import { mockInterviews } from "../data/mockInterviews"
export default function Dashboard() {
  const stats = [
    {
      label: "Interviews completed",
      value: "12",
      change: "+3 this month",
      icon: CheckCircle2,
    },
    {
      label: "Average score",
      value: "82%",
      change: "+6% this month",
      icon: TrendingUp,
    },
    {
      label: "Questions answered",
      value: "146",
      change: "+24 this week",
      icon: MessageSquareText,
    },
    {
      label: "Current streak",
      value: "7 days",
      change: "Personal best: 12",
      icon: Flame,
      tone: "bg-orange-50 text-orange-500",
    },
  ]
  return (
    <PageContainer>
      <WelcomeCard />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[.65fr_1.35fr]">
        <ReadinessScore />
        <ActivityChart />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <RecommendedInterview />
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">
                Recent interviews
              </h2>
              <p className="text-sm text-muted">
                Your latest practice sessions
              </p>
            </div>
          </div>
          <div className="mt-3 divide-y divide-line">
            {mockInterviews.slice(0, 4).map((item) => (
              <RecentInterview key={item.id} interview={item} />
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
