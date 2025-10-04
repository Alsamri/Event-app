import type { AxiosInstance } from "axios";

export async function createPaymentIntent(
  api: AxiosInstance,
  eventId: number,
  amountCents?: number
) {
  const res = await api.post("/payments/create-intent", {
    eventId,
    amountCents,
  });
  return res.data;
}
