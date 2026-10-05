export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  
  if (!isFormData) {
    headers.append("Content-Type", "application/json");
  }
  
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }
  
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  
  if (!response.ok) {
    const error = new Error(data?.message || response.statusText || "An API error occurred");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data?.data || data;
};

export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async post(endpoint, body, isFormData = false) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },

  async put(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  async delete(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};
