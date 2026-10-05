// Completely replace the old api.js with a clean re-export barrel from the new api/ layer
// This preserves backward compatibility for any page still importing from services/api

export { authApi } from "./api/authApi"
export { resumeApi } from "./api/resumeApi"
export { interviewApi } from "./api/interviewApi"
export { dashboardApi } from "./api/dashboardApi"
export { API_URL } from "./api/client"
