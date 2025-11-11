import useAuthStore from "@/store/auth";
import axios, { AxiosError } from "axios";
import { HttpStatusCode } from "@/types/enum/app-enum";

const BaseService = axios.create({
  timeout: 60000,
  // baseURL: appConfig.apiPrefix,
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
});

BaseService.interceptors.response.use(
  (response) => {
    if (response.data.status && response.data.status >= 400) {
      // Custom code from backend to handle error
      return Promise.reject(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    console.log(error);
    if (error.response?.status === HttpStatusCode.NOT_ACCEPTABLE) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default BaseService;
