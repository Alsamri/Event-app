import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
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
      <div className="backdrop-blur-md bg-white/30 dark:bg-black/30 shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between w-full max-w-6xl">
        
  
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <img 
              src="/iconweb.png" 
              alt="EventX Logo" 
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <span className="font-semibold text-foreground">
            EventX
          </span>
        </Link>

      
        <nav className="hidden sm:flex items-center gap-6 ml-8">
          <Link 
            to="/events" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Events
          </Link>
          
          <SignedIn>
            <Link 
              to="/my-events" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My Events
            </Link>
          </SignedIn>
        </nav>

    
        <div className="flex-1"></div>

      
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <SearchBar />
          </div>

          
          <SignedIn>
            <div className="hidden sm:block">
              <CreateEventNavButton />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="hidden sm:flex items-center gap-2">
               <SignInButton mode="modal">
      <Button variant="ghost" size="sm">Sign in</Button>
    </SignInButton>
    <SignUpButton mode="modal">
      <Button size="sm" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
        Sign up
      </Button>
    </SignUpButton>
            </div>
          </SignedOut>

          
          <SignedIn>
            <div className="hidden sm:block">
              <UserButton afterSignOutUrl="/" />
            </div>
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
                    
                    <SignedIn>
                      <Link 
                        to="/my-events" 
                        className="flex items-center justify-center gap-3 p-4 rounded-lg hover:bg-accent transition-colors text-lg font-medium"
                      >
                        <Calendar className="h-5 w-5" />
                        <span>My Events</span>
                      </Link>
                    </SignedIn>

                    <SignedIn>
                      <div className="pt-4">
                        <CreateEventNavButton />
                      </div>
                    </SignedIn>

                    <SignedOut>
                      <div className="space-y-3 pt-4">
               <SignInButton mode="modal">
      <Button variant="ghost" size="sm" className="w-full max-w-[200px] mx-auto">Sign in</Button>
    </SignInButton>
    <SignUpButton mode="modal">
      <Button size="sm" className="w-full max-w-[200px] mx-auto">
        Sign up
      </Button>
    </SignUpButton>
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