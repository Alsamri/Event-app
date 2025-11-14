import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/lib/useApi";
import { addEventToCalendar } from "@/services/signupService";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export default function GoogleSuccessPage() {
  const navigate = useNavigate();
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [eventAdded, setEventAdded] = useState(false);

  useEffect(() => {
    const addPendingEventToCalendar = async () => {
      try {
        const pendingEventId = localStorage.getItem('pendingCalendarEvent');
        
        if (pendingEventId) {
         
          await addEventToCalendar(api, parseInt(pendingEventId));
          setEventAdded(true);
          toast.success("Event added to your Google Calendar!");
          localStorage.removeItem('pendingCalendarEvent');
        } 
    
        
      } catch (err: any) {
        console.error("Failed to add event to calendar:", err);
        if (err.response?.status === 400) {
          toast.error("Please try adding the event to calendar again");
        } else {
          toast.error("Failed to add event to calendar");
        }
      } finally {
        setLoading(false);
      }
    };

    setTimeout(addPendingEventToCalendar, 1000);
  }, [api]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:to-gray-800 p-4 pt-20">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/80 dark:bg-black/40 border border-white/20 shadow-2xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-muted-foreground">Completing setup...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center from-gray-900 dark:to-gray-800 p-4 pt-10">
      <Card className="w-full max-w-md backdrop-blur-md bg-white/80 dark:bg-black/40 border border-white/20 shadow-2xl rounded-2xl">
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {eventAdded ? "Success!" : "Connected!"}
            </h1>
            
            <p className="text-muted-foreground mb-8 text-lg">
              {eventAdded 
                ? "Your event has been added to Google Calendar successfully! 🎉"
                : "Your Google Calendar has been connected successfully! You can now add events to your calendar."
              }
            </p>

            <div className="space-y-3">
              <Button aria-label="google confirmation" 
                onClick={() => navigate("/events")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Browse More Events
              </Button>
              
              <Button aria-label="google confirmation" 
                variant="outline" 
                onClick={() => navigate("/my-events")}
                className="w-full"
              >
                View My Events
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}