export default function ProgressBar({
  value,
  label,
  showValue = true,
  color = "bg-primary",
}) {
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-ink">{label}</span>
          {showValue && (
            <span className="font-semibold text-muted">{value}%</span>
          )}
        </div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
