import {
  BarChart3,
  Bookmark,
  BrainCircuit,
  Clock3,
  History,
  LayoutDashboard,
  LogOut,
  Map,
  Settings,
  UserRound,
  X,
} from "lucide-react"
import { NavLink } from "react-router"
import { useAuth } from "../../contexts/AuthContext"

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/interview/setup", label: "Mock Interview", icon: BrainCircuit },
  { to: "/questions", label: "Question Bank", icon: Clock3 },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/history", label: "Interview History", icon: History },
  { to: "/roadmap", label: "Learning Roadmap", icon: Map },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-white px-4 py-5 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <img
              src={new URL("../../assets/intervai-mark.png", import.meta.url).href}
              alt=""
              className="size-10 rounded-xl object-cover"
            />
            <span className="font-display text-xl font-extrabold tracking-tight">
              IntervAI
            </span>
          </NavLink>
          <button
            onClick={onClose}
            className="rounded-lg p-2 lg:hidden"
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>
        <nav className="flex-1 space-y-1" aria-label="Primary navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-slate-50 hover:text-ink"
                }`
              }
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => {
            logout()
            onClose()
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="size-5" />
          Logout
        </button>
      </aside>
    </>
  )
}
