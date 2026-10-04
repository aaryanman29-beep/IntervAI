import { Inbox } from "lucide-react"
import Button from "./Button"
export default function EmptyState({
  title = "Nothing here yet",
  description,
  action,
  to,
}) {
  return (
    <CardLike>
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Inbox />
      </div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action && (
        <Button className="mt-5" to={to}>
          {action}
        </Button>
      )}
    </CardLike>
  )
}
function CardLike({ children }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
      {children}
    </div>
  )
}
