import { mockQuestions } from "../data/mockQuestions"
import { mockInterviews } from "../data/mockInterviews"
import { mockFeedback } from "../data/mockFeedback"
import { scoreTrend, skillScores } from "../data/mockProgress"
import { mockUser } from "../data/mockUser"

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
const mockRequest = (data, delay = 250) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay))
export const loginUser = (credentials) =>
  mockRequest({
    user: mockUser,
    token: "mock-session",
    email: credentials.email,
  })
export const registerUser = (details) =>
  mockRequest({ user: { ...mockUser, ...details }, token: "mock-session" })
export const getQuestions = () => mockRequest(mockQuestions)
export const getQuestionById = (id) =>
  mockRequest(mockQuestions.find((item) => item.id === String(id)))
export const startInterview = (config) =>
  mockRequest({ id: "int-new", ...config })
export const submitAnswer = (answer) => mockRequest({ accepted: true, answer })
export const getInterviewResult = () => mockRequest(mockFeedback)
export const getProgress = () => mockRequest({ scoreTrend, skillScores })
export const getInterviewHistory = () => mockRequest(mockInterviews)
export const getBookmarks = () =>
  mockRequest(mockQuestions.filter((item) => item.bookmarked))
export const updateProfile = (profile) =>
  mockRequest({ ...mockUser, ...profile })
