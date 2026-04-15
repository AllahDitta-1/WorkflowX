import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expires, redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getMe = () => API.get("/auth/me");

// ============ TASKS ============
export const fetchTasks = (params) => API.get("/tasks", { params });
export const fetchTask = (id) => API.get(`/tasks/${id}`);
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const addComment = (id, data) => API.post(`/tasks/${id}/comments`, data);
export const fetchTaskStats = () => API.get("/tasks/stats/overview");

// ============ PROJECTS ============
export const fetchProjects = () => API.get("/projects");
export const fetchProject = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post("/projects", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// ============ USERS ============
export const fetchUsers = () => API.get("/users");
export const updateProfile = (data) => API.put("/users/profile", data);
export const updateUserRole = (id, data) => API.put(`/users/${id}/role`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// ============ NOTIFICATIONS ============
export const fetchNotifications = () => API.get("/notifications");
export const markNotificationsRead = () => API.put("/notifications/read");

export default API;
