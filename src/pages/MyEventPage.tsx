
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/lib/useApi";
import { listMyEvents } from "@/services/signupService";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, MapPin, ArrowRight, Calendar } from "lucide-react";
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
  addedToCalendar?: boolean;
  googleEventId?: string;
};

export default function MyEventsPage() {
  const api = useApi();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyEvents() {
      try {
        setLoading(true);
        const data = await listMyEvents(api);
        setEvents(data);
        
        
      } catch (err) {
        console.error("Error fetching my events:", err);
        toast.error("Could not load your events.");
      } finally {
        setLoading(false);
      }
    }

    loadMyEvents();
  }, [api]);

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <motion.main
      className="max-w-6xl mx-auto p-6 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Events
        </h1>
        <p className="text-muted-foreground text-lg">
          Events you've signed up for and are attending
        </p>
        <Badge variant="secondary" className="text-sm">
          {events.length} {events.length === 1 ? 'Event' : 'Events'}
        </Badge>
      </motion.div>

     
      {events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No events yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't signed up for any events yet.
          </p>
          <Button 
            onClick={() => navigate("/events")}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Browse Events
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {events.map((event, index) => (
            <motion.div
              key={event.eventId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full backdrop-blur-md bg-white/70 dark:bg-black/40 border border-border/40 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={event.isPaid ? "default" : "secondary"}>
                      {event.isPaid ? `$${event.price}` : "Free"}
                    </Badge>
                    {event.addedToCalendar && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        ✅ Calendar
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl line-clamp-2">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatEventTime(event.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description || "No description available."}
                  </p>

                  <Button 
                    onClick={() => navigate(`/events/${event.eventId}`)}
                    variant="outline" 
                    className="w-full group"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.main>
  );
}