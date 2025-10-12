import axios from "axios";
import type { AxiosInstance } from "axios";
import {API_URL} from "@env"


const TokenReq: AxiosInstance = axios.create({
  headers: {
    accept: "application/json",
  },
  withCredentials: true,
  baseURL: API_URL,
});

TokenReq.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

TokenReq.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export { TokenReq };