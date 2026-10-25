import { apiClient } from "./client";

export const authApi = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  register: (details) => apiClient.post("/auth/register", details),
  logout: () => apiClient.post("/auth/logout", {}),
  getMe: () => apiClient.get("/auth/me"),
};
