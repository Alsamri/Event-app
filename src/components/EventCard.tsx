import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
type Event = {
  id: string;
  title: string;
  location: string;
  startTime: string;
  [key: string]: any;
};
export default function EventCard({ event }: Event) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(event.startTime).toLocaleString()} • {event.location}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm">
            {event.isPaid ? `$${event.price}` : "Free"}
          </div>
          <Link to={`/events/${event.id}`}>
            <Button size="sm" className="mt-2">
              View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
