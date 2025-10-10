import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@/lib/useApi";
import { getEvent, deleteEvent } from "@/services/eventService";
import { listMyEvents} from "@/services/signupService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, ArrowLeft, Edit, Trash2, MoreVertical, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { JoinEventModal } from "@/components/JoinEventModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getMe } from "@/services/userService";

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
  eventId?:number
};

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const { isSignedIn, userId } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
 
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
const [isSignedUp, setIsSignedUp] = useState(false);
const [checkingSignup, setCheckingSignup] = useState(true);
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
  }, [id, api]);


  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isSignedIn || !userId) return;
      
      try {
    
        const response = await getMe(api)
      
        
        setUserRole(response.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    fetchUserRole();
  }, [isSignedIn, userId, api]);


useEffect(() => {
  async function checkUserSignup() {
    if (!isSignedIn || !event) return;
    
    try {
      const myEvents = await listMyEvents(api);
    
      const isUserSignedUp = myEvents.some((e: Event) => e.eventId === event.id);
      setIsSignedUp(isUserSignedUp);
    } catch (err) {
      console.error("Error checking user signup:", err);
    } finally {
      setCheckingSignup(false);
    }
  }

  if (event) {
    checkUserSignup();
  }
}, [event, isSignedIn, api]);


  const handleEdit = () => {
    if (!event) return;
    navigate(`/events/${event.id}/edit`);
    console.log(event);
    
  };

  const handleDelete = async () => {
    if (!event) return;
    
    try {
      setDeleting(true);
      await deleteEvent(api, event.id);
      toast.success("Event deleted successfully!");
      navigate("/events");
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const isStaff = userRole === "staff";

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
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="text-sm bg-white/30 text-white backdrop-blur-md"
              >
                {event.isPaid ? "Premium Event" : "Free Event"}
              </Badge>
              {isStaff && (
                <Badge
                  variant="secondary"
                  className="text-sm bg-green-500/30 text-white backdrop-blur-md"
                >
                  Staff
                </Badge>
              )}
            </div>
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
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={() => navigate('/events')}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              
            
              {isStaff && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
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
              <div className="flex items-center gap-4">
                {event.isPaid ? (
                  <Badge variant="secondary" className="text-base py-2 px-4">
                    💳 {event.price} {event.currency?.toUpperCase()}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-base py-2 px-4">
                    Free Event
                  </Badge>
                )}
                
                
                {isStaff && (
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="rounded-full"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                      className="rounded-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              
  {checkingSignup ? (
    <Skeleton className="h-10 w-32 rounded-full" />
  ) : isSignedUp ? (
    <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
      <CheckCircle2 className="w-4 h-4" />
      <span className="font-medium">You're Going!</span>
    </div>
  ) : (
    <>
      <Button
        size="lg"
        onClick={() => setShowModal(true)}
        className="rounded-full shadow-md w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Join Event
      </Button>

      <JoinEventModal
        open={showModal}
        onOpenChange={setShowModal}
        event={event}
        onSuccess={() => setIsSignedUp(true)} 
      />
    </>
  )}
</div>

          </CardContent>
        </Card>
      </motion.div>

     
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              "{event.title}" and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? "Deleting..." : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.main>
  );
}
