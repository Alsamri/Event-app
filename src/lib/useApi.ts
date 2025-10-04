import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "./api";

export function useApi() {
  const { getToken } = useAuth();
  return useMemo(() => {
    const client = createClient();

    client.interceptors.request.use(async (config) => {
      try {
        const token = await getToken({ template: "default" });
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        window.location.href = "/";
      }
      return config;
    });

    return client;
  }, [getToken]);
}
