const colors = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-red-50 text-red-700",
  Completed: "bg-emerald-50 text-emerald-700",
  default: "bg-primary-soft text-primary",
}
export default function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[children] || colors.default} ${className}`}
    >
      {children}
    </span>
  )
}
