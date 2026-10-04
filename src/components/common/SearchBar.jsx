import { Search } from "lucide-react"
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
      />
    </label>
  )
}
