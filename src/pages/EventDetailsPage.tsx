import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@/lib/useApi";
import { getEvent } from "@/services/eventService";
import { signupEvent } from "@/services/signupService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { JoinEventModal } from "@/components/JoinEventModal";

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  isPaid?: boolean;
  price?: number;
  currency?: string;
};

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const { isSignedIn } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const data = await getEvent(api, Number(id));
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Could not load event details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadEvent();
  }, [id]);

  const handleJoin = async () => {
    if (!isSignedIn) {
      navigate("/signup");
      return;
    }

    if (!event) return;
    try {
      setJoining(true);
      await signupEvent(api, event.id);
      toast.success("Successfully joined the event!");
    } catch (err) {
      console.error("Error joining event:", err);
      toast.error("Failed to sign up for this event. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  if (loading)
    return (
      <main className="max-w-5xl mx-auto p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-60 w-full rounded-xl" />
        <Skeleton className="h-8 w-1/4" />
      </main>
    );

  if (error)
    return (
      <main className="max-w-5xl mx-auto p-8 text-center text-red-500">
        {error}
      </main>
    );

  if (!event) return null;

  return (
    <motion.main
      className="max-w-5xl mx-auto px-6 py-16 space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <div className="relative p-10 sm:p-16 text-white flex flex-col justify-end min-h-[320px]">
          <div className="space-y-3">
            <Badge
              variant="secondary"
              className="text-sm bg-white/30 text-white backdrop-blur-md"
            >
              {event.isPaid ? "Premium Event" : "Free Event"}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg">
              {event.title}
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl">
              {event.description || "No description available."}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="rounded-2xl shadow-lg backdrop-blur-md bg-white/70 dark:bg-black/40 border border-border/40"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Event Details
              </CardTitle>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(event.startTime).toLocaleDateString()} •{" "}
                  {new Date(event.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </CardHeader>

          <Separator className="my-4" />

          <CardContent className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-lg font-medium">About this Event</h2>
              <p className="text-muted-foreground leading-relaxed">
                {event.description || "No additional details provided."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {event.isPaid ? (
                <Badge variant="secondary" className="text-base py-2 px-4">
                  💳 {event.price} {event.currency?.toUpperCase()}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-base py-2 px-4">
                  Free Event
                </Badge>
              )}

              <Button
                size="lg"
                onClick={() => setShowModal(true)}
                disabled={joining}
                className="rounded-full shadow-md w-full sm:w-auto"
              >
                Join Event
              </Button>

              <JoinEventModal
                open={showModal}
                onOpenChange={setShowModal}
                event={event}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.main>
  );
}
