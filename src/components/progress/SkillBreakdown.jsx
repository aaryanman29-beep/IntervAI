import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { skillScores } from "../../data/mockProgress"
import Card from "../common/Card"
export default function SkillBreakdown() {
  return (
    <Card>
      <h2 className="font-display text-lg font-bold">Skill breakdown</h2>
      <p className="mb-5 text-sm text-muted">
        Your average score by competency
      </p>
      <div className="h-72">
        <ResponsiveContainer>
          <BarChart data={skillScores} margin={{ left: -20 }}>
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
    </Card>
  )
}
