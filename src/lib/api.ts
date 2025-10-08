import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL;


export function createClient() {
  const client = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
     
      return Promise.reject(error);
    }
  );

  return client;
}