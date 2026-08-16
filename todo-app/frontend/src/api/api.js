import axios from "axios";

// "api" als Kurzschreibweise benutzbar machen
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
});

// Access Token mittels Refresh Token erstellen
api.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await api.post("/auth/refresh");

      return api(originalRequest);

    } catch (refreshError) {

      return Promise.reject(refreshError);
    }
  }
);

export default api;