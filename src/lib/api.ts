import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL;

export function createClient() {
  return axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}
