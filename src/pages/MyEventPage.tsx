import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/useApi";
import { listMyEvents } from "@/services/signupService";
import { toast } from "sonner";

type Event = {
  eventId: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  isPaid?: boolean;
  price?: number;
  currency?: string;
};

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await listMyEvents(api);
        setEvents(data);
      } catch (err) {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [api]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <main className="min-h-screen bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center space-y-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-1.5 text-sm text-muted-foreground bg-muted/40 backdrop-blur">
            <CalendarDays className="w-4 h-4" /> My Events
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
            Your Upcoming Experiences
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Manage your event registrations, explore details, and relive your moments.
          </p>
        </motion.div>

      
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        )}

      
        {!loading && events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <CalendarDays className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-medium mb-2">No events yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven’t signed up for any events. Start discovering experiences today.
            </p>
            <Button
              onClick={() => navigate("/events")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Browse Events
            </Button>
          </motion.div>
        )}

       
        <AnimatePresence>
          {!loading && events.length > 0 && (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {events.map((event, i) => (
                <motion.div
                  key={event.eventId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Card className="relative group border border-border/60 bg-card/60 backdrop-blur-md hover:bg-card/80 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md">
                   
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge
                          variant="secondary"
                          className="px-2 py-1 rounded-md text-xs font-medium"
                        >
                          {event.isPaid ? `$${event.price}` : "Free"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event.startTime)}
                        </span>
                      </div>
                      <CardTitle className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                      <p className="line-clamp-3">{event.description}</p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {event.location || "TBA"}
                      </div>

                      <Button
                        onClick={() => navigate(`/events/${event.eventId}`)}
                        variant="outline"
                        className="w-full group-hover:border-primary transition-colors flex items-center justify-center gap-2"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
