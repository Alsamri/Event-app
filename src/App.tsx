import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NavBar from "./components/Navbar";
import Landing from "./pages/Landing";
import EventsPage from "./pages/EventsPage";
import { Toaster } from "sonner";
import EventDetailsPage from "./pages/EventDetailsPage";
import CreateEventPage from "./pages/CreateEventPage";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import EditEventPage from "./pages/EditEventPage";
import GoogleSuccessPage from "./pages/GoogleSuccessPage";
import MyEventsPage from "./pages/MyEventPage";

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/events/:id/edit" element={<EditEventPage />}/>
            <Route path="/google-success" element={<GoogleSuccessPage />}/>
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route 
              path="/events/create" 
              element={
                <SignedIn>
                  <CreateEventPage />
                </SignedIn>
              } 
            />
            <Route 
              path="*" 
              element={
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              } 
            />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
