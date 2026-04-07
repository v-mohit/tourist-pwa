import { getAccessToken } from "@/utils/common.utils";
import axios from "axios";
import { NEXT_PUBLIC_API_BASE_URL } from "@/configs/env.config";
import { useAuthStore } from "@/store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
});
axiosInstance.defaults.headers.post["Content-Type"] = "application/json";

axiosInstance.interceptors.request.use(async (config) => {
  const jwt = await getAccessToken();
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().setIsUnauthorized(true);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
