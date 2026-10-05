import { useState, useEffect } from "react"
import EmptyState from "../components/common/EmptyState"
import SearchBar from "../components/common/SearchBar"
import PageContainer from "../components/layout/PageContainer"
import QuestionCard from "../components/questions/QuestionCard"
import StateViews from "../components/common/StateViews"
import { interviewApi } from "../services/api/interviewApi"
import { useAsync } from "../hooks/useAsync"

export default function Bookmarks() {
  const [search, setSearch] = useState("")
  
  const { execute, status, value: fetchedQuestions, error } = useAsync(interviewApi.getAllQuestions)
  const [items, setItems] = useState([])

  useEffect(() => {
    execute()
  }, [execute])

  useEffect(() => {
    if (fetchedQuestions?.data) {
      const savedBookmarks = JSON.parse(localStorage.getItem('intervai_bookmarks') || '[]')
      const formatted = fetchedQuestions.data
        .filter(q => savedBookmarks.includes(q.id))
        .map(q => ({
          id: q.id,
          question: q.questionText,
          category: q.questionType,
          difficulty: q.difficulty,
          topic: q.topic,
          role: q.interview?.targetRole || "Practice Question",
          bookmarked: true
        }))
      setItems(formatted)
    }
  }, [fetchedQuestions])

  const visible = items.filter((item) =>
    item.question?.toLowerCase().includes(search.toLowerCase()),
  )

  const unbookmark = (id) => {
    setItems(items.filter((question) => question.id !== id))
    const savedBookmarks = JSON.parse(localStorage.getItem('intervai_bookmarks') || '[]')
    const updated = savedBookmarks.filter(bookmarkId => bookmarkId !== id)
    localStorage.setItem('intervai_bookmarks', JSON.stringify(updated))
  }

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
      
      <StateViews
        status={status}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="No bookmarked questions yet."
      >
        {visible.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {visible.map((item) => (
              <QuestionCard
                key={item.id}
                question={item}
                onBookmark={unbookmark}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="No bookmarked questions match your search"
              description="Try adjusting your search terms."
              action="Explore questions"
              to="/questions"
            />
          </div>
        )}
      </StateViews>
    </PageContainer>
  )
}
