import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="flex min-h-svh flex-col items-center justify-center">
          <Button>Click me</Button>
        </div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
          <h1 className="text-2xl font-bold">Welcome! You’re signed in 🎉</h1>
        </SignedIn>
      </div>
    </>
  );
}

export default App;
