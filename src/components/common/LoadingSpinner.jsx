import { LoaderCircle } from "lucide-react"
export default function LoadingSpinner({
  label = "Loading your interview data...",
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-muted">
      <LoaderCircle className="size-7 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
