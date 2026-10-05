import { ArrowUpDown, ChevronRight, History as HistoryIcon, SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import Badge from "../components/common/Badge"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import PageContainer from "../components/layout/PageContainer"
import SearchBar from "../components/common/SearchBar"
import { ErrorState, EmptyState } from "../components/feedback/StateViews"
import { TableRowSkeleton } from "../components/feedback/Skeleton"
import { useAsync } from "../hooks/useAsync"
import { interviewApi } from "../services/api/interviewApi"

function formatDate(dateStr) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  })
}

function statusBadgeVariant(status) {
  if (status === "COMPLETED") return "default"
  if (status === "IN_PROGRESS") return "warning"
  return "ghost"
}

export default function History() {
  const [search, setSearch] = useState("")
  const { data, loading, error, refetch } = useAsync(() => interviewApi.getAll())

  const interviews = (data || []).filter((item) =>
    (item.targetRole || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageContainer
      title="Interview History"
      description="Review past sessions and revisit your personalized feedback."
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by role..."
          />
        </div>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold"
          aria-label="Sort options"
        >
          <ArrowUpDown className="size-4" />
          Newest first
        </button>
      </div>

      {loading ? (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-slate-50 text-xs uppercase text-muted">
              <tr>
                {["Date", "Role", "Type", "Level", "Score", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={7} />
              ))}
            </tbody>
          </table>
        </Card>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={search ? "No matching interviews" : "No interviews yet"}
          description={
            search
              ? "Try a different search term."
              : "Complete your first interview to see your history here."
          }
          action={
            !search && (
              <Button to="/interview/setup">Start an Interview</Button>
            )
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-hidden p-0 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-slate-50 text-xs uppercase text-muted">
                <tr>
                  {["Date", "Role", "Type", "Level", "Score", "Status", ""].map((head) => (
                    <th key={head} className="px-5 py-4 font-semibold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {interviews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-muted">{formatDate(item.createdAt)}</td>
                    <td className="px-5 py-4 font-semibold">{item.targetRole}</td>
                    <td className="px-5 py-4 text-muted">{item.interviewType}</td>
                    <td className="px-5 py-4 text-muted">{item.experienceLevel}</td>
                    <td className="px-5 py-4 font-display font-extrabold text-primary">
                      {item.overallScore != null ? `${item.overallScore}%` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge>{item.status}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      {item.status === "COMPLETED" && (
                        <Link
                          aria-label={`View ${item.targetRole} result`}
                          to={`/interview/result/${item.id}`}
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {interviews.map((item) => (
              <div
                key={item.id}
                className="block rounded-2xl border border-line bg-white p-4 card-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{item.targetRole}</p>
                    <p className="text-sm text-muted">
                      {item.interviewType} · {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <span className="font-display text-xl font-extrabold text-primary">
                    {item.overallScore != null ? `${item.overallScore}%` : "—"}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge>{item.status}</Badge>
                  {item.status === "COMPLETED" && (
                    <Link
                      to={`/interview/result/${item.id}`}
                      className="text-sm font-semibold text-primary"
                    >
                      View results →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  )
}
