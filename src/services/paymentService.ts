import type { AxiosInstance } from "axios";

export async function createPaymentIntent(
  api: AxiosInstance,
  eventId: number,
  amountCents?: number
) {
  console.log("Creating payment intent for:", { eventId, amountCents });
  const res = await api.post("/payments/create-intent", {
    eventId,
    amountCents,
  });
  console.log("Payment intent response:", res.data);
  return res.data;
}
