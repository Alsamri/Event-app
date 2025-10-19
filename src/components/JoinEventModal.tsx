import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/services/paymentService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useApi } from "@/lib/useApi";
import { useAuth } from "@clerk/clerk-react";
import { signupEvent, addEventToCalendar } from "@/services/signupService";
import { getGoogleAuthUrl } from "@/services/googleService";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, CreditCard, DollarSign, Link } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";

type JoinEventModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: number;
    title: string;
    price?: number;
    isPaid?: boolean;
    startTime: string;
    endTime: string;
    payWhatYouFeel?: boolean;
    location: string;
    description?: string;
  };
  onSuccess?: () => void;
};

type ModalStep = "initial" | "payment" | "success" | "calendar" | "connect";

export function JoinEventModal({
  open,
  onOpenChange,
  event,
  onSuccess
}: JoinEventModalProps) {
  const api = useApi();
  const stripe = useStripe();
  const elements = useElements();
  const { isSignedIn } = useAuth();
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<ModalStep>("initial");
  const [calendarError, setCalendarError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setCurrentStep("initial");
        setClientSecret(null);
        setCalendarError(null);
        setCustomAmount("");
      }, 300);
    }
  }, [open]);

  const handleCheckout = async () => {
    try {
      if (!isSignedIn) {
        toast.error("Please sign in to join events");
        return;
      }

      setLoading(true);
      
      if (event.isPaid) {
        if (event.payWhatYouFeel) {
          // Pay What You Feel event
          const amount = Number(customAmount);
          if (!customAmount || amount <= 0) {
            toast.error("Please enter a valid amount");
            setLoading(false);
            return;
          }
          const res = await createPaymentIntent(api, event.id, amount * 100);
          setClientSecret(res.clientSecret);
          setCurrentStep("payment");
        } else {
          // Fixed price event
          if (!event.price || event.price <= 0) {
            toast.error("Invalid event price");
            setLoading(false);
            return;
          }
          const res = await createPaymentIntent(api, event.id, event.price * 100);
          setClientSecret(res.clientSecret);
          setCurrentStep("payment");
        }
      } else {
        // Free event - sign up and show success with calendar option
        await signupEvent(api, event.id);
        console.log("Free event signup successful, showing calendar option");
        setCurrentStep("success");
        toast.success("Successfully joined the event!");
        // Don't call onSuccess yet - wait until modal closes
        // onSuccess?.();
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Could not process your request");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        await signupEvent(api, event.id);
        console.log("Payment successful, showing calendar option");
        setCurrentStep("success");
        toast.success("Payment successful! You've joined the event.");
        // Don't call onSuccess yet - wait until modal closes
        // onSuccess?.();
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = async () => {
    try {
      setLoading(true);
      setCalendarError(null);
      await addEventToCalendar(api, event.id);
      toast.success("Event added to your Google Calendar!");
      onSuccess?.(); // Refresh data after adding to calendar
      onOpenChange(false);
    } catch (err: any) {
      console.error("Calendar error:", err);
      
      if (err.response?.status === 400 && err.response.data?.linkToConnect) {
        setCurrentStep("connect");
        setCalendarError("Please connect your Google Calendar first");
      } else {
        toast.error("Failed to add event to calendar");
        setCalendarError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setLoading(true);
      const { url } = await getGoogleAuthUrl(api);
      
      // Store event ID to add to calendar after auth
      sessionStorage.setItem('pendingCalendarEvent', event.id.toString());
      
      window.location.href = url;
    } catch (err) {
      console.error("Google auth error:", err);
      toast.error("Failed to connect Google Calendar");
      setLoading(false);
    }
  };

  const handleSkipCalendar = () => {
    onSuccess?.(); // Refresh data when closing
    onOpenChange(false);
  };

  const handleBackToCalendar = () => {
    setCurrentStep("success");
    setCalendarError(null);
  };

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl backdrop-blur-md bg-white/80 dark:bg-black/50 border-0">
        <AnimatePresence mode="wait">
          {currentStep === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Join {event.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="space-y-3">
                  <Badge variant={
                    event.payWhatYouFeel ? "outline" : 
                    event.isPaid ? "default" : "secondary"
                  } className={
                    event.payWhatYouFeel ? "bg-orange-50 text-orange-700 border-orange-300" : ""
                  }>
                    {event.payWhatYouFeel ? "💝 Pay What You Feel" : 
                     event.isPaid ? `$${event.price} USD` : "Free Event"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {formatEventTime(event.startTime)} • {event.location}
                  </p>
                </div>

                {/* Pay What You Feel Amount Input */}
                {event.isPaid && event.payWhatYouFeel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800"
                  >
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                        Choose Your Contribution
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Pay any amount you feel is appropriate
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm text-orange-800 dark:text-orange-300">Your Amount (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="pl-9 rounded-xl border-2 border-orange-300 focus:border-orange-500 transition-colors bg-white dark:bg-gray-800"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Enter any amount you'd like to contribute
                      </p>
                    </div>
                  </motion.div>
                )}

                <Button 
                  onClick={handleCheckout} 
                  disabled={loading || (event.payWhatYouFeel && (!customAmount || Number(customAmount) <= 0))}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {loading ? "Processing..." : 
                   event.payWhatYouFeel ? `Pay $${customAmount || "0.00"} USD` :
                   event.isPaid ? `Pay $${event.price} USD` : "Join Free Event"}
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle>Complete Payment</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                  className="p-3 border rounded-lg bg-background"
                />
                <Button 
                  onClick={handlePayment} 
                  disabled={loading || !stripe}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Processing Payment..." : 
                   event.payWhatYouFeel ? `Pay $${customAmount} USD` : `Pay $${event.price} USD`}
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <DialogHeader>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <DialogTitle className="text-xl">
                  You're Going!
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatEventTime(event.startTime)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.location}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleAddToCalendar}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {loading ? "Adding..." : "Add to Google Calendar"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleSkipCalendar}
                    className="w-full"
                  >
                    Skip for now
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "connect" && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <DialogHeader>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <Link className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <DialogTitle className="text-xl">
                  Connect Google Calendar
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {calendarError && (
                  <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {calendarError}
                  </p>
                )}
                
                <p className="text-sm text-muted-foreground">
                  Connect your Google account to automatically add events to your calendar.
                </p>

                <div className="space-y-3">
                  <Button 
                    onClick={handleConnectGoogle}
                    disabled={loading}
                    className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                    size="lg"
                  >
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google" 
                      className="w-4 h-4 mr-2"
                    />
                    {loading ? "Connecting..." : "Connect Google Calendar"}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleBackToCalendar}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleSkipCalendar}
                      className="flex-1"
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}