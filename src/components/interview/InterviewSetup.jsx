import { Check } from "lucide-react"

export default function InterviewSetup({
  title,
  options,
  value,
  onChange,
  columns = "sm:grid-cols-3",
  displayFn,
}) {
  return (
    <section>
      <h2 className="mb-4 font-display text-lg font-bold">{title}</h2>
      <div className={`grid grid-cols-2 gap-3 ${columns}`}>
        {options.map((option) => {
          const label = displayFn ? displayFn(option) : option
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={value === option}
              className={`relative min-h-14 rounded-xl border p-3 text-left text-sm font-semibold transition ${
                value === option
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-line bg-white hover:border-primary/40"
              }`}
            >
              {label}
              {value === option && (
                <Check className="absolute right-3 top-3 size-4" />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
