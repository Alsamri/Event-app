import type { AxiosInstance } from "axios";

export async function getGoogleAuthUrl(api: AxiosInstance) {
  const res = await api.get("/auth/google/url");
  return res.data;
}
