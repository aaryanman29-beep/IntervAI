import { LoaderCircle } from "lucide-react"
import { Link } from "react-router"

const styles = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm border border-transparent font-medium",
  secondary:
    "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-xs font-medium",
  ghost:
    "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium",
  danger:
    "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-medium",
}

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2.5 text-sm rounded-lg",
  lg: "px-5 py-3 text-base leading-4 rounded-lg",
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  to,
  loading,
  icon: Icon,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${sizes[size] || sizes.md} ${className}`
  
  const content = (
    <>
      {loading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : Icon ? (
        <Icon className="size-4 shrink-0" />
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
