import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "./api";

export function useApi() {
  return useMemo(() => {
    const client = createClient();
client.interceptors.request.use((config) => {
  console.log("🚀 API Request:", {
    url: config.url,
    baseURL: config.baseURL,
    withCredentials: config.withCredentials,
    headers: config.headers
  });
  return config;
});

client.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.log("❌ API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        withCredentials: error.config?.withCredentials
      }
    });
    return Promise.reject(error);
  }
);
   

    return client;
  }, []); 
}
