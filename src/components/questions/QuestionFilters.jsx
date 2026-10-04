export default function QuestionFilters({ filters, setFilters }) {
  const fields = {
    Role: [
      "All roles",
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
    ],
    Category: [
      "All categories",
      "Technical",
      "Behavioral",
      "Coding",
      "System Design",
    ],
    Difficulty: ["All levels", "Easy", "Medium", "Hard"],
    Topic: ["All topics", "React", "DSA", "APIs", "Leadership"],
  }
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Object.entries(fields).map(([label, options]) => (
        <label key={label} className="text-xs font-semibold text-muted">
          {label}
          <select
            value={filters[label] || options[0]}
            onChange={(event) =>
              setFilters({ ...filters, [label]: event.target.value })
            }
            className="mt-1.5 min-h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none focus:border-primary"
          >
            {options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}
