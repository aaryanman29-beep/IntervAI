import { apiClient } from "./client";

export const userApi = {
  getProfile: () => apiClient.get("/users/profile"),
  updateProfile: (profileData) => apiClient.put("/users/profile", profileData),
};
