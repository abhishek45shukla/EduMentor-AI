import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every outgoing request if we have one saved.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("edumentor_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout if the token expires or is rejected.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("edumentor_token");
      localStorage.removeItem("edumentor_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const fetchProfile = () => api.get("/auth/profile");
export const updateProfile = (data) => api.put("/auth/profile", data);

// --- AI Tutor ---
export const sendChatMessage = (data) => api.post("/chat", data);

// --- Quiz ---
export const generateQuiz = (data) => api.post("/generateQuiz", data);
export const submitQuiz = (data) => api.post("/submitQuiz", data);

// --- Progress ---
export const fetchProgress = () => api.get("/progress");
export const fetchRecommendation = () => api.get("/recommendation");

export default api;
