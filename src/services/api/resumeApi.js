import { apiClient } from "./client";

export const resumeApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/resumes/upload", formData, true);
  },
  getAll: () => apiClient.get("/resumes"),
  getById: (id) => apiClient.get(`/resumes/${id}`),
  analyze: (id) => apiClient.post(`/resumes/${id}/analyze`),
};
