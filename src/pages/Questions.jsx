import { useMemo, useState } from "react"
import PageContainer from "../components/layout/PageContainer"
import QuestionCard from "../components/questions/QuestionCard"
import QuestionFilters from "../components/questions/QuestionFilters"
import SearchBar from "../components/common/SearchBar"
import { mockQuestions as initialQuestions } from "../data/mockQuestions"
export default function Questions() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({})
  const [questions, setQuestions] = useState(initialQuestions)
  const visible = useMemo(
    () =>
      questions.filter(
        (item) =>
          item.question.toLowerCase().includes(search.toLowerCase()) &&
          (!filters.Category ||
            filters.Category.startsWith("All") ||
            item.category === filters.Category) &&
          (!filters.Difficulty ||
            filters.Difficulty.startsWith("All") ||
            item.difficulty === filters.Difficulty),
      ),
    [questions, search, filters],
  )
  const bookmark = (id) =>
    setQuestions(
      questions.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item,
      ),
    )
  return (
    <PageContainer
      title="Interview Question Bank"
      description="Explore curated questions, save favorites, and practice at your own pace."
    >
      <div className="space-y-4 rounded-2xl border border-line bg-white p-5 card-shadow">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search questions..."
        />
        <QuestionFilters filters={filters} setFilters={setFilters} />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-semibold">
          {visible.length} questions found
        </p>
        <select className="rounded-xl border border-line bg-white px-3 py-2 text-sm">
          <option>Most relevant</option>
          <option>Difficulty</option>
        </select>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {visible.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onBookmark={bookmark}
          />
        ))}
      </div>
    </PageContainer>
  )
}
