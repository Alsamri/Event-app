import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

import WhyUseSection from "@/components/WhyUse";

export default function Landing() {
  return (
    <main className="min-h-screen bg-background mt-20 pt-5">
      <section className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 py-24 px-6 relative">
        {/* Hero Text */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-foreground">
            Create, Share & Join Community Events
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Host classes, meetups, and workshops — free or paid. Members can
            sign up, pay securely, and add events to their Google Calendar.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Link to="/signup">
              <Button size="lg" className="rounded-full">
                Get started — it’s free
              </Button>
            </Link>
            <Link to="/events">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full bg-blue-50 dark:bg-transparent"
              >
                Browse events
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center mt-16 lg:mt-0">
          <div className="hidden sm:block absolute -top-16 -left-8 w-64 md:w-72 lg:w-80 rounded-2xl shadow-md p-5 bg-white/50 dark:bg-black/30 backdrop-blur-md rotate-[-6deg] z-0">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Music Meetup
            </h4>
            <p className="text-xs text-muted-foreground">Sept 25 • New York</p>
          </div>

          <div className="hidden sm:block absolute top-54 left-8 w-64 md:w-72 lg:w-80 rounded-2xl shadow-md p-5 bg-white/40 dark:bg-black/20 backdrop-blur-md rotate-[5deg] z-0">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Design Sprint
            </h4>
            <p className="text-xs text-muted-foreground">Oct 2 • Online</p>
          </div>

          {/* Featured card */}
          <div className="relative z-10 w-full max-w-md rounded-2xl shadow-xl backdrop-blur-xl bg-white/70 dark:bg-black/40 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  Featured: Tech Conference 2025
                </h3>
                <p className="text-sm text-muted-foreground">
                  Oct 10 • San Francisco Convention Center
                </p>
              </div>
              <div className=" text-sm font-medium text-muted-foreground">
                Paid • $100
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-pink-400 to-purple-500">
                <p className="text-xs text-white/80">Workshops</p>
                <p className="text-sm font-semibold text-white">3 tracks</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-300 to-blue-300">
                <p className="text-xs text-black/70">Live Chat</p>
                <p className="text-sm font-semibold text-black">Realtime Q&A</p>
              </div>
            </div>
          </div>

          <div className="sm:hidden flex flex-col gap-3 absolute -bottom-36 w-full items-center">
            <div className="w-64 rounded-xl shadow-md p-4 bg-white/50 dark:bg-black/30 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Music Meetup
              </h4>
              <p className="text-xs text-muted-foreground">
                Sept 25 • New York
              </p>
            </div>
            <div className="w-64 rounded-xl shadow-md p-4 bg-white/40 dark:bg-black/20 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Design Sprint
              </h4>
              <p className="text-xs text-muted-foreground">Oct 2 • Online</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-20 px-6">
        <WhyUseSection />
      </section>
    </main>
  );
}
