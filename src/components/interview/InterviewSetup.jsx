import { Check } from "lucide-react"
export default function InterviewSetup({
  title,
  options,
  value,
  onChange,
  columns = "sm:grid-cols-3",
}) {
  return (
    <section>
      <h2 className="mb-4 font-display text-lg font-bold">{title}</h2>
      <div className={`grid grid-cols-2 gap-3 ${columns}`}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`relative min-h-14 rounded-xl border p-3 text-left text-sm font-semibold transition ${
              value === option
                ? "border-primary bg-primary-soft text-primary"
                : "border-line bg-white hover:border-primary/40"
            }`}
          >
            {option}
            {value === option && (
              <Check className="absolute right-3 top-3 size-4" />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
