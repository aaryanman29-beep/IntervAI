import {
  BarChart3,
  BrainCircuit,
  LayoutDashboard,
  LibraryBig,
  UserRound,
} from "lucide-react"
import { NavLink } from "react-router"
const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/interview/setup", icon: BrainCircuit, label: "Interview" },
  { to: "/questions", icon: LibraryBig, label: "Questions" },
  { to: "/progress", icon: BarChart3, label: "Progress" },
  { to: "/profile", icon: UserRound, label: "Profile" },
]
export default function MobileNavbar() {
  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-around rounded-2xl border border-line bg-white/95 px-2 py-2 card-shadow backdrop-blur lg:hidden"
      aria-label="Mobile navigation"
    >
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs ${
              isActive
                ? "bg-primary-soft font-semibold text-primary"
                : "text-muted"
            }`
          }
        >
          <Icon className="size-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
