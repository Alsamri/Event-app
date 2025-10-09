import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { CreateEventNavButton } from "./CreateEventButton";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Calendar } from "lucide-react";

export default function NavBar() {
  return (
    <header className="w-full flex justify-center py-4 px-4">
      <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 shadow-lg rounded-2xl px-4 py-3 flex items-center justify-between w-full max-w-6xl">
      
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-500 text-white">
            E
          </div>
          <span className="font-semibold text-foreground">
            Event Platform
          </span>
        </Link>

        {/* ONLY CHANGED THIS SECTION - Center the navigation links */}
        <div className="hidden sm:flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground">
            Events
          </Link>
          <Link to="/my-events" className="text-sm text-muted-foreground hover:text-foreground">
            My Events
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>

          <div className="hidden sm:block">
            <CreateEventNavButton />
          </div>

          <SignedOut>
            <div className="hidden sm:flex gap-2">
              <SignInButton>
                <Button variant="ghost" size="sm">Sign in</Button>
              </SignInButton>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[240px]"> 
                <div className="flex flex-col h-100 justify-center"> 
                  <div className="space-y-6 text-center"> 
                    <Link 
                      to="/events" 
                      className="flex items-center justify-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors text-lg font-medium"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>All Events</span>
                    </Link>
                    
                    <Link 
                      to="/my-events" 
                      className="flex items-center justify-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors text-lg font-medium"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>My Events</span>
                    </Link>

                    <SignedIn>
                      <div className="pt-4">
                       <CreateEventNavButton />
                      </div>
                    </SignedIn>

                    <SignedOut>
                      <div className="space-y-3 pt-4">
                        <SignInButton>
                          <Button variant="outline" className="w-full max-w-[200px] mx-auto">
                            Sign In
                          </Button>
                        </SignInButton>
                        <Link to="/signup">
                          <Button className="w-full max-w-[200px] mx-auto">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    </SignedOut>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}