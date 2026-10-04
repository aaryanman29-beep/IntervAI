import { LoaderCircle } from "lucide-react"
import { Link } from "react-router"

const styles = {
  primary: "bg-primary text-white hover:bg-primary-dark shadow-sm",
  secondary:
    "bg-white text-ink border border-line hover:border-primary/40 hover:bg-primary-soft/40",
  ghost: "text-muted hover:text-ink hover:bg-slate-100",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
}
export default function Button({
  children,
  variant = "primary",
  className = "",
  to,
  loading,
  icon: Icon,
  ...props
}) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`
  const content = (
    <>
      {loading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : Icon ? (
        <Icon className="size-4" />
      ) : null}
      {children}
    </>
  )
  return to ? (
    <Link className={classes} to={to} {...props}>
      {content}
    </Link>
  ) : (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}
