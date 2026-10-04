import { ArrowUpDown, ChevronRight, SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"
import Badge from "../components/common/Badge"
import Card from "../components/common/Card"
import PageContainer from "../components/layout/PageContainer"
import SearchBar from "../components/common/SearchBar"
import { mockInterviews } from "../data/mockInterviews"
export default function History() {
  const [search, setSearch] = useState("")
  const items = mockInterviews.filter((item) =>
    item.role.toLowerCase().includes(search.toLowerCase()),
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
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold">
          <SlidersHorizontal className="size-4" />
          Filter
        </button>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold">
          <ArrowUpDown className="size-4" />
          Newest first
        </button>
      </div>
      <Card className="hidden overflow-hidden p-0 md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-slate-50 text-xs uppercase text-muted">
            <tr>
              {["Date", "Role", "Type", "Duration", "Score", "Status", ""].map(
                (head) => (
                  <th key={head} className="px-5 py-4 font-semibold">
                    {head}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 text-muted">{item.date}</td>
                <td className="px-5 py-4 font-semibold">{item.role}</td>
                <td className="px-5 py-4 text-muted">{item.type}</td>
                <td className="px-5 py-4 text-muted">{item.duration}</td>
                <td className="px-5 py-4 font-display font-extrabold text-primary">
                  {item.score}%
                </td>
                <td className="px-5 py-4">
                  <Badge>{item.status}</Badge>
                </td>
                <td className="px-5 py-4">
                  <Link
                    aria-label={`View ${item.role} result`}
                    to={`/interview/result/${item.id}`}
                  >
                    <ChevronRight className="size-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/interview/result/${item.id}`}
            className="block rounded-2xl border border-line bg-white p-4 card-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{item.role}</p>
                <p className="text-sm text-muted">
                  {item.type} · {item.date}
                </p>
              </div>
              <span className="font-display text-xl font-extrabold text-primary">
                {item.score}%
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted">{item.duration}</span>
              <Badge>{item.status}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </PageContainer>
  )
}
