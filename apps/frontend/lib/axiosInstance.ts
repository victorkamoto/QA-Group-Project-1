import axios, {
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.headers["auth-init"]) {
      return config;
    } else {
      const token = localStorage.getItem("accessToken");
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    }
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
