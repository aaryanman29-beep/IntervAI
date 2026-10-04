import { Award, Clock3, Target, TrendingUp } from "lucide-react"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import Card from "../components/common/Card"
import PageContainer from "../components/layout/PageContainer"
import PerformanceChart from "../components/progress/PerformanceChart"
import SkillBreakdown from "../components/progress/SkillBreakdown"
import AchievementCard from "../components/progress/AchievementCard"
import StreakCard from "../components/progress/StreakCard"
import { categoryData } from "../data/mockProgress"
const insights = [
  {
    label: "Overall readiness",
    value: "82%",
    note: "+6% this month",
    icon: Target,
  },
  {
    label: "Strongest skill",
    value: "Communication",
    note: "90% average",
    icon: Award,
  },
  {
    label: "Weakest skill",
    value: "DSA",
    note: "Focus area · 73%",
    icon: TrendingUp,
  },
  {
    label: "Total practice",
    value: "8h 40m",
    note: "12 interviews",
    icon: Clock3,
  },
]
export default function Progress() {
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
        <PerformanceChart title="Interview score trend" />
        <Card>
          <h2 className="font-display text-lg font-bold">Practice mix</h2>
          <p className="text-sm text-muted">Questions answered by category</p>
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
        </Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        <SkillBreakdown />
        <div className="space-y-4">
          <StreakCard />
          <AchievementCard />
          <Card>
            <h2 className="font-display font-bold">Monthly improvement</h2>
            <p className="mt-3 font-display text-3xl font-extrabold text-success">
              +14%
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Your average score is up from last month. Keep the consistency
              going.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
