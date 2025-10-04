import type { AxiosInstance } from "axios";

export async function signupEvent(api: AxiosInstance, eventId: number) {
  const res = await api.post(`/events/${eventId}/signup`);
  return res.data;
}

export async function addEventToCalendar(api: AxiosInstance, eventId: number) {
  const res = await api.post(`/events/${eventId}/calendar`);
  return res.data;
}

export async function listMyEvents(api: AxiosInstance) {
  const res = await api.get("/my-events");
  return res.data;
}
