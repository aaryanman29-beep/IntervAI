import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router";

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs text-muted">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li className="flex items-center gap-1.5">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 hover:text-ink transition-colors font-medium"
          >
            <Home className="size-3.5 text-muted" />
            <span>Dashboard</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-ink transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-bold text-ink truncate max-w-[200px] sm:max-w-none" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
