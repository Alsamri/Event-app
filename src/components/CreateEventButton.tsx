import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "@/lib/useApi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMe } from "@/services/userService";

interface CreateEventButtonProps {
  variant?: "default" | "outline" | "ghost" | "link" | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  animate?: boolean;
}

export function CreateEventButton({
  variant = "gradient",
  size = "default",
  className,
  showIcon = true,
  showLabel = true,
  animate = true,
}: CreateEventButtonProps) {
  const navigate = useNavigate();
  const { userId, isLoaded } = useAuth();
  const api = useApi();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded) {
        setLoading(false);
        return;
      }

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getMe(api);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, isLoaded, api]);


  if (loading) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={cn("opacity-70", className)}
      >
        <Loader2 className={cn("w-4 h-4 animate-spin", showLabel && "mr-2")} />
        {showLabel && "Loading..."}
      </Button>
    );
  }

  if (!user || user.role !== "staff") {
    return null;
  }

  const handleClick = () => {
    navigate("/events/create");
  };

  
  const gradientStyles = "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25";

  const buttonContent = (
    <Button
      onClick={handleClick}
      variant={variant === "gradient" ? "default" : variant}
      size={size}
      className={cn(
        variant === "gradient" && gradientStyles,
        "transition-all duration-200",
        className
      )}
    >
      {showIcon && <Sparkles className={cn("w-4 h-4", showLabel && "mr-2")} />}
      {showLabel && "Create Event"}
    </Button>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {buttonContent}
      </motion.div>
    );
  }

  return buttonContent;
}


export function CreateEventFAB() {
  return (
    <CreateEventButton
      size="icon"
      showLabel={false}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/25 border-0"
      animate={true}
    />
  );
}


export function CreateEventNavButton() {
  return (
    <CreateEventButton
      showIcon={true}
      showLabel={true}
      className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
      animate={false}
    />
  );
}


export function CreateEventSidebarButton() {
  return (
    <CreateEventButton
      variant="gradient"
      size="default"
      className=" justify-start rounded-lg"
      animate={false}
    />
  );
}

export function CreateEventGhostButton() {
  return (
    <CreateEventButton
      variant="ghost"
      showIcon={true}
      showLabel={true}
      className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
      animate={false}
    />
  );
}


export function CreateEventProminentButton() {
  return (
    <CreateEventButton
      size="lg"
      className="rounded-xl px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25"
      animate={true}
    />
  );
}


export function CreateEventTextButton() {
  return (
    <CreateEventButton
      variant="link"
      showIcon={false}
      className="text-blue-600 hover:text-blue-700 font-semibold"
      animate={false}
    />
  );
}