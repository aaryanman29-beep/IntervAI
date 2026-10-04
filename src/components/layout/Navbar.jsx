import { Bell, Menu, Search } from "lucide-react"
import { mockUser } from "../../data/mockUser"
export default function Navbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur md:px-8 lg:ml-64">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-xl border border-line p-2.5 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
        <label className="relative hidden md:block">
          <span className="sr-only">Search application</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            className="w-64 rounded-xl bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Search anything..."
          />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="relative rounded-xl p-2.5 text-muted hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-white" />
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">{mockUser.name}</p>
          <p className="text-xs text-muted">{mockUser.role}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
          {mockUser.initials}
        </span>
      </div>
    </header>
  )
}
