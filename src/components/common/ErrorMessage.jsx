import { CircleAlert } from "lucide-react"
export default function ErrorMessage({
  message = "Unable to load this content.",
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
      <CircleAlert className="size-5" />
      {message}
    </div>
  )
}
