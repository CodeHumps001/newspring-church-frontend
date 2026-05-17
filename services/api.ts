import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  getMe: () => api.get("/auth/me"),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};

export const recordsAPI = {
  create: (data: any) => api.post("/records", data),
  getAll: (params?: any) => api.get("/records", { params }),
  getById: (id: number) => api.get(`/records/${id}`),
  update: (id: number, data: any) => api.put(`/records/${id}`, data),
  delete: (id: number) => api.delete(`/records/${id}`),
};

export const reportsAPI = {
  getDashboard: () => api.get("/reports/dashboard"),
  getMonthly: (month: number, year: number) =>
    api.get("/reports/monthly", { params: { month, year } }),
  getWeekly: (year: number, month: number, weekNumber?: number) =>
    api.get("/reports/weekly", { params: { year, month, weekNumber } }),
};

export const utilsAPI = {
  getDenominations: () => api.get("/denominations"),
};

// Add expense API
export const expenseAPI = {
  create: (data: any) => api.post("/expenses", data),
  getAll: (params?: any) => api.get("/expenses", { params }),
  getById: (id: number) => api.get(`/expenses/${id}`),
  update: (id: number, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
};

export default api;
