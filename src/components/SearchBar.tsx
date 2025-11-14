import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/events?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 w-full max-w-md mx-auto"
    >
      <Input
        type="text"
        aria-label="Search events input"
        placeholder="Search events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-full px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-all duration-200"
      />
      <Button 
      aria-label="Search event"
        type="submit" 
        size="icon" 
        className="rounded-full dark:bg-gray-900/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 transition-all duration-200"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
