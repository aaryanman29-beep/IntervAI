import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import Card from "../common/Card"

export default function SkillBreakdown({ dashData }) {
  const chartData = dashData?.strengths
    ? Object.entries(dashData.strengths).map(([name, count]) => ({
        name: name.length > 15 ? name.substring(0, 15) + "..." : name,
        score: count * 20 > 100 ? 100 : count * 20, // Example scoring based on counts
      }))
    : []

  return (
    <Card>
      <h2 className="font-display text-lg font-bold">Skill breakdown</h2>
      <p className="mb-5 text-sm text-muted">
        Your frequently identified strengths
      </p>
      {chartData.length > 0 ? (
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid vertical={false} stroke="#eef0f5" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                fontSize={10}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                fontSize={11}
              />
              <Tooltip
                cursor={{ fill: "#f7f8fc" }}
                contentStyle={{ borderRadius: 12, borderColor: "#e8eaf2" }}
              />
              <Bar dataKey="score" fill="#5b5bd6" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center text-sm text-muted">
          Complete interviews to see your skill breakdown.
        </div>
      )}
    </Card>
  )
}
