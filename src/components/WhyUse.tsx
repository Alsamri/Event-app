import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, CreditCard, PlusSquare } from "lucide-react";

export default function WhyUseSection() {
  const features = [
    {
      title: "Easy event creation",
      description:
        "Create events in minutes and manage attendees from a simple dashboard.",
      icon: <PlusSquare className="w-6 h-6 text-pink-500" />,
      gradient: "from-pink-200/60 to-purple-200/60",
    },
    {
      title: "Payments powered by Stripe",
      description:
        "Choose fixed price or 'pay what you feel' with secure Stripe payments.",
      icon: <CreditCard className="w-6 h-6 text-blue-500" />,
      gradient: "from-blue-200/60 to-cyan-200/60",
    },
    {
      title: "Calendar integration",
      description:
        "Attendees can add events to Google Calendar with one click.",
      icon: <Calendar className="w-6 h-6 text-green-500" />,
      gradient: "from-green-200/60 to-emerald-200/60",
    },
  ];

  return (
    <section className="py-20 container-max">
      <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
        Why use Event Platform?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <Card
            key={i}
            className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br p-[1px]"
            style={{
              backgroundImage: `linear-gradient(to bottom right, var(--accent), transparent)`,
            }}
          >
            <div className="bg-card rounded-2xl p-6 h-full flex flex-col">
              <CardHeader className="flex flex-col items-start gap-4">
                {/* Icon badge */}
                <div
                  className={`p-3 rounded-full bg-gradient-to-r ${f.gradient} shadow-sm`}
                >
                  {f.icon}
                </div>

                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
