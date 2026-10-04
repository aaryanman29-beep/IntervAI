import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { scoreTrend } from "../../data/mockProgress"
import Card from "../common/Card"
export default function ActivityChart({ title = "Performance trend" }) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="font-display text-lg font-bold">{title}</h2>
        <p className="text-sm text-muted">
          Score progression across recent interviews
        </p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={scoreTrend} margin={{ left: -20, right: 10 }}>
            <CartesianGrid vertical={false} stroke="#eef0f5" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              fontSize={11}
            />
            <YAxis
              domain={[60, 100]}
              axisLine={false}
              tickLine={false}
              fontSize={11}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, borderColor: "#e8eaf2" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#5b5bd6"
              strokeWidth={3}
              dot={{ fill: "#5b5bd6", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
