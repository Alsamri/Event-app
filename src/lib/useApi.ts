import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "./api";
import { redirect } from "react-router";

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
        redirect("/");
      }
      return config;
    });

    return client;
  }, [getToken]);
}
