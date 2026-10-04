import Card from "../common/Card"
export default function StatsCard({
  label,
  value,
  change,
  icon: Icon,
  tone = "bg-primary-soft text-primary",
}) {
  return (
    <Card hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 font-display text-2xl font-extrabold">{value}</p>
          <p className="mt-1 text-xs font-medium text-success">{change}</p>
        </div>
        <span className={`grid size-11 place-items-center rounded-xl ${tone}`}>
          <Icon className="size-5" />
        </span>
      </div>
    </Card>
  )
}
