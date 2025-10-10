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
import { motion, AnimatePresence } from "framer-motion";
import { CreateEventSidebarButton } from "@/components/CreateEventButton";
import SearchBar from "@/components/SearchBar";
import { MapPin, Calendar, Users, Filter, X, DollarSign, Clock, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

type Event = {
  id: number;
  title: string;
  description?: string;
  location: string;
  startTime: string;
  endTime: string;
  isPaid: boolean;
  price?: number;
  currency?: string;
  payWhatYouFeel: boolean;
  createdAt: string;
  createdBy?: number;
};

export default function EventsPage() {
  const api = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "all",
    priceType: "all",
    dateRange: "all"
  });

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
  }, [query, api]);

  const locations = [...new Set(events.map(event => event.location).filter(Boolean))];


  const filteredEvents = events.filter(event => {
  
    if (filters.location !== "all" && event.location !== filters.location) return false;
    
  
    if (filters.priceType === "free" && event.isPaid) return false;
    if (filters.priceType === "paid" && !event.isPaid) return false;
    if (filters.priceType === "payWhatYouWant" && !event.payWhatYouFeel) return false;
    
    const eventDate = new Date(event.startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filters.dateRange === "today") {
      return eventDate.toDateString() === today.toDateString();
    }
    if (filters.dateRange === "week") {
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return eventDate >= today && eventDate <= weekFromNow;
    }
    if (filters.dateRange === "month") {
      const monthFromNow = new Date(today);
      monthFromNow.setDate(monthFromNow.getDate() + 30);
      return eventDate >= today && eventDate <= monthFromNow;
    }
    if (filters.dateRange === "upcoming") {
      return eventDate >= today;
    }
    
    return true;
  });

  const clearFilters = () => {
    setFilters({
      location: "all",
      priceType: "all",
      dateRange: "all"
    });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) return `${Math.round(diffHours * 60)}min`;
    if (diffHours < 24) return `${Math.round(diffHours)}h`;
    return `${Math.round(diffHours / 24)}d`;
  };

  const getPriceBadge = (event: Event) => {
    if (event.payWhatYouFeel) {
      return { label: "Pay What You Want", variant: "secondary" as const, icon: "💝" };
    }
    if (event.isPaid) {
      return { label: `$${event.price} ${event.currency?.toUpperCase()}`, variant: "default" as const, icon: "💳" };
    }
    return { label: "Free", variant: "secondary" as const, icon: "🎉" };
  };

  const getFilterLabel = (type: string, value: string) => {
    if (value === "all") return `All ${type}s`;
    
    const labels: { [key: string]: { [key: string]: string } } = {
      location: {},
      priceType: {
        free: "Free Only",
        paid: "Paid Only", 
        payWhatYouWant: "Pay What You Want"
      },
      dateRange: {
        today: "Today",
        week: "This Week",
        month: "This Month",
        upcoming: "Upcoming"
      }
    };
    
    return labels[type]?.[value] || value;
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "all");

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Discover Amazing Events
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Join workshops, meetups, and conferences that inspire and connect. Free, paid, or pay what you want.
        </p>
      </motion.div>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="space-y-4"
>
 
  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
    <div className="flex-1 w-full sm:max-w-md">
      <SearchBar initialQuery={query} />
    </div>
    
    <div className="flex items-center gap-2 w-full sm:w-auto">
   
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={hasActiveFilters ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1.5 border bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-150 flex-1 sm:flex-none"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-0.5 h-4 w-4 p-0 flex items-center justify-center bg-blue-500 text-white text-[10px]">
                !
              </Badge>
            )}
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="w-72 backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
        >
          <DropdownMenuLabel className="text-sm font-semibold flex items-center justify-between px-1">
            <span>Filter Events</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-5 text-xs text-muted-foreground hover:text-foreground px-2"
              >
                Clear All
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />

         
          <div className="space-y-2 mb-3">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100 px-1">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              Location
            </Label>
            <div className="flex flex-wrap gap-1">
              <Button
                variant={filters.location === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, location: "all" }))}
                className="text-xs h-7 px-2"
              >
                All
              </Button>
              {locations.slice(0, 4).map(location => (
                <Button
                  key={location}
                  variant={filters.location === location ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, location }))}
                  className="text-xs h-7 px-2"
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100 px-1">
              <DollarSign className="h-3.5 w-3.5 text-green-600" />
              Price Type
            </Label>
            <div className="flex flex-wrap gap-1">
              {[
                { value: "all", label: "All" },
                { value: "free", label: "Free" },
                { value: "paid", label: "Paid" },
                { value: "payWhatYouWant", label: "Pay What You Want" }
              ].map(option => (
                <Button
                  key={option.value}
                  variant={filters.priceType === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, priceType: option.value }))}
                  className="text-xs h-7 px-2"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

        
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100 px-1">
              <Calendar className="h-3.5 w-3.5 text-purple-600" />
              Date Range
            </Label>
            <div className="flex flex-wrap gap-1">
              {[
                { value: "all", label: "Any" },
                { value: "today", label: "Today" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "upcoming", label: "Upcoming" }
              ].map(option => (
                <Button
                  key={option.value}
                  variant={filters.dateRange === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, dateRange: option.value }))}
                  className="text-xs h-7 px-2"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

       
          {hasActiveFilters && (
            <>
              <DropdownMenuSeparator className="my-2" />
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold px-1">Active Filters:</Label>
                <div className="flex flex-wrap gap-1">
                  {filters.location !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs h-5 px-1.5">
                      <MapPin className="h-2.5 w-2.5" />
                      {filters.location}
                      <X 
                        className="h-2.5 w-2.5 ml-0.5 cursor-pointer" 
                        onClick={() => setFilters(prev => ({ ...prev, location: "all" }))}
                      />
                    </Badge>
                  )}
                  {filters.priceType !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs h-5 px-1.5">
                      <DollarSign className="h-2.5 w-2.5" />
                      {getFilterLabel("priceType", filters.priceType)}
                      <X 
                        className="h-2.5 w-2.5 ml-0.5 cursor-pointer" 
                        onClick={() => setFilters(prev => ({ ...prev, priceType: "all" }))}
                      />
                    </Badge>
                  )}
                  {filters.dateRange !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs h-5 px-1.5">
                      <Calendar className="h-2.5 w-2.5" />
                      {getFilterLabel("dateRange", filters.dateRange)}
                      <X 
                        className="h-2.5 w-2.5 ml-0.5 cursor-pointer" 
                        onClick={() => setFilters(prev => ({ ...prev, dateRange: "all" }))}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateEventSidebarButton />
    </div>
  </div>
</motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {query ? `Search: "${query}"` : "All Events"}
          </h2>
          <p className="text-muted-foreground">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            {hasActiveFilters && " with current filters"}
          </p>
        </div>
      </motion.div>

     
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 space-y-4 rounded-2xl">
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 space-y-4"
        >
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No events found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {hasActiveFilters 
              ? "Try adjusting your filters or search terms to see more events."
              : "Be the first to create an event in your community!"
            }
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
          {filteredEvents.map((event) => {
            const priceBadge = getPriceBadge(event);
            
            return (
              <motion.div
                key={event.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card 
                  className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-black/40 hover:scale-[1.02]"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                 
                  <div className="relative h-48 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge 
                        variant={priceBadge.variant} 
                        className="backdrop-blur-sm font-medium"
                      >
                        <span className="mr-1">{priceBadge.icon}</span>
                        {priceBadge.label}
                      </Badge>
                    </div>

                    
                    <div className="absolute top-4 right-4 text-right">
                      <div className="bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-lg p-2 text-center min-w-20">
                        <div className="text-sm font-bold text-foreground">
                          {formatEventDate(event.startTime)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatEventTime(event.startTime)}
                        </div>
                      </div>
                    </div>

                   
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="outline" className="backdrop-blur-sm bg-white/20 text-white border-white/30">
                        <Clock className="h-3 w-3 mr-1" />
                        {getEventDuration(event.startTime, event.endTime)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                   
                    <div className="space-y-3">
                      <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-muted-foreground leading-relaxed">
                        {event.description || "Join us for an amazing experience!"}
                      </CardDescription>
                    </div>

                    
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>
                          {new Date(event.startTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                  
                    <Button
                      className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                      size="lg"
                    >
                      View Event Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </main>
  );
}