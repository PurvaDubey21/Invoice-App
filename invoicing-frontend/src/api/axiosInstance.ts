import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

/**
 * Base Axios Instance
 * Used across the entire application
 */

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, //cookies / jwt support
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

/* =========================
   REQUEST INTERCEPTOR
   ========================= */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // future: attach token if needed
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; // 🔥 IMPORTANT
     }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
   ========================= */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // global error handling
    if (error.response?.status === 401) {
      console.warn("Unauthorized - redirect to login");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

