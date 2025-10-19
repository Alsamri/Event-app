import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "./api";
import type { AxiosInstance } from "axios";

export function useApi(): AxiosInstance {
  const { getToken, isLoaded } = useAuth();
  
  return useMemo(() => {
    return createClient(isLoaded ? getToken : undefined);
  }, [getToken, isLoaded]);
}