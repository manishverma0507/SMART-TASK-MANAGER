import axios from "axios";

// Base URL (ENV first, fallback for local dev)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Final API URL
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // optional but recommended
});

// Set / Remove Auth Token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// AUTH APIs
export const authApi = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me"),
};

// PROJECT APIs
export const projectApi = {
  create: (payload) => api.post("/projects", payload),
  list: () => api.get("/projects"),
  getById: (projectId) => api.get(`/projects/${projectId}`),
  update: (projectId, payload) =>
    api.put(`/projects/${projectId}`, payload),
  remove: (projectId) => api.delete(`/projects/${projectId}`),
  addMember: (projectId, payload) =>
    api.post(`/projects/${projectId}/add-member`, payload),
  removeMember: (projectId, memberId) =>
    api.delete(`/projects/${projectId}/members/${memberId}`),
};

// TASK APIs
export const taskApi = {
  create: (payload) => api.post("/tasks", payload),
  listByProject: (projectId, params) =>
    api.get(`/tasks/project/${projectId}`, { params }),
  update: (taskId, payload) =>
    api.put(`/tasks/${taskId}`, payload),
  remove: (taskId) => api.delete(`/tasks/${taskId}`),
  myTasks: () => api.get("/tasks/my-tasks"),
};

export default api;
