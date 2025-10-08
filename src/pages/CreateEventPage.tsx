import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/lib/useApi";
import { createEvent } from "@/services/eventService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Clock,
  MapPin,
  DollarSign,
  Sparkles,
  Users,
  Globe,
  Zap,
} from "lucide-react";
import { format, setHours, setMinutes } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function CreateEventPage() {
  const api = useApi();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startDate: new Date(),
    startTime: "09:00",
    endDate: new Date(),
    endTime: "17:00",
    isPaid: false,
    price: "",
    currency: "USD",
    capacity: "",
    category: "general",
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    return setMinutes(setHours(date, hours), minutes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const startTime = combineDateAndTime(form.startDate, form.startTime);
      const endTime = combineDateAndTime(form.endDate, form.endTime);

      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isPaid: form.isPaid,
        price: form.isPaid ? Number(form.price) : undefined,
        currency: form.currency,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        category: form.category,
      };

      await createEvent(api, payload);
      
    
      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Event created successfully!
        </div>,
        {
          duration: 3000,
        }
      );
      
      
      setTimeout(() => navigate("/events"), 1500);
    } catch (err) {
      console.error("Error creating event:", err);
      toast.error("Failed to create event. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

 const steps = [
    { id: 1, title: "Basic Info", icon: Zap },
    { id: 2, title: "Date & Time", icon: Clock },
    { id: 3, title: "Pricing & Details", icon: DollarSign },
  ];
const CurrentStepIcon = steps[currentStep - 1].icon;
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/10 py-8 px-4">
      <div className="max-w-4xl mx-auto">
      
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <Badge variant="secondary" className="text-sm">
              
            </Badge>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 mb-2">
            Create New Event
          </h1>
          <p className="text-muted-foreground text-lg">
            Craft unforgettable experiences in minutes
          </p>
        </motion.div>

       
       <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-4 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <motion.div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300",
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentStep > step.id ? "✓" : <StepIcon className="w-4 h-4" />}
                  </motion.div>
                  <span className={cn(
                    "font-medium hidden sm:block",
                    currentStep >= step.id ? "text-gray-900 dark:text-white" : "text-gray-500"
                  )}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-8 h-0.5 mx-2",
                      currentStep > step.id ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-gray-200 dark:bg-gray-700"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-black/40 border border-white/20 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <CurrentStepIcon className="w-6 h-6 text-blue-500" />
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
         

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-8 p-8">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex flex-col space-y-2"
                        >
                          <Label className="flex items-center gap-2 text-sm font-semibold">
                            <Zap className="w-4 h-4 text-blue-500" />
                            Event Title
                          </Label>
                          <Input
                            placeholder="Tech Conference 2024"
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors"
                            required
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex flex-col space-y-2"
                        >
                          <Label className="flex items-center gap-2 text-sm font-semibold">
                            <MapPin className="w-4 h-4 text-green-500" />
                            Location
                          </Label>
                          <Input
                            placeholder="Virtual or Physical location"
                            value={form.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            className="h-12 rounded-xl border-2 focus:border-green-500 transition-colors"
                            required
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col space-y-2"
                      >
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                          <Globe className="w-4 h-4 text-purple-500" />
                          Description
                        </Label>
                        <Textarea
                          placeholder="Describe what attendees can expect... Be engaging and clear!"
                          value={form.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          className="min-h-[120px] rounded-xl border-2 focus:border-purple-500 transition-colors resize-none"
                        />
                      </motion.div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4 p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200/50"
                        >
                          <Label className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                            <CalendarIcon className="w-4 h-4" />
                            Start Date & Time
                          </Label>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal h-12 rounded-xl border-2 hover:border-blue-500 transition-colors"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(form.startDate, "PPP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                              <Calendar
                                mode="single"
                                selected={form.startDate}
                                onSelect={(date) => handleChange("startDate", date ?? new Date())}
                                className="rounded-xl"
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <Input
                              type="time"
                              value={form.startTime}
                              onChange={(e) => handleChange("startTime", e.target.value)}
                              className="rounded-xl border-2 focus:border-blue-500 transition-colors"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-4 p-6 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-purple-200/50"
                        >
                          <Label className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
                            <CalendarIcon className="w-4 h-4" />
                            End Date & Time
                          </Label>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal h-12 rounded-xl border-2 hover:border-purple-500 transition-colors"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(form.endDate, "PPP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                              <Calendar
                                mode="single"
                                selected={form.endDate}
                                onSelect={(date) => handleChange("endDate", date ?? new Date())}
                                className="rounded-xl"
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <Input
                              type="time"
                              value={form.endTime}
                              onChange={(e) => handleChange("endTime", e.target.value)}
                              className="rounded-xl border-2 focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl border"
                      >
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <div>
                            <Label className="font-semibold">Paid Event</Label>
                            <p className="text-sm text-muted-foreground">
                              Charge attendees for this event
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={form.isPaid}
                          onCheckedChange={(checked) => handleChange("isPaid", checked)}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </motion.div>

                      <AnimatePresence>
                        {form.isPaid && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid gap-4 md:grid-cols-3"
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex flex-col space-y-2"
                            >
                              <Label>Price</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  value={form.price}
                                  onChange={(e) => handleChange("price", e.target.value)}
                                  className="pl-9 h-12 rounded-xl border-2 focus:border-green-500 transition-colors"
                                />
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-col space-y-2"
                            >
                              <Label>Currency</Label>
                              <Select
                                value={form.currency}
                                onValueChange={(v) => handleChange("currency", v)}
                              >
                                <SelectTrigger className="h-12 rounded-xl border-2 focus:border-green-500 transition-colors">
                                  <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                  <SelectItem value="USD">USD ($)</SelectItem>
                                  <SelectItem value="EUR">EUR (€)</SelectItem>
                                  <SelectItem value="GBP">GBP (£)</SelectItem>
                                </SelectContent>
                              </Select>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex flex-col space-y-2"
                            >
                              <Label className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Capacity
                              </Label>
                              <Input
                                type="number"
                                placeholder="Unlimited"
                                value={form.capacity}
                                onChange={(e) => handleChange("capacity", e.target.value)}
                                className="h-12 rounded-xl border-2 focus:border-blue-500 transition-colors"
                              />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>

              <CardFooter className="flex justify-between p-8 pt-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="rounded-full px-6 border-2"
                  >
                    Back
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="rounded-full px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="rounded-full px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Create Event
                        </>
                      )}
                    </Button>
                  )}
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}