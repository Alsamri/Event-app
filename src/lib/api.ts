import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export const API_BASE = import.meta.env.VITE_API_URL;


type GetTokenFunction = ((options?: { template?: string }) => Promise<string | null>) | null;

export function createClient(getToken?: GetTokenFunction): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });


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
      
    
      
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
    
      return response;
    },
    (error: AxiosError) => {
      
      return Promise.reject(error);
    }
  );

  return client;
}