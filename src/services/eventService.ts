import type { AxiosInstance } from "axios";

export type EventDTO = {
  id?: number;
  title: string;
  description?: string;
  location: string;
  startTime: string; // ISO
  endTime: string;
  isPaid?: boolean;
  price?: number;
  currency?: string;
  payWhatYouFeel?: boolean;
  createdBy?: number;
};

export async function listEvents(api: AxiosInstance, params?: any) {
  const res = await api.get("/events", { params });
  return res.data;
}

export async function getEvent(api: AxiosInstance, id: number) {
  const res = await api.get(`/events/${id}`);
  return res.data;
}

export async function createEvent(api: AxiosInstance, payload: EventDTO) {
  const res = await api.post("/events", payload);
  return res.data;
}

export async function updateEvent(
  api: AxiosInstance,
  id: number,
  payload: Partial<EventDTO>
) {
  const res = await api.patch(`/events/${id}`, payload);
  return res.data;
}

export async function deleteEvent(api: AxiosInstance, id: number) {
  const res = await api.delete(`/events/${id}`);
  return res.data;
}
