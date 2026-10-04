import { useState } from "react"
import EmptyState from "../components/common/EmptyState"
import SearchBar from "../components/common/SearchBar"
import PageContainer from "../components/layout/PageContainer"
import QuestionCard from "../components/questions/QuestionCard"
import { mockQuestions } from "../data/mockQuestions"
export default function Bookmarks() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState(
    mockQuestions.filter((item) => item.bookmarked),
  )
  const visible = items.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase()),
  )
  return (
    <PageContainer
      title="Bookmarks"
      description="Your saved questions, ready whenever you are."
    >
      <div className="max-w-xl">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search saved questions..."
        />
      </div>
      {visible.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {visible.map((item) => (
            <QuestionCard
              key={item.id}
              question={item}
              onBookmark={(id) =>
                setItems(items.filter((question) => question.id !== id))
              }
            />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No bookmarked questions yet"
            description="Save questions from the question bank to build your own practice list."
            action="Explore questions"
            to="/questions"
          />
        </div>
      )}
    </PageContainer>
  )
}
