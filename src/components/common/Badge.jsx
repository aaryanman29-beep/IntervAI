const colors = {
  Easy: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Medium: "bg-amber-50 text-amber-700 border-amber-200/60",
  Hard: "bg-rose-50 text-rose-700 border-rose-200/60",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  New: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  default: "bg-slate-100 text-slate-700 border-slate-200",
}

export default function Badge({ children, variant, className = "" }) {
  const chosen = variant ? (colors[variant] || colors.default) : (colors[children] || colors.default)
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${chosen} ${className}`}
    >
      {children}
    </span>
  )
}
