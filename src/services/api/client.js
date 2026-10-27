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
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response payload (e.g. HTML 502/503/504 from Nginx or cloud gateway)
      data = null;
    }
  }
  
  if (!response.ok) {
    let message = data?.message;
    if (!message) {
      if (response.status === 429) {
        message = "High traffic detected. Please wait a few seconds before trying again.";
      } else if (response.status === 502 || response.status === 503 || response.status === 504) {
        message = "The server is currently experiencing heavy load. Please retry in a moment.";
      } else {
        message = response.statusText || "An API error occurred";
      }
    }
    const error = new Error(message);
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
      credentials: "include",
    });
    return handleResponse(response);
  },

  async post(endpoint, body, isFormData = false) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async put(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async delete(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
    return handleResponse(response);
  }
};
