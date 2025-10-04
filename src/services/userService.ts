import type { AxiosInstance } from "axios";

export async function getMe(api: AxiosInstance) {
  const res = await api.get("/me");
  return res.data;
}

export async function updateUserRole(
  api: AxiosInstance,
  userId: number,
  role: "staff" | "member"
) {
  const res = await api.patch(`/users/${userId}/role`, { role });
  return res.data;
}
