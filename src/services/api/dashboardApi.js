import { apiClient } from "./client";

export const dashboardApi = {
  getDashboard: () => apiClient.get("/dashboard"),
  getRoadmap: () => apiClient.get("/dashboard/roadmap"),
  generateRoadmap: (data) => apiClient.post("/dashboard/roadmap/generate", data),
};
