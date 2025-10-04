import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp path="/signup" signInUrl="/login" forceRedirectUrl="/" />
    </div>
  );
}
