import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/services/paymentService";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useApi } from "@/lib/useApi";

type JoinEventModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: number;
    title: string;
    price?: number;
    isPaid?: boolean;
  };
};

export function JoinEventModal({
  open,
  onOpenChange,
  event,
}: JoinEventModalProps) {
  const api = useApi();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      if (!event.price || event.price <= 0) {
        toast.error("Invalid event price");
        setLoading(false);
        return;
      }
      const res = await createPaymentIntent(api, event.id, event.price * 100);
      setClientSecret(res.clientSecret);
    } catch (err) {
      console.error("Payment intent error:", err);
      toast.error("Could not start payment");
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      toast.error(result.error.message || "Payment failed");
    } else if (result.paymentIntent?.status === "succeeded") {
      toast.success("🎉 Payment successful! You’ve joined the event.");
      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl backdrop-blur-md bg-white/80 dark:bg-black/50">
        <DialogHeader>
          <DialogTitle>Join {event.title}</DialogTitle>
        </DialogHeader>

        {!clientSecret ? (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              You’re joining <strong>{event.title}</strong> —{" "}
              {event.isPaid ? <>Price: ${event.price}</> : "Free event"}
            </p>

            {event.isPaid ? (
              <Button onClick={handleCheckout} disabled={loading}>
                {loading ? "Starting checkout..." : "Pay Now"}
              </Button>
            ) : (
              <Button onClick={() => toast.success("Joined successfully!")}>
                Join Free Event
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <CardElement className="p-3 border rounded-md bg-background" />
            <Button onClick={handlePayment} disabled={loading || !stripe}>
              {loading ? "Processing..." : "Confirm Payment"}
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
