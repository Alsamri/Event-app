import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "@/lib/useApi";
import { listEvents } from "@/services/eventService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Event = {
  id: number;
  title: string;
  description?: string;
  location: string;
  startTime: string;
  isPaid?: boolean;
  price?: number;
};

export default function EventsPage() {
  const api = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await listEvents(api, query ? { q: query } : {});
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [query]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          {query ? `Search results for “${query}”` : "Discover Upcoming Events"}
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore community-driven events, workshops, and meetups near you.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No events found.
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {events.map((e) => (
            <motion.div
              key={e.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/events/${e.id}`)}
              className="cursor-pointer"
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-all backdrop-blur-md bg-white/70 dark:bg-black/30 border border-border/40">
                <CardHeader className="p-0 relative">
                  <div className="h-40 w-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-700" />
                  <div className="absolute top-4 left-4">
                    {e.isPaid ? (
                      <Badge variant="secondary">${e.price}</Badge>
                    ) : (
                      <Badge>Free</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-3">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {e.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-muted-foreground">
                    {e.description || "No description available."}
                  </CardDescription>
                  <div className="flex justify-between items-center text-sm text-muted-foreground pt-3 border-t">
                    <span>{e.location}</span>
                    <span>{new Date(e.startTime).toLocaleDateString()}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-4 rounded-full"
                    variant="secondary"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
