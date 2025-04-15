"use client";

import { Button } from "@/components/ui/button";
import { Brush, Users, Zap, Share2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-primary">
              Create Together,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Draw Together
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience real-time collaborative drawing like never before. Share your creativity with teammates, friends, and artists worldwide.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Button onClick={() => router.push("/signin")} size="lg" className="gap-2">
                Start Drawing <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brush className="w-10 h-10 text-blue-500" />}
              title="Powerful Tools"
              description="Professional-grade drawing tools that work seamlessly across all devices."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-purple-500" />}
              title="Real-time Collaboration"
              description="Work together with your team in real-time, seeing changes instantly."
            />
            <FeatureCard
              icon={<Share2 className="w-10 h-10 text-green-500" />}
              title="Easy Sharing"
              description="Share your work with a single click and collaborate with anyone, anywhere."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10">
            Join thousands of creators and teams who are already using our platform to bring their ideas to life.
          </p>
          <Button onClick={() => router.push("/signup")} size="lg" variant="secondary" className="gap-2">
            Get Started for Free <Zap className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}