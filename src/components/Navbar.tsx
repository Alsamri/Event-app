import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <header className="w-full flex justify-center py-4">
      <div
        className="backdrop-blur-md bg-white/30 dark:bg-black/30 shadow-lg rounded-2xl 
                   px-6 py-3 flex items-center justify-between w-[80%] max-w-4xl"
      >
        {/* Logo + title */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--primary))",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle cx="12" cy="8" r="3.5" fill="white" opacity="0.9" />
              <path
                d="M6 20c1-4 11-4 13 0"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-semibold text-lg text-foreground">
            Event Platform
          </span>
        </Link>

        {/* Right side nav */}
        <nav className="flex items-center gap-3">
          <Link
            to="/events"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Events
          </Link>

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
