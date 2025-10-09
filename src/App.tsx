import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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



function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path= "/events/:id/edit" element={<EditEventPage />}/>
         <Route path= "/google-success" element={<GoogleSuccessPage />}/>
      
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
      <Toaster />
    </Router>
  );
}

export default App;
