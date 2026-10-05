import { apiClient } from "./client";

export const interviewApi = {
  create: (data) => apiClient.post("/interviews", data),
  getAll: () => apiClient.get("/interviews"),
  getById: (id) => apiClient.get(`/interviews/${id}`),
  getQuestions: (id) => apiClient.get(`/interviews/${id}/questions`),
  getAllQuestions: () => apiClient.get(`/interviews/questions`),
  getQuestion: (questionId) => apiClient.get(`/interviews/questions/${questionId}`),
  start: (id) => apiClient.post(`/interviews/${id}/start`),
  submitAnswer: (id, data) => apiClient.post(`/interviews/${id}/answer`, data),
  complete: (id) => apiClient.post(`/interviews/${id}/complete`),
};
