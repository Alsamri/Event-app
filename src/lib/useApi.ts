import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "./api";

export function useApi() {
  return useMemo(() => {
    const client = createClient();

    // Remove the JWT token interceptor completely
    // Clerk session cookies are automatically sent with withCredentials: true

    return client;
  }, []); // Remove getToken dependency
}
