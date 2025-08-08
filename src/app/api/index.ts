import axios, { type InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig<unknown>
  ): InternalAxiosRequestConfig<unknown> => {
    const token = localStorage.getItem("auth-storage");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
