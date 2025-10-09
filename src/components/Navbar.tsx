// src/components/NavBar.tsx
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import {  CreateEventNavButton } from "./CreateEventButton";

export default function NavBar() {
  return (
    <header className="w-full flex justify-center py-4">
      <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between w-[90%] max-w-6xl">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-500 text-white">
            E
          </div>
          <span className="font-semibold text-lg text-foreground">
            Event Platform
          </span>
        </Link>

        <div className="flex-1 px-6">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-3">
          <Link to="/events" className="text-sm text-muted-foreground">
            Events
          </Link>
           <div className="flex items-center gap-4">
          <CreateEventNavButton />
        </div>
          <SignedOut>
            <SignInButton>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <Link to="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
