import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import Card from "../common/Card"

export default function ActivityChart({ title = "Performance trend", interviews = [] }) {
  const completed = interviews.filter(i => i.status === "COMPLETED").reverse()
  const chartData = completed.length > 0
    ? completed.map((i, index) => ({
        name: `Int ${index + 1}`,
        score: i.overallScore || 0,
      }))
    : []

  return (
    <Card>
      <div className="mb-5">
        <h2 className="font-display text-lg font-bold">{title}</h2>
        <p className="text-sm text-muted">
          Score progression across recent interviews
        </p>
      </div>
      {chartData.length > 0 ? (
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ left: -20, right: 10 }}>
              <CartesianGrid vertical={false} stroke="#eef0f5" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                fontSize={11}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                fontSize={11}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, borderColor: "var(--color-line)" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: "var(--color-primary)", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-sm text-muted">
          Complete interviews to see your performance trend.
        </div>
      )}
    </Card>
  )
}
