import { useMemo, useState, useEffect } from "react"
import PageContainer from "../components/layout/PageContainer"
import QuestionCard from "../components/questions/QuestionCard"
import QuestionFilters from "../components/questions/QuestionFilters"
import SearchBar from "../components/common/SearchBar"
import StateViews from "../components/common/StateViews"
import { interviewApi } from "../services/api/interviewApi"
import { useAsync } from "../hooks/useAsync"

export default function Questions() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({})
  
  const { execute, status, value: fetchedQuestions, error } = useAsync(interviewApi.getAllQuestions)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    execute()
  }, [execute])

  useEffect(() => {
    if (fetchedQuestions?.data) {
      const savedBookmarks = JSON.parse(localStorage.getItem('intervai_bookmarks') || '[]')
      const formatted = fetchedQuestions.data.map(q => ({
        id: q.id,
        question: q.questionText,
        category: q.questionType,
        difficulty: q.difficulty,
        topic: q.topic,
        role: q.interview?.targetRole || "Practice Question",
        bookmarked: savedBookmarks.includes(q.id)
      }))
      setQuestions(formatted)
    }
  }, [fetchedQuestions])

  const visible = useMemo(
    () =>
      questions.filter(
        (item) =>
          item.question?.toLowerCase().includes(search.toLowerCase()) &&
          (!filters.Category ||
            filters.Category.startsWith("All") ||
            item.category === filters.Category) &&
          (!filters.Difficulty ||
            filters.Difficulty.startsWith("All") ||
            item.difficulty === filters.Difficulty),
      ),
    [questions, search, filters],
  )
  
  const bookmark = (id) => {
    setQuestions(prev => {
      const newQuestions = prev.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item,
      )
      
      const savedBookmarks = newQuestions.filter(q => q.bookmarked).map(q => q.id)
      localStorage.setItem('intervai_bookmarks', JSON.stringify(savedBookmarks))
      
      return newQuestions
    })
  }
  return (
    <PageContainer
      title="Interview Question Bank"
      description="Explore past questions, save favorites, and practice at your own pace."
    >
      <div className="space-y-4 rounded-2xl border border-line bg-white p-5 card-shadow">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search questions..."
        />
        <QuestionFilters filters={filters} setFilters={setFilters} />
      </div>
      
      <StateViews
        status={status}
        error={error}
        isEmpty={questions.length === 0}
        emptyMessage="No questions found. Start an interview to build your question bank!"
      >
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
      </StateViews>
    </PageContainer>
  )
}
