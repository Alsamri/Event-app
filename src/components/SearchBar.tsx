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
        placeholder="Search events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-full px-4 py-2"
      />
      <Button type="submit" size="icon" className="rounded-full">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
