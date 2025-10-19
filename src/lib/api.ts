import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export const API_BASE = import.meta.env.VITE_API_URL;

// Type for Clerk's getToken function
type GetTokenFunction = ((options?: { template?: string }) => Promise<string | null>) | null;

export function createClient(getToken?: GetTokenFunction): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Add token to every request
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (getToken) {
        try {
          const token = await getToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Failed to get token:", error);
        }
      }
      
      console.log("🚀 API Request:", {
        url: config.url,
        baseURL: config.baseURL,
        hasAuth: !!config.headers?.Authorization,
        withCredentials: config.withCredentials,
      });
      
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log("✅ API Response:", response.status, response.data);
      return response;
    },
    (error: AxiosError) => {
      console.log("❌ API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      return Promise.reject(error);
    }
  );

  return client;
}