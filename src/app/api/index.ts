import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const storage = localStorage.getItem("auth-storage");
    const authToken = storage ? JSON.parse(storage).state.accessToken : null;
    if (authToken && authToken !== "") {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Authentication failed, redirecting to login");
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    // For all other errors, just reject
    return Promise.reject(error);
  }
);

export default apiClient;
