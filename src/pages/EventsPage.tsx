import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useApi } from "@/lib/useApi";
import { listEvents } from "@/services/eventService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Event = {
  id: number;
  title: string;
  location: string;
  startTime: string;
};

export default function EventsPage() {
  const api = useApi();
  const location = useLocation();
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

  if (loading) return <div className="p-6 text-center">Loading events...</div>;

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        {query ? `Search results for “${query}”` : "All Events"}
      </h1>

      {events.length === 0 ? (
        <p className="text-muted-foreground text-center mt-6">
          No events found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <Card key={e.id} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>{e.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{e.location}</p>
                <p className="text-sm">
                  {new Date(e.startTime).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
